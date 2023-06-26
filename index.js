const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser =  require("cookie-parser")
const axios = require("axios");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.json());
app.use('/',function(req,res,next){
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.listen(3000, () => {
  console.log('Express app listening on port 3000');
});
app.use(express.static(__dirname + '/public'));


app.post("/login",async (req,res) => {
  console.log(`d ${JSON.stringify(req.body)}`)
  let {username, password, AppId} = req.body;
  if(!username && !password){
    res.send({message:"please enter username & password"});
    return;
  }
  let obj = {};
  obj.username = username;
  obj.password = password;
  obj.AppId = AppId;
  console.log(`obj ${JSON.stringify(obj)}`);
  await axios.post("http://localhost:3001/authenticate",obj,{headers:{"Content-Type" : "application/json"}})
  .then((response) => {
    console.log(`response ${response.data}`);
    let token = response.data;
    // let cookie = res.cookie('jwttoken', token, {domain: "localhost", maxAge: '600s'});
    // console.log('cookie',cookie);
    // res.set('Set-Cookie', cookie);
    res.send({
      status: 2000,
      message: 'success',
      app:'Alarm Center Server',
      token:token,
    });
    
  }).catch((error) => {
    console.error(error)
    res.send('Alarm Center Server'+ error)
  })
})
