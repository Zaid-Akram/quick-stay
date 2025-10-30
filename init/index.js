const mongoose=require("mongoose");

let initData=require("./data.js");

const listing=require("../Model/listing.js");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
       console.log("connect to db"); 
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(mongo_url);
}
//console.log(initData.data);

const initDB=async()=>{
   await listing.deleteMany({});
   initData=initData.data.map((obj)=>({...obj, owner :"6900d5208ccfa65126ccb5ee"}))
   await listing.insertMany(initData);
   console.log("data was inserted");
};

initDB();