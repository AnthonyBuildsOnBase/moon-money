import fs from "fs";
import { ethers } from "ethers";
import { fileURLToPath } from "url";
import path from "path";

// Resolve the correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility to load ABI files dynamically
function loadAbi(fileName) {
  const abiPath = path.resolve(__dirname, `../abis/${fileName}.json`);
  return JSON.parse(fs.readFileSync(abiPath, "utf8"));
}

// Initialize the provider
const provider = new ethers.JsonRpcProvider(
  "https://api.developer.coinbase.com/rpc/v1/base/uIPZ98fjLaKE3yKltlVBhMewDhtOBJyD"
);

// Find block by timestamp
async function findBlockByTimestamp(targetTimestamp) {
  console.log(
    `Finding block for timestamp: ${new Date(targetTimestamp * 1000).toISOString()}`
  );
  let [low, high] = [0, await provider.getBlockNumber()];
  let closestBlock = null;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const block = await provider.getBlock(mid);
    if (!block) {
      console.warn(`Block not found at: ${mid}`);
      return null;
    }

    if (block.timestamp < targetTimestamp) {
      low = mid + 1;
      closestBlock = block;
    } else if (block.timestamp > targetTimestamp) {
      high = mid - 1;
    } else {
      return block;
    }
  }
  return closestBlock;
}

// Fetch balances data
async function fetchBalancesData(contract, walletAddress, blockTag = "latest") {
  try {
    const rawShares = await contract.balanceOf(walletAddress, { blockTag });
    const rawAssets = await contract.convertToAssets(rawShares, { blockTag });


    //const decimals = 0//await contract.decimals();

    const symbol = await contract.symbol();
    let decimals;

    if (symbol.toLowerCase().includes("usdc") || symbol.toLowerCase().includes("eurc")) {
      decimals = 6;
    } else {
      decimals = 18;
    }




    const scale = BigInt(10) ** BigInt(decimals);
    const assetDollarValue = 1n; // Assuming USDC (1:1 with USD)
    const usdValueBigInt = (rawAssets * assetDollarValue) / scale;

    return {
      shares: ethers.formatUnits(rawShares, decimals),
      assets: ethers.formatUnits(rawAssets, decimals),
      usdValue: parseFloat(usdValueBigInt.toString()).toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching balances data:", error);
    throw error;
  }
}

// Fetch daily ending balances
async function fetchDailyEndingBalances(contract, walletAddress, days = 30) {
  const now = Math.floor(Date.now() / 1000);
  const balances = [];
  let currentDate = new Date(now * 1000);
  currentDate.setUTCHours(23, 59, 59, 999);

  for (let i = 0; i < days; i++) {
    const timestamp = Math.floor(currentDate.getTime() / 1000);
    const block = await findBlockByTimestamp(timestamp);
    if (!block) {
      currentDate.setUTCDate(currentDate.getUTCDate() - 1);
      continue;
    }

    const data = await fetchBalancesData(contract, walletAddress, block.number);
    balances.push({
      date: currentDate.toISOString().split("T")[0],
      blockNumber: block.number,
      ...data,
    });

    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  }

  return balances;
}

// Save balances to a file
function saveBalancesToFile(fileName, walletAddress, balances) {
  // Resolve the base path to the correct directory (e.g., src/assets/data)
  const baseDir = path.resolve(__dirname, '../data'); // Adjust as needed to match your structure
  const dirPath = path.join(baseDir, walletAddress);
  const filePath = path.join(dirPath, fileName);

  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write the balances to the file
  fs.writeFileSync(filePath, JSON.stringify(balances, null, 2));
  console.log(`Balances saved to ${filePath}`);
}

// Main process function
async function processBalances({ walletAddress, contractAddress, abiFile, days }) {
  const abi = loadAbi(abiFile);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  console.log(`Fetching balances for wallet: ${walletAddress}`);

  // Fetch the contract name
  const contractName = await contract.name();

  const balances = await fetchDailyEndingBalances(contract, walletAddress, days);

  // Save balances with the contract name in the filename
  const fileName = `${contractName}_balances.json`;
  saveBalancesToFile(fileName, walletAddress, balances);

  console.log("Process complete.");
}

// Execute for multiple positions
async function main(configurations) {
  for (const config of configurations) {
    const { walletAddress, contractAddress, abiFile, days } = config;
    try {
      await processBalances({ walletAddress, contractAddress, abiFile, days });
    } catch (error) {
      console.error(`Error processing for wallet: ${walletAddress}`, error);
    }
  }
}

(async () => {
  const configurations = [
    {
      walletAddress: "0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896",
      contractAddress: "0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca",
      abiFile: "mwUSDC",
      days: 30,
    },
    {
      walletAddress: "0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896",
      contractAddress: "0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1",
      abiFile: "mwUSDC",
      days: 30,
    },
  ];

  await main(configurations);
})();