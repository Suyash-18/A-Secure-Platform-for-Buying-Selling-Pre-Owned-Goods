// server/src/index.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
import connectDB from "./db/index.js";
import { app } from "./app.js";



connectDB ()
.then(()=>{
    console.log("✅ Database connected successfully");
    app.listen(process.env.PORT|| 8000,()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    
    })
   
})
.catch((err)=>{
    console.error("MONGODB Connection ERROR: ",err);
    
})
