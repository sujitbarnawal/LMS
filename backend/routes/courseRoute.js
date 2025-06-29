import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import 
{ 
    createCourse, 
    createLecture, 
    editCourse, 
    editLecture, 
    getAllAdminCourses, 
    getAllEnrolledCourses, 
    getAllPurchasedCourse, 
    getCourseById, 
    getLectureById, 
    getLectures, 
    getPublishedCourses, 
    purchaseCourse, 
    removeCourse, 
    removeLecture, 
    searchCourse, 
    togglePublishCourse
} from "../controllers/courseController.js"
import upload from "../middlewares/multer.js"

const courseRouter=express.Router()

courseRouter.post('/create',isAuthenticated,createCourse)
courseRouter.get('/admin/get',isAuthenticated,getAllAdminCourses)
courseRouter.get('/get',isAuthenticated,getPublishedCourses)
courseRouter.post('/admin/course/:id/edit',isAuthenticated,upload.single("courseThumbnail"),editCourse)
courseRouter.get('/:id/get',isAuthenticated,getCourseById)
courseRouter.post('/admin/course/:id/remove',isAuthenticated,removeCourse)
courseRouter.post('/admin/course/:id/lecture/create',isAuthenticated,createLecture)
courseRouter.get('/admin/course/:id/lectures/get',isAuthenticated,getLectures)
courseRouter.post('/admin/course/:id/lecture/:lectureId/edit',isAuthenticated,upload.single("videoUrl"),editLecture)
courseRouter.get('/admin/course/:id/lecture/:lectureId',isAuthenticated,getLectureById)
courseRouter.post('/admin/course/:id/lecture/:lectureId/remove',isAuthenticated,removeLecture)
courseRouter.post('/admin/course/:id/togglepublish',isAuthenticated,togglePublishCourse)

courseRouter.get('/admin/purchsed-courses/get',isAuthenticated,getAllPurchasedCourse)

courseRouter.post('/:id/purchase',isAuthenticated,purchaseCourse)
courseRouter.get('/:id/enrolled/get',isAuthenticated,getAllEnrolledCourses)

courseRouter.get('/search',isAuthenticated,searchCourse)

export default courseRouter