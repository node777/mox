var hydra = {
  chains: [
  ],
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
        }else if(hydra.account.type=="torus"){
          hux.load();
          hydra.connect("torus").then(()=>{lux.changePage()})
        }else if(hydra.account.type=="key"||hydra.account.type=="email"){
          hydra.provider=await new ethers.providers.EtherscanProvider("homestead");
        }
      }catch(e){
        console.log(e);
      }
    }
    if(localStorage.privateKey){
      console.log(hydra.provider)
      //set provider if there is none
      if(!hydra.provider){hydra.provider=new ethers.providers.EtherscanProvider("homestead");}
      //set wallet
      hydra.wallet=await new ethers.Wallet(localStorage.privateKey, hydra.provider);
      console.log(hydra.wallet)
      //set provider address
      hydra.provider.provider={};
      hydra.provider.provider.selectedAddress=hydra.wallet.address;
      //hydra.signer = await hydra.wallet.getSigner();
    }
  },
  save:()=>{
    if(hydra.account){
      localStorage.account=JSON.stringify(hydra.account);
    }
    if(hydra.chains){
      localStorage.chains=JSON.stringify(hydra.chains);
    }
  },
  connect:async(t)=>{
    if(t=="web3"){
      if(hydra.account){
        hux.account();
      }
      else{
        hydra.account={
          type:"web3"
        }
        hydra.provider = new ethers.providers.Web3Provider(web3.currentProvider);
        hydra.signer = hydra.provider.getSigner();
        hydra.save();
        hux.connect();
      }
    }else if(t=="torus"){
      
      hydra.account={
        type:"torus"
      }
      hux.load();
      torus = new Torus();
      await torus.init();
      torus.login().then(()=>{
        web3 = new Web3(torus.provider);
        hydra.provider = new ethers.providers.Web3Provider(torus.provider);
        hydra.provider.provider.selectedAddress=torus.provider.selectedAddress;

        hydra.signer = hydra.provider.getSigner();
        hydra.save();
        lux.changePage();
      });
      
    }else if(t=="create"){
      hydra.account={
        type:"key"
      }    
      hydra.save();
      let wallet = ethers.Wallet.createRandom();
      localStorage.privateKey=wallet.privateKey;
      hydra.load();
      lux.changePage();
    }else if(t=="email"){
      //get ip
      let ip="/auth/passwordless"
      //get email
      let email=document.getElementById("email").value;
      //generate wallet
      let wallet = await ethers.Wallet.createRandom();
      localStorage.privateKey=wallet.privateKey;
      let address=wallet.address
      //setup post req params 
      let p={
        "email":email,
        "address":address
      }
      console.log(p)
      //request passwordless auth
      var x = new XMLHttpRequest();
      x.open( "POST", ip);
      x.setRequestHeader("Content-type", "text/plain");
      x.send(JSON.stringify(p));
      console.log( x.responseText);
    }
  },
  addChain:async(a)=>{
    //if a variable then add all chains
    if(a){
      let chains=JSON.parse(hydra.get("chains"));
      console.log(chains);
      for (c in chains){
        hydra.chains.push({ip:`chains/${chains[c]}`})
      }
      lux.changePage();
    }else{
      var ip = document.getElementById("nodeIP").value;
      //document.getElementById("content").innerHTML=`PINGING NODE LOCATED AT ${ip}`;
      //var r = (hydra.get(ip)||null);
      var c={
        //chain:r,
        ip:ip
      };
      console.log(c);
      hydra.chains.push(c);
      location.hash="chains"
    }
  },
  sign:async(msg)=>{
    //if web3
    if(hydra.account.type=="web3"){
      try{
        if(hydra.signer["_address"]==null){
          
        }
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
    else if(hydra.account.type=="torus"){
      try{
        // let m=Uint8Array.from(msg);
        // console.log(m, m.length);
        // var a = await web3.eth.getAccounts();
        // let signature = await web3.eth.sign(msg, a);
        // console.log(signature);
        let signature = await web3.eth.personal.sign(msg, web3.currentProvider.selectedAddress);
        return signature;
      }
      catch(e){
        console.log(e);
        alert(`Could not sign message \n Got Error ${e}`)
        return "unsigned"
      }
    }
    else if(hydra.account.type=="key"){
      //console.log("key",k);
      let signature = await hydra.wallet.signMessage(msg);
      //console.log(msg);
      return signature;
    }
    else{
      return "Invalid Sig"
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
      }
    };
    if(k()!=null){
      var c = JSON.parse(hydra.get(hydra.chains[hux.cid].ip));
      //let prevHash=c[c.length-1].h;
      var block={
        c:chainHash,
        t:Date.now(),
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
        x.setRequestHeader("Content-type", "text/plain");
        x.send(JSON.stringify(block));
      }
      catch(e){
      }
    }else{
      alert("No wallet connected");
    }
  },
  createChain:()=>{

  },
  getBalance:async()=>{
    try{
      if(hydra.provider){
        await hydra.provider.getBalance(hydra.provider.provider.selectedAddress).then((balance) => {
          hydra.account.balance = ethers.utils.formatEther(balance);
        });
      }else{
        //if there is no provider
        return "Could not retrieve balance"
      }
    }
    catch(e){
      hydra.account.balance = 0
      
    }  
  },
  sendTransaction:async(transaction)=>{
    transaction.value = Web3.utils.toHex(transaction.value);
    console.log(transaction);
    let params=[transaction];
    if(hydra.wallet){
      try{
        hydra.wallet.sendTransaction(transaction).then((tx)=>{
          console.log(tx);
        });
      }catch{
        alert("Error sending transaction, please make sure you have enough funds")
      }
    }else{
      hydra.signer.sendTransaction(transaction);
    }
    // .once('sending', function(payload){  })
    // .once('sent', function(payload){  })
    // .once('transactionHash', function(hash){  })
    // .once('receipt', function(receipt){  })
    // .on('confirmation', function(confNumber, receipt, latestBlockHash){  })
    // .on('error', function(error){  })
    // .then((m)=>{
    //   console.log(m);
    // })
  },
  clear:()=>{
    if(hydra.account.type=="torus"){
      torus.logout();
    }
    localStorage.clear();
    hydra.account=null;
    hydra.chains=[];
    
    location.reload();
  },
  editAccount:(info)=>{

    //setup XML
    let ip= `/auth/user`;

    var authTokenReq=new XMLHttpRequest();
    authTokenReq.onreadystatechange =async function() {
      if(this.readyState == 4 && this.status == 200) {
        //get auth token
        console.log(this.responseText);
        let authToken=this.responseText;

        //sign auth token
        //info.timestamp=Date.now();
        let sig= await hydra.sign(authToken);
        
        //setup req data
        let reqData={
          "email":info.email,
          "sig":sig
        }
        delete info.email
        reqData.data=info

        //setup xml
        var x = new XMLHttpRequest();
        x.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
          }
        };
        
        x.open("POST", ip, true);
        x.setRequestHeader("Content-type", "text/plain");
        x.send(JSON.stringify(reqData));
      }
    };
    authTokenReq.open("POST", ip, true);
    authTokenReq.setRequestHeader("Content-type", "text/plain");
    authTokenReq.send(JSON.stringify({"email":info.email}));
    
  }
};
