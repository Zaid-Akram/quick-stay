const express=require("express");
const app=express();
const port=8080;
const expressError=require("./expressError");
const myError = require("./expressError");

// app.use((req, res,next)=>{
//     console.log("i am middleware");
//    // res.send("middleware finshed");
//    next();
// });
// app.use("/ok",(req, res)=>{
//     console.log("zaid");
//     next();

// });

// app.get("/",(req, res)=>{
//     res.send("this is root");
// });

//logger-morgan
// app.use((req, res, next)=>{
//     req.time=new Date(Date.now());
//     let query=req.query;
//     console.log(req.query);
//     next();
// });

// app.get("/ok",(req, res)=>{
//     res.send("this is a random page");
// });

// app.use("/api",(req, res, next)=>{
//     const { token}=req.query;
//     if(token==="acces"){
//         next();
//     }
//     throw new myError(401,"pay attention");


// });

app.get("/api/ok",(req, res)=>{
    res.send("data")
});
app.get("/err",(req, res)=>{
    abcd=abcd;
});
app.get("/admin", (req,res)=>{
    throw new myError(403,"acces is forbidden");
});

app.use((err, req, res, next)=>{
    res.send(err);
});

app.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})