<template>
  <button :style="buttonStyles" @click="createWallet">
    <CoinbaseWalletLogo />
    Connect Wallet
  </button>
</template>

<script>
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import CoinbaseWalletLogo from './CoinbaseWalletLogo.vue';
import { useWalletStore } from '@/stores/walletStore.js'; // Import Pinia store
  import axios from "axios";

  import { getTransactions, saveTransactionsToFile } from '@/assets/Functions/transactions.js'; // Import your functions



  
export default {
  name: 'ConnectWallet',
  data() {
    return {
      buttonStyles: {
        background: 'transparent',
        border: '1px solid transparent',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '200px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: '18px',
        backgroundColor: '#0052FF',
        paddingLeft: '15px',
        paddingRight: '30px',
        borderRadius: '10px',
        color: '#fff',
        cursor: 'pointer',
      },
      sdk: null,
      provider: null,
    };
  },
  created() {
    this.sdk = new createCoinbaseWalletSDK({
      appName: 'My Dapp',
      appLogoUrl: 'https://example.com/logo.png',
      appChainIds: [84532],
    });
    this.provider = this.sdk.getProvider();
  },
  methods: {
    async createWallet() {
      try {
        const [address] = await this.provider.request({
          method: 'eth_requestAccounts',
        });
        alert(`Wallet connected: ${address.toLowerCase()}`);
        console.log(`Wallet connected: ${address.toLowerCase()}`);

        const walletStore = useWalletStore(); // Access Pinia store
        walletStore.setAddress(address.toLowerCase()); // Save wallet address in the global store



        const folderPath = `src/assets/data/${address.toLowerCase()}`; // Create a folder for the wallet address

        try {
          const response = await fetch("http://localhost:3000/check-create-folder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderPath }), // Send folderPath in the request body
          });

          if (!response.ok) {
            // If the response status is not OK, parse the error response
            const error = await response.json();
            throw new Error(error.error || "Failed to create folder");
          }

          // Parse and return the JSON response from the API
          const result = await response.json();
          console.log("Folder creation result:", result);
          return result; // Return the result for further processing
        } catch (error) {
          console.error("Error creating folder:", error);
          throw error; // Re-throw the error to handle it in the calling component
        }

        
        //const transactions = await getTransactions(address.toLowerCase()); // Fetch transactions
        //console.log('Fetched transactions:', transactions);





        //check for folder/create
        //store transactions
        //get transcations
        //clean transactions
        //store

        
        //get balances
        // store them


        //refresh graphs
        
        //saveTransactionsToFile(transactions, `@/assets/data/${address}/transactions.json`);


        
      } catch (error) {
        alert(`Error connecting wallet: ${error.message}`);
      }
    },
  },
  components: {
    CoinbaseWalletLogo,
  },
};
</script>

<style scoped>
button {
  color: #fff;
}
</style>
