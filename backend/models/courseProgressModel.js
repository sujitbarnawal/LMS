import mongoose, { mongo } from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lectureId: {
    type: String,
  },
  viewed: {
    type: Boolean,
  },
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: String,
  },
  userId: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
  lectureProgress: [lectureProgressSchema],
});

const CourseProgress = mongoose.models.CourseProgress || mongoose.model("CourseProgress",courseProgressSchema)
export default CourseProgress