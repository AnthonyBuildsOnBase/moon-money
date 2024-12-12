// src/stores/walletStore.js
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    address: '',
  }),
  actions: {
    setAddress(newAddress) {
      this.address = newAddress.toLowerCase();
    },
  },
});
