import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDYNARY_NAME, 
        api_key: process.env.CLOUDYNARY_API_KEY, 
        api_secret: process.env.CLOUDYNARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
  
})();

export default cloudinary;