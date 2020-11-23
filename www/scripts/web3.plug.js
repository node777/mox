var w3={
  import: async function(){
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },
  getUser:async function(){
    var jj = await web3.eth.getAccounts();
    console.log(jj);
    return jj[0];
  },
  getWallets:async function(){
    var jj = await web3.eth.getAccounts();
    console.log(jj);
    return jj[0];
  }
}