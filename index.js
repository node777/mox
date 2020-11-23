const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");

const hydra=require("./hydra-chain.js");
const defaultGenisis=require("./chains/default.genisis.block.js");
const multiGenisis=require("./chains/multi-chain.genisis.block.js");
const urGenisis=require("./chains/ur.genisis.block.js");

hydra.create(defaultGenisis);
// hydra.create(multiGenisis);
// hydra.create(urGenisis);

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render('error');
});
app.use(express.static("www"));

//get chaain info
app.get('/chains/:chain?/:block?', (req, res) => {
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
    console.log(hydra.chains);
    return res.send(Object.keys(hydra.chains));
  }
  
});
//query
app.get('/chains/:chain/query/:query/:args?', (req, res) => {
  var r = hydra.query(req.params.chain, req.params.query, req.params.args)||"Query could not be found"
  return res.send(r);
});
 //invoke
app.post('/chains/:chain/invoke/:invoke/:args?', (req, res) => {
  var r = hydra.invoke(req.params.chain, req.params.invoke, req.body);
  return res.send(r);
});

//todo scrub input
//create chain
app.put('/chains/:chain', (req, res) => {
  var d=JSON.parse(req.body);
  return res.send(`Could not create ${req.params.chain}`);
});
//removal of chains by costodian
app.delete('/chains/:chain', (req, res) => {
  return res.send(`Could not delete ${req.params.chain}`);
});

process.env.PORT=1337;
 
app.listen(process.env.PORT, () =>
  console.log(`Hydra serving on port ${process.env.PORT}!`),
);