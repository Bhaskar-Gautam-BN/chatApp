import mongoose from 'mongoose'


const connectDB =async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log(`here is DB name ${connect.connection.name}`); 
    } catch (error) {
        console.log(error)
    }
}

export default connectDB