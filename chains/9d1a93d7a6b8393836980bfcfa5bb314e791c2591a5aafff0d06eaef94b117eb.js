[{hash:(m)=>{
    var h=crypto.createHash('sha256');
    h.update(m);
    return h.digest('hex');
  },tx:(timestamp, key, func, msg, sig)=>{
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
  },block:(tx)=>{
    //console.log(hydra.chains[defaultGenisis.h], defaultGenisis.h);
    //get previous hash from last block and add to this one as p
    tx.p=hydra.chains[defaultGenisis.h][hydra.chains[defaultGenisis.h].length-1].h
    //hash this block, and add to h
    tx.h=defaultGenisis.hash(JSON.stringify(tx));
    //push block onto chain
    hydra.chains[defaultGenisis.h].push(tx);
    return tx
  },chaincode:{init:function(data){
        return "initiated"
    },write:function(data){
      let d=JSON.parse(data);
      hydra.db[d.k.toLowerCase()]=d.m;
      //console.log(hydra.db[d.k], d.k);
      return `added value ${d.m} to location ${d.k}\n: String(data)`
    },read:(data)=>{
      //console.log(hydra.db, data);
      var r = hydra.db[data.toLowerCase()];
      //console.log(data.toString(), hydra.db, r);
      return `read data ${r}`
    }},h:9d1a93d7a6b8393836980bfcfa5bb314e791c2591a5aafff0d06eaef94b117eb},{t:1610310795253,k:0x4079bb214d043cdf4f7584f20ec64d3f54e27fe5,i:init,m:testData,s:0x5d68c8b84c6f74715dd7629a34290e9e2410da28ec64ca820448761130adb1ca5e70b399ebdf89333b8512bce7adbb3b022ffb31de028b25428ad1f4a6c12a581c,p:9d1a93d7a6b8393836980bfcfa5bb314e791c2591a5aafff0d06eaef94b117eb,h:912dbd2a66c162d6d947537522addf63f0a7dcec5dad2084fe46fcf198604a74},{t:1610310804077,k:0x4079bb214d043cdf4f7584f20ec64d3f54e27fe5,i:write,m:testData,s:0x91fbc1e106da8f7cfa19309f5823023dddabe110e25441a565227e58f93d36077702e09e5be156b3eee5033105152c6c63c4938a041d6c4c26013e636114b26d1b,p:912dbd2a66c162d6d947537522addf63f0a7dcec5dad2084fe46fcf198604a74,h:a24474107b7918b51a1984a14400d774c8ced3fde1db3edadebaba270902422c}]