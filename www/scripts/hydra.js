let mux={
  // connect: function(){
  //   if(hydra.account){
  //     location.hash="account";
  //   }
  //   else{
  //     location.hash = "connect";
  //   }
  // }
}
var hydra = {
  
  chains: [
  ],
  connect:async(t)=>{
    if(t=="web3"){
      if(hydra.account){
        alert("account already connected, please log out to import account")
      }
      else{
        hydra.account={
          type:"web3"
        }
        hydra.provider = new ethers.providers.Web3Provider(web3.currentProvider);
        hydra.signer = hydra.provider.getSigner();
        hydra.save();
      }
    }else if(t=="torus"){
      
      hydra.account={
        type:"torus"
      }
      
      torus = new Torus();
      await torus.init();
      await torus.login();
      hydra.provider = await new ethers.providers.Web3Provider(torus.provider);
      hydra.provider.provider.selectedAddress=torus.provider.selectedAddress;

      hydra.signer = hydra.provider.getSigner();
      hydra.save();
      
    }else if(t=="create"){
      hydra.account={
        type:"key"
      }    
      var privKey=sha256(ethers.utils.randomBytes(32));
      //todo check if wallets exist
      hydra.account.wallets=[];
      hydra.account.wallets[0] =new ethers.Wallet(privKey);
      console.log(hydra.account.wallets);
      hydra.save();
      location.hash = "account";
    }
  },
  addChain:async()=>{
    var ip = document.getElementById("nodeIP").value;
    document.getElementById("content").innerHTML=`PINGING NODE LOCATED AT ${ip}`;
    var r = (hydra.get(ip)||null);
    if(r==null){
      alert(`No chain could be located at ip address ${ip}`);
    }else{
      document.getElementById("content").innerHTML=`
        RECIEVED RESPOSNSE ${r}
        Adding Chain: ${r}
        <div class="w50 button" onclick="location.hash='chains';">Chains</div>
      `;
      var c={
        chain:r,
        ip:ip
      };
      console.log(c);
      hydra.chains.push(c);
      hydra.save();
    }
  },
  sign:async(msg)=>{
    //if web3
    if(hydra.account.type=="web3"){
      try{
        let signature = await hydra.signer.signMessage(msg);
        console.log(signature);
        return signature;
      }
      catch(e){
        console.log(e);
        alert(`Could not sign message \n Got Error ${e}`)
        return "unsigned"
      }
    }
    else if(hydra.account.type=="key"){
      let k=hydra.account.wallets[0].signingKey.privateKey;
      let w = new ethers.Wallet(k);
      console.log("key",k);
      let signature = await w.signMessage(msg);
      console.log(msg);
      return signature;
    }
  },
  get:(ip)=>{
    var x = new XMLHttpRequest();
    try{
      x.open( "GET", ip, false ); // false for synchronous request
      x.send( null );
      return x.responseText;
    }
    catch{
      return "Endpoint could not be reached"
    }
  },
  post:async(ip, d)=>{
    var callParams=ip.split("/");
    var inv = callParams[callParams.length-1];
    let chainHash=callParams[1]
    console.log(callParams);
    var k=function(){
      if(hydra.provider){
        try{
          return hydra.provider.provider.selectedAddress
        }
        catch(e){
          console.log(e);
          return null
        }
      }else{
        try{
          return hydra.account.wallets[0].signingKey.address
        }catch(e){
          alert(e);
          return null
        }
      }
    };
    if(k()!=null){
      var c = JSON.parse(hydra.get(hydra.chains[hux.cid].ip));
      let prevHash=c[c.length-1].h;
      var block={
        c:chainHash,
        t: Date.now(),
        k:k(),
        i:inv,
        m:d
      }
      block.s=await hydra.sign(JSON.stringify(block));
      var x = new XMLHttpRequest();
      x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          hydra.responseText= this.responseText;
          hux.postResponse(this.responseText);
        }
        else{
          console.log(this);
        }
      };
      try{
        x.open("POST", ip, true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send(JSON.stringify(block));
      }
      catch{
      }
    }else{
      alert("No wallet connected");
    }
  },
  createChain:()=>{

  },
  save:()=>{
    if(hydra.account){
      localStorage.account=JSON.stringify(hydra.account);
    }
    if(hydra.chains){
      localStorage.chains=JSON.stringify(hydra.chains);
    }
  },
  load:async()=>{
    if(localStorage.chains){
      hydra.chains=(JSON.parse(localStorage.getItem('chains')))||[];
    }
    if(localStorage.account){
      hydra.account={};
      hydra.account=JSON.parse(localStorage.getItem('account'));
      try{
        if(hydra.account.type=="web3"){
          hydra.provider = await new ethers.providers.Web3Provider(web3.currentProvider);
          hydra.signer = await hydra.provider.getSigner();
        }
        if(hydra.account.type=="torus"){
          await hydra.connect("torus");
        }
      }catch(e){
        console.log("NOT A WEB3 USER");
      }
    }
  },
  getBalance:async()=>{
    try{
      await hydra.provider.getBalance(hydra.provider.provider.selectedAddress).then((balance) => {
        hydra.account.balance = ethers.utils.formatEther(balance);
      });
    }
    catch(e){
      await hydra.provider.balance.get(hydra.provider.provider.selectedAddress).then((balance) => {
        hydra.account.balance = ethers.utils.formatEther(balance);
      });

    }
  },
  sendTransaction:async()=>{
    let transaction = JSON.parse(document.getElementById("tx").value)
    //console.log(transaction);
    web3.eth.sendTransaction(transaction);
   },
  clear: function(){
    if(hydra.account.type=="torus"){
      
      torus.logout();
    }
    localStorage.clear();
    hydra.account=null;
    hydra.chains=[];
    location.hash="";
  }
};
