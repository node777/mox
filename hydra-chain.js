const ethers = require('ethers');
var fs = require('fs');
var flatten = require('./flatten.js');

var hydra={
  db:{
    users:{},
    signatures:{}
  },
  chains:{
  },
  create:(genisisBlock)=>{
    hydra.chains[genisisBlock.h]=[
      genisisBlock
    ]
    //console.log("created genisis "+JSON.stringify(this)+" for "+chain)
  },
  load:(chain)=>{
    hydra.chains[chain[0].h]=chain
  },
  save:(chain, fileLocation)=>{
    fs.writeFile(fileLocation, flatten(hydra.chains[chain]),console.log);
  },
  query:(chain, query, args)=>{
    if(query){
      try{
        let c=hydra.chains[chain];
        var r = c[0].chaincode[query](args);
        return r;
      }catch(e){
        return `could not execute query, got error ${e}`
      }
    }
    else{
      return hydra.chains[chain];
    }
  },
  invoke:(chain, invoke, body)=>{

    console.log(body);

    //try to invoke function
    try{
      //get invoke data
      var d=body;
      var data =JSON.parse(d);

      //get chain
      let c=hydra.chains[chain];

      //set r=chaincode invoke return 
      let r = c[0].chaincode[invoke](d);
      //check for chaincode invoke
      if(r){
        let ts = data.t;
        let msg = data.m;
        let inv = data.i;
        let key = data.k;
        let sig = data.s;

        let b={
          c:chain,
          t:ts,
          k:key,
          i:inv,
          m:msg
        }
        //verify signature
        var verifiedKey = ethers.utils.verifyMessage(JSON.stringify(b), sig);
        if(verifiedKey.toLowerCase()!=key.toLowerCase()&&verifiedKey!=key){
          console.log("Signature could not be verified")
          return "Signature could not be verified";
        }
        //check if signature exists in db
        if(hydra.db.signatures[key]&&hydra.db.signatures[key][sig] in hydra.db.signatures[key]){
          console.log("signature repeat")
          return "Message already exists";
        }else{
          //add sig to db
          hydra.db.signatures[key]?hydra.db.signatures[key].push(sig):hydra.db.signatures[key]=[sig];
        }
        //create transaction
        let tx= c[0].tx(ts, key, inv, msg, sig);
        //add block
        c[0].block(tx); 
        return "Transaction added successfully"
      }
      else{
        return `Transaction Revert`;
      }
    }
    catch(err){
      return `could not execute the function ${invoke} on chain ${chain} with params ${body} - got error ${err}`;
    }
  }
}
module.exports=hydra;