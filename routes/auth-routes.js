const router = require('express').Router();
const nodemailer=require('nodemailer');
const hydra=require("../hydra-chain.js");
const ethers=require("ethers");
//setup vars
let authTokens={};
let emailTokens={};

//setup mail options
let mailOptions={
  from:"Byte Trade",
  subject: "Authentication"
}
let transporter=nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:465,
  secure:true,
  auth:{
    type:'OAuth2',
    user:"business@byte.trade",
    serviceClient: "106582718747692811855",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgJQWYn4bdWwJb\nCTPL0VJ1GH2CBeM2UEMIlbQ36SzhtxNukh7iZ8BGQREjooUV25OUuroi5tfDtJvA\nbvN6wRPmIGxLQRoa+NoGWbYu4ps9cXIU4A9aTldiUvpkbFdZk4+a3SBfXZpIkBzs\n1K+5aXToXIqO8Zo7KIp/Y7ejDlnspNSVzwgWAVXuYitzwPL1gaZZ11wfJxnGL8/X\nLeNZyn99E0abNovQuJ971hQiAObCtZf4mlLEHmrm+hJyYlw8qNJbjmv4MkERvqMf\nKt3j2uSbuNqwokiGSFvcNa/jg5p6/y3VR0ZkXEwY1ZTfR1JHekLNTdUdOQn1ESXM\nzhiXu//FAgMBAAECggEAOf1qDrwLHN7MY7gkRfGQd0oQQqD6UVV/mkt89lAl8/m1\nFdDJG8NC7AougH0uGGMYMg0DVj9KCFCEUUuDQ7mLR+kQi4G62sqSQb1ZFJU9G67r\nmHoFjtQg6IfWTz/2c27pYuQd2X5yiZ57VUyLcBlYDTvP/z6DrBWHi4DFhHKUklPw\nyhlKZ7hxaCdfa7T30QlsrUTaNBnkuaryaYQuv1ovlc8dRGjTEx9BIhcz0LSZjlOX\n9O7UJtU559SdDCXbRLL5C/2UxukAiA87mvPCBlfupDtQlCBrNimfbxL55WvEtdly\nCUIhbuuAjQ/zLChik9coowHyK47fz6azRl6qmKUWWwKBgQD2eh5XohB67XImp2AZ\nI/kBrCRgGXEa0smJpXoFf3DaUZPIdumC2ixOs8HmcS6eKet9bwc3tGLEtVWbbE2R\nrCUJoIDMzpv/oN2dP+vtglQ1Ge/8gOdwzd2oiBVqr2rZppbTEDz73iIQnbhCO40y\nInvuJPmL41ZI67fTxxeZsO4rRwKBgQDozgP6rwm+QUR0goLnoibJpNYDVpGS4imC\ne36M5SOSSC6OkYVd/22zJk1yqzx/Glx4ZVeC4f6Rqrc916XP6JJ+ZP+Nt2i2XJFW\nxCV52ZDwBQzhm2s5VmadbO0roOKldlHnsc9YIn0gQfPC1W//JrYMNpHLRKKWirYb\nwBCp3eSqkwKBgQC34IraXbFlw9axN5TdrJSLxtysRM64cCCia60IhPawKMPTfcLf\nN9xuKnSxciaRIDzqqvX7fLtifNWMydNkpcRL1k3AfTKsFlq+gX2FBwHDS8JZ4eDH\nqw1+OWeg25UfIsTKWQbl7+YB92gLIVpI2KkUFMmGruckJ5ZQi+rzYaeM6QKBgQCR\nF5zZRvAumCTe7FxDmwbLk6UiTXjK75NpVChKDaE+0SfbCQzyyXgIOG36cohwuvA4\nxQhmdQ0goiI0M8uOqWdryOyQ2Wc0iLq4NeUZbSRswukFTsTj5lpr8PBbyZiYAQcI\n/QO57TzItvICUt3LSsgZEoWJBwzCAE+BOhHonHegawKBgHi6seCJhjzUtmaHJQz8\ngIUVGNQ9SaCeSe1CCcX1xmphJnpZvYea9orvtvASjprTQ3xDMdzl1uwWyN/McQ8e\nTnbHvskmZQNJYK5413YFEE6HJnTVLkd9VRM5LomauTETth00IOVs6umNZjiOFf3r\nsB2jBZhaQVagnzueO/gaLJF0\n-----END PRIVATE KEY-----\n"
  }
});

//user account fns
// router.get('/user/:u'){
//   console.log(req.params.u )

// }
router.post('/user', (req, res)=>{
  
  console.log(req.body)
  let d=JSON.parse(req.body);

  if(d.sig){
  

    //verify sig
    let signingAddress=ethers.verifySignature(authTokens[d.email], d.sig)
    if(signingAddress==hydra.db.users[d.email].address){
      //check if this is an edit request
      if(d.data){
        hydra.db.users[signingAddress]=d.data;
        console.log(hydra.db.users[signingAddress])
        res.send(`Account ${d.email} edited`)
      }else{
        console.log(`sending acc data for ${d.email}`)
        res.send(hydra.db.users[signingAddress]);
      }
    }else{
      res.send(false)
    }
  }else{
    //setup auth token
    let t=JSON.stringify(777)
    authTokens[d.email]=t
    console.log(`SENDING AUTH TOKEN ${t}`)
    res.send(t);
  }
  
});

// router.post('/edit/:u', (req, res)=>{
//   console.log(req.params.u, req.body)
// });

//passwordless login
router.post('/passwordless', (req, res)=>{
  //transporter.verify();
  console.log(req.body)
  let p = JSON.parse(req.body)
  //create and save auth token
  let rk=777
  emailTokens[rk]=[p.address,p.email]
  //set mail options
  let m=mailOptions;
  m.to=p.email;
  m.html=`
    Hello from <b>Byte Trade</b>
    <div style="background-color:#003300; border:1px solid #001100;width:min-content;">
      <a href="http://localhost:1337/auth/token/${rk}"><h1 style="padding:25px">Click to Activate</h1></a>
    </div> 
  `
  //send mail
  transporter.sendMail(m,(err, info)=>{
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  })
    res.send("LOGGING IN WITH EMAIL");
});
router.get('/token/:t', (req,res)=>{
  if(emailTokens[req.params.t]){
    //check  if user exists
    if(!hydra.db.users[emailTokens[req.params.t][1]]){
      //add user to db
      hydra.db.users[emailTokens[req.params.t][1]]={};
    }
    //add users new address to db
    hydra.db.users[emailTokens[req.params.t][1]].address=emailTokens[req.params.t][0];
    //delete auth token
    delete emailTokens[req.params.t];
    //console.log(hydra.db.users)
    res.send(`
    AUTHENTICATION SUCCESSFUL 
    <script>setTimeout(window.close, 1000);</script>
    `)
  }else{
    res.send(`
    AUTHENTICATION UNSUCCESSFUL 
    <script>setTimeout(window.close, 1000);</script>
    `)
  }
});

router.get('/logout', (req,res)=>{
    res.send("LOGGING OUT");
});

module.exports=router;