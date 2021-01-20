const router = require('express').Router();

const hydra=require("../hydra-chain.js");

//setup chains
const defaultGenisis=require("../chains/default.genisis.block.js");
const multiGenisis=require("../chains/multi-chain.genisis.block.js");
const lorbGenisis=require("../chains/lorb.genisis.block.js");
hydra.create(defaultGenisis);
hydra.create(multiGenisis);
hydra.create(lorbGenisis);

//get chain info
router.get('/:chain?/:block?', (req, res) => {
  //if user is querying a specific chain
  if(req.params.chain){
    let c = hydra.chains[req.params.chain];
    if(req.params.block){
      let b = req.params.block;
      if(b=="last"){
        let l= (Object.keys(c).length-1);
        return res.send(l.toString());     
      }else{
        if(c[b]){
          return res.send(c[b]);
        }else{
          return res.send(`Could not locate block ${b} on chain ${c}`);
        }
      }
    }else{
      return res.send(c);
    }
  }else{
    //console.log(hydra.chains);
    return res.send(Object.keys(hydra.chains));
  }
  
});
//query
router.get('/:chain/query/:query/:args?', (req, res) => {
  var r = hydra.query(req.params.chain, req.params.query, req.params.args)||"Query could not be found"
  return res.send(r);
});
 //invoke
router.post('/:chain/invoke/:invoke/:args?', (req, res) => {
  //console.log(req.body)
  var r = hydra.invoke(req.params.chain, req.params.invoke, req.body);
  return res.send(r);
});

//todo scrub input
//create chain
router.put('/:chain', (req, res) => {
  var d=JSON.parse(req.body);
  return res.send(`Could not create ${req.params.chain}`);
});
//removal of chains by costodian
router.delete('/:chain', (req, res) => {
  return res.send(`Could not delete ${req.params.chain}`);
});

module.exports=router;