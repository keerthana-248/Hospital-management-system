
var express=require("express");
const app=express();
app.listen(1100);
let server=require('./server');
let middleware=require('./middleware');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;

const url='mongodb://localhost:127:0.0.1:27017/';
const dbName="hospital";

let db
MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
  if(err)return console.log(err);
  db=client.db(dbName);
  console.log(`Connected Database: ${url}`);
  console.log(`Database: ${ dbName}`);
})

app.get('/hospitalDetails',middleware.checkToken,function(req,res){
  console.log("fetching data from hospital collection");
  var data=db.collection('hospitalDetails').find().toArray()
  .then(result=>res.json(result));

}
);

app.get('/ventilators',middleware.checkToken,function(req,res){
  console.log("fetching data from ventilator collection");
  var ventilatordetails=db.collection('ventilators').find().toArray()
  .then(result=>res.json(result));

}
);

app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
  var status=req.body.status;
  console.log(status);
  var ventilatordetails=db.collection('ventilators').find({"status":status}).toArray().then(result=>res.json(result));
});

app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
  var name=req.query.name;
  console.log(name);
  var ventilatordetails=db.collection('ventilators').find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

app.post('/searchhospitalbyname',middleware.checkToken,(req,res)=>{
  var name=req.body.name;
  console.log(name);
  var ventilatordetails=db.collection('hospitalDetails').find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});


app.put('/updateventilators',middleware.checkToken,(req,res)=>{
  var ventid1={ventid:req.body.ventid};
  console.log(ventid1);
  var newvalues={$set:{status:req.body.status}};
  db.collection("ventilators").updateOne(ventid1,newvalues,function(err,result){
     res.json("1 document updated");
     if(err)throw err;
  });
});

  app.post('/addventilator',middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var ventid=req.body.ventid;
    var status=req.body.status;
    var name=req.body.name;
    var item={
      hid:hid,ventid:ventid,status:status,name:name
    };
    db.collection("ventilators").insertOne(item,function(err,result){
     res.json("Item inserted");
    });


  });

  app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventid;
    console.log(myquery);
    var myquery1={ventid:myquery};
    db.collection("ventilators").deleteOne(myquery1,function(err,obj){
      if(err)
      throw err;
      res.json("1 document deleted");
    });

  });



