import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors'

// import router
import userRoute from './routes/userRoute.js'
import eventRoute from './routes/eventRoute.js'
import bookingRoute from './routes/bokingRoute.js'

dotenv.config();


const app = express();
app.use(cors())
app.use(express.json());
app.use("/api",userRoute)
app.use("/api",eventRoute)
app.use("/api",bookingRoute)

const startServer = async () => {
    try {
        await connectDb(); 

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1); 
    }
};
startServer();