import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

async function testConnection() {
  try {
    const res = await cloudinary.api.ping();
    console.log("✅ Cloudinary conectado correctamente:");
    console.log(res);
  } catch (error) {
    console.error("❌ Error al conectar con Cloudinary:");
    console.error(error);
  }
}

testConnection();
