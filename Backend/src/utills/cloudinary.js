import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localpath) => {
    try {
        console.log('in cloude');
        
        if(!localpath) return null;
        const response = await cloudinary.uploader.upload(localpath,{
                resource_type: "auto",
            }           
        )
        fs.unlikeSync(localpath);
        console.log("file is uploaded on cloudnary",response.url);
        return response;
    } catch (error){
        fs.unlikeSync(localpath);
    }
}

export {uploadOnCloudinary}