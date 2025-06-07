import mongoose from "mongoose";

const connectDB = async()=>{
    if (mongoose.connections[0].readyState) {
        console.log("🟢 Already connected to DB.");
        return;
      }

    mongoose.connection.on('connected',()=>{
        console.log('🟢 DB Connected')
    })
    mongoose.connection.on('error', (err)=>{
        console.error('🔴 DB Connection Error:', err);
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/GrindAI`)
}

export default connectDB;