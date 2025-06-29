import mongoose from "mongoose"

const lectureSchema=new mongoose.Schema({
    lectureTitle:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String,
    },
    isPreviewFree:{
        type:Boolean,
        default:false
    },
    course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  }
},{timestamps:true})

const Lecture = mongoose.models.Lecture || mongoose.model("Lecture",lectureSchema)
export default Lecture
