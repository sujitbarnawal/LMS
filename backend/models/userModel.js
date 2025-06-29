import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength:8
  },
  role: {
    type: String,
    enum: ["instructor", "student"],
  },
  enrolledCourses:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
  ],
  photoUrl:{
    type:String,
    default:""
  }
},{timestamps:true});

const User = mongoose.models.User || mongoose.model("User",userSchema)

export default User
