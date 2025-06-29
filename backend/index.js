import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./utils/mongodb.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import connectCLoudinary from "./utils/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import courseProgressRouter from "./routes/courseProgressRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//mongodb connection
connectDB()

//cloudinary connection
connectCLoudinary()


//cors
const corsOptions={
  origin: process.env.VITE_FRONTEND_URL,
  credentials: true,
}
app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//endpoint apis
app.use('/api/user',userRouter)
app.use('/api/course',courseRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/course-progress',courseProgressRouter)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


app.get('/',(req,res)=>{
    res.send('Working')
})