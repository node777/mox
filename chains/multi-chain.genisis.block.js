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
    console.log(hydra.chains[multiGenisis.h], multiGenisis.h);
    tx.p=hydra.chains[multiGenisis.h][hydra.chains[multiGenisis.h].length-1].h
    tx.h=multiGenisis.hash(JSON.stringify(tx));
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