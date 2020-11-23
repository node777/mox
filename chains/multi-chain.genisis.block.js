const crypto =require('crypto');
const hydra=require("../hydra-chain.js");


var multiGenisis={
  hash:(m)=>{
    var h=crypto.createHash('sha256');
    h.update(m);
    return h.digest('hex');
  },
  tx:(timestamp, key, func, msg, sig)=>{
    //set up block variables
    //create block
    var transaction={
      //todo compare hashes
      t: timestamp,
      k: key,
      i: func,
      m: msg,
      s:sig
    }
    return transaction;
  },
  block:(tx)=>{
    let thisChain=hydra.chains[multiGenisis.h]
    console.log(thisChain.length-1, thisChain[thisChain.length-1].length);

    //check if there is only genisis
    if(thisChain.length=1){

      thisChain.push([{p:multiGenisis.h}]);
    }
    //push tx
    let t=tx;
    thisChain[thisChain.length-1].push(t);

    if(thisChain[thisChain.length-1].length>=10){
      //create block hash
      let h=multiGenisis.hash(JSON.stringify(thisChain[thisChain.length-1]));
      //add hash to end
      thisChain[thisChain.length-1].push(h);
      //start new block with first tx as hash
      
      thisChain.push([{p:h}]);
    }
    return tx
  },
  chaincode:{
    init:function(data){
        return "initiated"
    },
    write:function(data){
      let d=JSON.parse(data);
      hydra.db[d.k.toLowerCase()]=d.m;
      console.log(hydra.db[d.k], d.k);
      return `added value ${d.m} to location ${d.k}\n: String(data)`
    },
    read:(data)=>{
      console.log(hydra.db, data);
      var r = hydra.db[data.toLowerCase()];
      //console.log(data.toString(), hydra.db, r);
      return `read data ${r}`
    }
  },
}

function flatten(obj){
  //todo fix this flatten fn, maye just find replacement
  var r=``;
  for(subObj in obj){
    var s =obj[subObj];
    //if subobj is func
    if(!!(s && s.constructor && s.call && s.apply)){
      r+=s.toString()
      //console.log(s.toString());
    }
    else if(typeof s === 'string' || s instanceof String){
      r+=s;
    }
    else{
      r+=JSON.stringify(flatten(s));
      //console.log(JSON.stringify(s));
    }
  }
  //console.log(r);
  return r;
}

let g=flatten(multiGenisis);
multiGenisis.h=multiGenisis.hash(g);
module.exports=multiGenisis;