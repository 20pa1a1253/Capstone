const bodyParser = require("body-parser");
const { application, Router } = require("express");
const express = require("express");
const ejs = require('ejs');
const app = express();

const port = 3000;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key1.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
//var studentregister=require('./routes/userregistr');


app.set("view engine", "ejs");
app.set('views', './views')
//app.set('views', path.join(__dirname, 'views'));
//app.set('views', path.join(__dirname, 'views'));
//app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css/'));
//app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
extended: true
})); 

app.get("/", (req, res) => {
  res.render("index");
});
app.get('/up',(req,res)=>{
  res.render("signup")
});
app.get('/in',(req,res)=>{
  res.render("signin");
})
app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/signinsubmit", (req, res) => {
  const email = req.query.emil;
  const password = req.query.passwprd;
  const Passcode =req.query.code;
  const passtud="teacher";
  const passteacher="student";
  if(Passcode=="student"){

  db.collection("allusers")
    .where("email", "==", email) 
    .where("password", "==", password)
    .where("YourCode","==",Passcode)
    .get()
    .then((docs) => {
      var usersData = [];
       // if (docs.size > 0) {
          db.collection("allusers")
          .get()
          .then((doce) => {
            doce.forEach((doc) => {
              usersData.push(doc.data());
            });
          })
            console.log(usersData);
            res.render("studashboard",{thestud:usersData});
       // }
      });
  }
  else if(Passcode==passtud){
    const col=db.collection("allusers")
    .where("email", "==", email) 
    .where("password", "==", password)
    .where("YourCode","==",Passcode)
    .get()
    .then((docs) => {
     
        //if (docs.size > 0) {
          var usersData = [];
          db.collection("allusers")
          .get()
          .then((doce) => {
            doce.forEach((doc) => {
              usersData.push(doc.data());
            });
          })
          .then(() => {
            console.log(usersData);
            res.render("hodashboard", { userData: usersData });
          });
        //}
      });
      }
      else{
        res.send("Sorry,LoginFailed Makesure to Signup:))")
      }
  });

app.get('/dashboard', (req, res) => {
  res.render("studentregister");
});
app.get('/studentregistr',(req,res)=>{
  const full_name = req.query.First_Name;
  const last_name = req.query.Last_Name;
  const regId=req.query.RegId;
  const email = req.query.Email_Id;
  const semno = req.query.Semno;
  const branchname = req.query.branch;
  const Update= req.query.update
  const result=  db.collection("student register").add({
    name: full_name +" " +last_name,
    email: email,
    registerNumber:regId,
    CurrentSemNumber:semno,
    Branch:branchname,
    update:Update,

  }).then(() => {
    res.send("Registered sucessfully");
  });
});
app.get('/hodashboard',(req,res)=>{
  res.render("teacherregister");
});
app.get('/postingcse',(req,res)=>{
  res.render("postmarks");
});
app.get('/postingece',(req,res)=>{
  res.render("postmarks");
});
app.get('/postingcivil',(req,res)=>{
  res.render("postmarks");
});
app.get('/postmark',(req,res)=>{
  const branchcse = "CSE";
  const branchece = "ECE";
  const branchcil="CIVIL";
  const studentname = req.query.stud_name;
  const registerno = req.query.rol_no;
  const bran=req.query.branch;
  const semNo=req.query.semnum;
  const Cgpa = req.query.cgpa;
  const Attend = req.query.attendence;
  const remark = req.query.remarks;
  const markinfo= db.collection("marksentered").add({
    Studentname: studentname,
    RegistrationNumber: registerno,
    CurrentSemisterNum:semNo,
    BranchName:bran,
    CGPA:Cgpa,
    attendence:Attend,
    Remarks:remark,

  });
  var info=db.collection('student register').where("Branch","==",branchcse).where("registerNumber","==",registerno).get().then((querySnapshot)=>{
    querySnapshot.forEach(function(document) {
     document.ref.update({
      'update':'yes', 
      }); 
    })
  });
  var info=db.collection('student register').where("Branch","==",branchece).where("registerNumber","==",registerno).get().then((querySnapshot)=>{
    querySnapshot.forEach(function(document) {
     document.ref.update({
      'update':'yes', 
      }); 
    })
  });
  var info=db.collection('student register').where("Branch","==",branchcil).where("registerNumber","==",registerno).get().then((querySnapshot)=>{
    querySnapshot.forEach(function(document) {
     document.ref.update({
      'update':'yes', 
      }); 
    })
  }).then(() => {
    res.send("Marks posted sucessfully");
  })
});

app.get('/studduecse',(req,res)=>{
  var datas=[];
  //const citiesRef = db.collection('student register');
  //const branchece="ECE";
  //const branchcse="CSE";
  db.collection('student register').where("Branch","==","CSE").where("update","==","no").get()
  .then((docs)=>{
    docs.forEach((doc)=>{
      datas.push(doc.data());

    });
  }).then(()=>{ 
      res.render("postcse",{thestudent:datas});    
      console.log(datas);
      //console.log(datak);
    })
});
app.get('/ece',(req,res)=>{
  var datak=[];
  //const citiesRef = db.collection('student register');
  //const branchece="ECE";
  //const branchcse="CSE";
  db.collection('student register').where("Branch","==","ECE").where("update","==","no").get()
  .then((docs)=>{
    docs.forEach((doc)=>{
      datak.push(doc.data());

    });
  })
   .then(()=>{ 
      res.render("postcse",{thestudent:datak});    
      console.log(datak);
      //console.log(datak);
    })
});
app.get('/civil',(req,res)=>{
  var datav=[];
  //const citiesRef = db.collection('student register');
  //const branchece="ECE";
  //const branchcse="CSE";
  db.collection('student register').where("Branch","==","CIVIL").where("update","==","no").get()
  .then((docs)=>{
    docs.forEach((doc)=>{
      datav.push(doc.data());
 
    });
  })
   .then(()=>{ 
      res.render("postcse",{thestudent:datav});    
      console.log(datav);
      //console.log(datak);
    })
});
app.get('/teacherregistr',(req,res)=>{
  const full_name = req.query.First_Name;
  const last_name = req.query.Last_Name;
  const regId=req.query.RegId;
  const email = req.query.Email_Id;
  const Branc=req.query.branch;
  //const branch = req.query.branchname;
  const techerinfo= db.collection("teacherregister");
  techerinfo.add({
    name: full_name + last_name,
    email: email,
    Branch:Branc,

  }).then(() => {
    res.send("Registered sucessfully");
  });
});
app.get('/markget',(req,res)=>{
  res.render("ask");
});
//app.get('/mark',(req,res)=>{
  //res.render("getmarks");
//});
//---OBTAIN MARKS------------///
app.get('/hark',(req, res) => {
    const roll = req.query.Regid;
    const bran = req.query.branchh;
    var datax = [];
    db.collection("student register").where('registerNumber', '==', roll).where('Branch', '==', bran).get().then(async (docs) => {
      
          var refer = await db.collection("marksentered").where('RegistrationNumber', '==', roll).where('BranchName', '==', bran).get();
          refer.forEach((doc) => {
            datax.push(doc.data());
          });
        }).then(() => {
            res.render("marks",{ marks: datax});
            console.log(datax);
          });
     
  
  });
app.get("/signupsubmit", (req, res) => {  
  const full_name = req.query.full_name;
  const last_name = req.query.last_name;
  const email = req.query.emil;
  const password = req.query.passwprd;
  const Status =req.query.status;
  if(Status=="teacher"){
    var faculty=db.collection("allusers");
    faculty.add({
      name: full_name + last_name,
      email: email,
      password: password,
      role: Status,
    })
    .then(() => {
      res.render("hodashboard");
    });
  }
  else if(Status=="student"){
    var student=db.collection("allusers");
    student.add({
      name: full_name + last_name,
      email: email,
      password: password,
      role: Status,
    })
    .then(() => {
      res.render("studashboard");
    });
  }
  else{
    req.send("Signupfailed:((");
  }
  
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 