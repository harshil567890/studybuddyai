const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
  try {
    if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });
      console.log("Cloudinary configured successfully");
    }
  } catch (error) {
    console.log("Cloudinary configuration notice:", error.message);
  }
};
