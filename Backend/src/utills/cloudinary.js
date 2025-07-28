import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'


cloudinary.config({ 
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
    api_key : process.env.CLOUDINARY_API_KEY, 
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localpath) => {
    console.log("api key",process.env.CLOUDINARY_API_KEY);
    
    try {
        console.log('in cloude',localpath);
        
        if(!localpath) return null;
        const response = await cloudinary.uploader.upload(localpath,{
                resource_type: "auto",
            }           
        )
        console.log("file is uploaded on cloudnary",response.url);
        fs.unlinkSync(localpath);
        
        return response;
    } catch (error){
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(localpath);
    }
}

export {uploadOnCloudinary}