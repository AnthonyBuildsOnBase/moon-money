import fetch from "cross-fetch"; // Use cross-fetch for compatibility
import fs from "fs";
import path from "path";

// Replace with your RPC URL
const providerUrl =
  "https://api.developer.coinbase.com/rpc/v1/base/uIPZ98fjLaKE3yKltlVBhMewDhtOBJyD";

// Function to fetch all transactions for a wallet using Coinbase RPC with pagination
export async function getTransactions(walletAddress) {
  console.log("Starting to fetch.");

  let transactions = [];
  let pageToken = ""; // Start with an empty pageToken
  const pageSize = 1; // Maximum allowed size

  try {
    while (true) {
      const requestBody = {
        id: 1,
        jsonrpc: "2.0",
        method: "cdp_listAddressTransactions",
        params: [
          {
            address: walletAddress.toLowerCase(),
            pageToken: pageToken,
            pageSize: pageSize,
          },
        ],
      };

      const response = await fetch(providerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.result) {
        const newTransactions = data.result.addressTransactions || [];
        transactions = transactions.concat(newTransactions); // Append new transactions
        console.log(`Fetched ${newTransactions.length} transactions...`);

        // Update pageToken for the next request
        pageToken = data.result.nextPageToken || null;

        // Break the loop if no more transactions are available
        if (!pageToken) {
          console.log("All transactions fetched.");
          break;
        }
      } else {
        console.error("Unexpected response format or empty result:", data);
        break;
      }
    }

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Save transactions to a file
export function saveTransactionsToFile(transactions, filename) {
  try {
    const dir = path.dirname(filename); // Get the directory part of the filename
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Ensure the directory exists
    }
    fs.writeFileSync(filename, JSON.stringify(transactions, null, 2), "utf8");
    console.log(`Transactions saved to ${filename}`);
  } catch (error) {
    console.error("Error saving transactions to file:", error);
  }
}

/*
// Example usage (can be removed if this is strictly a module)
(async () => {
  const walletAddress = "0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896"; // Replace with your wallet address
  const transactions = await getTransactions(walletAddress);

  if (transactions.length > 0) {
    saveTransactionsToFile(
      transactions,
      `src/assets/data/${walletAddress}/transactions.json`
    );
  } else {
    console.log("No transactions found for the given wallet address.");
  }
})();
*/

