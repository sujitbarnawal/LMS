import mongoose from "mongoose"

const purshaseCourseSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    paymentId:{
        type:String,
        required:true
    }
},{timestamps:true})

const PurchaseCourse=mongoose.models.PurchaseCourse || mongoose.model("PurchaseCourse",purshaseCourseSchema)
export default PurchaseCourse