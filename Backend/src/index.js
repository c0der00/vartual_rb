import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from "./db/index.js"

dotenv.config({path: './.env'});

const app = express()



 app.use( express.json({limit:"20kb"}))
 app.use(express.urlencoded({extended:true,limit:"20kb"}))
 app.use(express.static("public"))

 const allowedOrigins = [
  'http://localhost:5173',
  'http://10.178.244.69:5173'
];

 app.use(cors({
    origin: function(origin, callback){
    // allow requests with no origin (like curl or postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
    credentials : true
 }))
 app.use(cookieParser())

connectDB() 
.then(() => {
    app.on("error",(error) => {
        console.log("ERROR" , error);        
        throw error
    })
    app.listen(process.env.PORT || 6000,() => {
        console.log(`server is ranning at port numer ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log('monodb connection fail ' , error);
})

import userRouter  from './router/user.router.js'
import gaminiRouter from './router/gamini.router.js' 

app.use("/api/v1/users",userRouter)
app.use("/api/v1/gamini", gaminiRouter)