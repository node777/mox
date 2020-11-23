var hydra={
  db:{},
  chains:{
  },
  create:(genisisBlock)=>{
    console.log
    hydra.chains[genisisBlock.h]=[
      genisisBlock
    ]
    //console.log("created genisis "+JSON.stringify(this)+" for "+chain)
  },
  query:(chain, query, args)=>{
    if(query){
      let c=hydra.chains[chain];
      var r = c[0].chaincode[query](args);
      return `query ${query} been invoked on chain ${chain}. Recieved response: ${r}`;
    }
    else{
      return hydra.chains[chain];
    }
  },
  invoke:(chain, invoke, body)=>{

    //try to invoke function
    try{
      //get invoke data
      var d=Object.keys(body)[0];
      var data =JSON.parse(d);

      //get chain
      let c=hydra.chains[chain];

      //set r=chaincode invoke return 
      let r = c[0].chaincode[invoke](d);
      //check for chaincode invoke
      if(r){
        //todo scrub d
        let key = data.k;
        let ts = data.t;
        let msg = data.m;
        let inv = data.i;
        let sig = data.s;
        //create transaction
        let tx= c[0].tx(ts, key, inv, msg, sig);
        //ret add block
        c[0].block(tx); 
        return "Transaction added successfully"
      }
      else{
        return `ERROR: chaincode invoke could not be found`;
      }
    }
    catch(err){
      return `could not execute the function ${invoke} on chain ${chain} with params ${body} - got error ${err}`;
    }
  }
}
module.exports=hydra;