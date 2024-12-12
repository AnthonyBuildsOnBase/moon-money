import fs from "fs";
import path from "path";
import { getName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

async function cleanTransactionData(walletAddress) {
  const sourceFilePath = path.resolve(
    `src/assets/data/${walletAddress}/transactions.json`
  );
  const targetFilePath = path.resolve(
    `src/assets/data/${walletAddress}/cleanTransactions.json`
  );
  const tagsFilePath = path.resolve(
    `src/assets/data/${walletAddress}/tags.json`
  );

  let rawData;
  try {
    rawData = fs.readFileSync(sourceFilePath, "utf-8");
  } catch (error) {
    console.error(`Error reading source file: ${error.message}`);
    return;
  }

  let sourceData;
  try {
    sourceData = JSON.parse(rawData);
  } catch (error) {
    console.error(`Error parsing JSON data: ${error.message}`);
    return;
  }

  // Check if sourceData is an array
  if (!Array.isArray(sourceData)) {
    console.error("Invalid data format: Expected an array of transactions.");
    return;
  }

  const resolveName = async (address) => {
    try {
      if (!address) return "";
      const name = await getName({ address, chain: base });
      return name || `${address.slice(0, 6)}...${address.slice(-4)}`;
    } catch (error) {
      console.error(`Error resolving name for ${address}: ${error.message}`);
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
  };

  const cleanedData = await Promise.all(
    sourceData.map(async (transaction) => {
      const ethereum = transaction.ethereum || {};
      const blockTimestamp = ethereum.blockTimestamp || "";

      const dateTime = blockTimestamp ? new Date(blockTimestamp) : null;
      const date = dateTime ? dateTime.toISOString().split("T")[0] : "";
      const time = dateTime
        ? dateTime.toISOString().split("T")[1].split(".")[0]
        : "";

      const toName = await resolveName(ethereum.to);
      const fromName = await resolveName(ethereum.from);

      return {
        Date: date,
        Time: time,
        Value: ethereum.value || "0",
        To: toName,
        From: fromName,
        Hash: ethereum.hash || "",
      };
    })
  );

  console.log("Cleaned Data:", cleanedData); // Debug log for cleanedData

  try {
    fs.writeFileSync(targetFilePath, JSON.stringify(cleanedData, null, 2));
    console.log(`Cleaned data written to ${targetFilePath}`);
  } catch (error) {
    console.error(`Error writing to target file: ${error.message}`);
  }

  let userTags = [];
  try {
    if (fs.existsSync(tagsFilePath)) {
      const tagsRawData = fs.readFileSync(tagsFilePath, "utf-8");
      userTags = JSON.parse(tagsRawData);
    }
  } catch (error) {
    console.error(`Error reading tags file: ${error.message}`);
  }

  const existingHashes = new Set(userTags.map((tag) => tag.Hash));
  console.log("Existing Hashes:", existingHashes); // Debug log for existing hashes

  cleanedData.forEach((transaction) => {
    if (transaction.Hash && !existingHashes.has(transaction.Hash)) {
      userTags.push({
        Type: "",
        Details: "",
        Hash: transaction.Hash,
      });
    }
  });

  console.log("Updated User Tags:", userTags); // Debug log for updated userTags

  try {
    fs.writeFileSync(tagsFilePath, JSON.stringify(userTags, null, 2));
    console.log(`User tags updated at ${tagsFilePath}`);
  } catch (error) {
    console.error(`Error writing to tags file: ${error.message}`);
  }
}

// Replace this with the actual wallet address you want to process
const walletAddress = "0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896";

cleanTransactionData(walletAddress).catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
});
