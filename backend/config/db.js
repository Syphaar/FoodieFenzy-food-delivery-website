import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sifonemmanuel123:sifonemmanuel@cluster0.00faxik.mongodb.net/food-restaurant')
    .then(() => console.log('DB CONNECTED'))
}



// mongodb+srv://sifonemmanuel123:sifonemmanuel@cluster0.00faxik.mongodb.net/?appName=Cluster0