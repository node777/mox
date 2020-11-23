const ethers = require('ethers');
// const sha3 = require('sha3');
const crypto =require('crypto');
const hydra=require("../hydra-chain.js");
hydra.ur={
  "0xd15b3617bea9e9a6c5b7763c81274d3a7682d9b1":99999999999
};

var urGenisis={
  hash:(m)=>{
    var h=crypto.createHash('sha256');
    h.update(m);
    return h.digest('hex');
  },
  block:(prevHash, timestamp, key, func, msg, sig)=>{
    //set up block variables
    //todo:SCRUB INPUT
    //verify hashes verify
    //var c=hydra.query("hydra");
    //let prevHash=c[c.length-1].h;
    //create block
    var b={
      //todo compare hashes
      p: prevHash,
      t: timestamp,
      k: key,
      i: func,
      m: msg
    }
    //verify signature
    var rere = ethers.utils.verifyMessage(JSON.stringify(b), sig);
    console.log(rere);
    console.log(key);
    if(rere.toLowerCase()==key||rere==key){
      b.s=sig;
      console.log(b);
      //hash
      b.h=urGenisis.hash(JSON.stringify(b));

      //return block
      return b;
    }else{
      return "signature could not be verified"
    }
  },
  chaincode:{
    send:function(data){
      try{
        //console.log(data);
        let d=JSON.parse(data);
        //console.log(d.k);
        let m = JSON.parse(d.m);
        hydra.ur[d.k.toLowerCase()]=hydra.ur[d.k.toLowerCase()]||0;
        hydra.ur[m.t.toLowerCase()]=hydra.ur[m.t.toLowerCase()]||0;
        console.log(hydra.ur, hydra.ur[d.k.toLowerCase()]);
        if(hydra.ur[d.k.toLowerCase()]-m.a>=0){
          hydra.ur[d.k.toLowerCase()]-=m.a;
          hydra.ur[m.t.toLowerCase()]+=m.a;
          return `sent ${m.a} to location ${m.t}\n: ${String(data)}`;
        }else{
          return "not enough funds"
        }
      }catch(e){
        return `could not execute, got error ${e}`
      }
    },
    bal:(data)=>{
      console.log(hydra.db, data);
      var r = hydra.ur[data.toLowerCase()];
      //console.log(data.toString(), hydra.db, r);
      return `read data ${r}`
    }
  }
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

let g=flatten(urGenisis);
urGenisis.h=urGenisis.hash(g);
module.exports=urGenisis;
//{"t":"0xCa9447aABBf07a23ADAfE8e8D4CD91B891687B09", "a":1000}