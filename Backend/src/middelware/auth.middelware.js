import { User } from "../model/user.model.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utills/ApiError.js"
import { asyncHandler } from "../utills/asyncHandler.js"


export const verifyJwt = asyncHandler(async(req,res,next) => {
   try {
    
    
    const token =  req.cookies?.accessToken || req.header
     ("Authorization")?.replace("Bearer ","")
    
     if(!token){
         throw new ApiError(401,"Unauthorized access")
     }
 
     const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     
     const user = await User.findById(decodeToken?._id).select
     ("-password -refreshToken")
     console.log(user);
     
     if(!user){
         return new ApiError(401,"Invalid access Token")
     }
 
     req.user = user;
     
     next()
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access Token")
   }
})