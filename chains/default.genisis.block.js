const crypto =require('crypto');
const hydra=require("../hydra-chain.js");


var defaultGenisis={
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
    console.log(hydra.chains[defaultGenisis.h], defaultGenisis.h);
    //get previous hash from last block and add to this one as p
    tx.p=hydra.chains[defaultGenisis.h][hydra.chains[defaultGenisis.h].length-1].h
    //hash this block, and add to h
    tx.h=defaultGenisis.hash(JSON.stringify(tx));
    //push block onto chain
    hydra.chains[defaultGenisis.h].push(tx);
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

let g=flatten(defaultGenisis);
defaultGenisis.h=defaultGenisis.hash(g);
module.exports=defaultGenisis;