const crypto =require('crypto');
const hydra=require("../hydra-chain.js");
const flatten=require("../flatten.js");


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
    //console.log(hydra.chains[defaultGenisis.h], defaultGenisis.h);
    //get previous hash from last block and add to this one as p
    tx.p=hydra.chains[defaultGenisis.h][hydra.chains[defaultGenisis.h].length-1].h
    //hash this block, and add to h
    tx.h=defaultGenisis.hash(JSON.stringify(tx));
    //push block onto chain
    //hydra.chains[defaultGenisis.h].push(tx);
    //save entire chain to db
    //hydra.save(chain, `chains/${chain}.js`);
    return tx
  },
  chaincode:{
    init:function(data){
        return "initiated"
    },
    write:function(data){
      let d=JSON.parse(data);
      hydra.db[d.k.toLowerCase()]=d.m;
      //console.log(hydra.db[d.k], d.k);
      return `added value ${d.m} to location ${d.k}\n: String(data)`
    },
    read:(data)=>{
      //console.log(hydra.db, data);
      var r = hydra.db[data.toLowerCase()];
      //console.log(data.toString(), hydra.db, r);
      return r
    }
  }
}


// let testObj=[
//   (r)=>{return r},
//   {
//     f:(m)=>{return m},
//     o:{
//       e:[
//         9.5,
//         (l)=>{return l}
//       ]
//     },
//     n:{
//       b:true,
//       u:undefined,
//       n:null
//     }
//   }
// ]

// let t=[
//   (r)=>{return r},
//   {
//     f:(m)=>{return m},
//     o:{
//       e:[
//         9.5,
//         (l)=>{return l}
//       ]
//     },
//     n:{
//       b:true,
//       u:undefined,
//       n:null
//     }
//   }
// ]


let g=flatten(defaultGenisis);
//console.log(g);
defaultGenisis.h=defaultGenisis.hash(g);
module.exports=defaultGenisis;