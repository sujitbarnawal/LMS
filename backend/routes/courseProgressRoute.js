import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getCourseProgress, markAsCompleted, markAsIncomplete, updateLectureProgress } from "../controllers/courseProgressController.js"

const courseProgressRouter=express.Router()

courseProgressRouter.get('/:courseId',isAuthenticated,getCourseProgress)
courseProgressRouter.post('/:courseId/lecture/:lectureId/view',isAuthenticated,updateLectureProgress)
courseProgressRouter.post('/:courseId/completed/mark',isAuthenticated,markAsCompleted)
courseProgressRouter.post('/:courseId/incomplete/mark',isAuthenticated,markAsIncomplete)

export default courseProgressRouter