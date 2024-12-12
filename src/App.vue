<template>
  <div id="app" class="container">
    <Header @wallet-connected="handleWalletConnected" />

    <div class="graph-metrics-container">
      <Metrics />

      <Graph/>
    </div>
    <Transactions />
  </div>
</template>


<script>
import Header from './components/Header.vue';
import Graph from './components/Graph.vue';
import Metrics from './components/Metrics.vue';
import Transactions from './components/Transactions.vue';


 // import { useWalletStore } from '@/stores/walletStore';
  //const walletStore = useWalletStore();
  //console.log('Connected Wallet Address:', walletStore.address);



  
export default {
  name: 'App',
  components: {
    Header,
    Graph,
    Metrics,
    Transactions,
  },
  data() {
    return {
      walletAddress: '',
    };
  },
  methods: {
    handleWalletConnected(address) {
      this.walletAddress = address;
    },
  },
  setup() {

  },
};
</script>

