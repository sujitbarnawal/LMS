import CourseProgress from "../models/courseProgressModel.js";
import Course from "../models/courseModel.js";

//fetch course progress
export const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;

    // fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }

    // Mark all lectures as isPreviewFree = true for enrolled user
    const isEnrolled = courseDetails.enrolledStudents.includes(userId.toString());
    const modifiedLectures = isEnrolled
      ? courseDetails.lectures.map((lecture) => ({
          ...lecture.toObject(),
          isPreviewFree: true,
        }))
      : courseDetails.lectures;

    // Replace lectures in courseDetails with modified lectures
    const modifiedCourseDetails = {
      ...courseDetails.toObject(),
      lectures: modifiedLectures,
    };

    // If no progress found return course details with empty array
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: { courseDetails: modifiedCourseDetails, progress: [], completed: false },
      });
    }

    // return user's course progress along with course details
    return res.status(200).json({
      success: true,
      data: {
        courseDetails: modifiedCourseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return res
      .status(500)
      .json({ message: "Error fetching course progress", success: false });
  }
};


//update lecture progress
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    //create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      //if no progress exists , create  a new one
      courseProgress = new CourseProgress({
        courseId,
        userId,
        lectureProgress: [],
        completed: false,
      });
    }
    // find the lecture progress in course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );
    if (lectureIndex !== -1) {
      //update the lecture progress
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      //if lecture not found in course progress add it
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }
    // if all lecture is completed
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lecture) => lecture.viewed
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength) {
      courseProgress.completed = true;
    }
    await courseProgress.save()
    return res.status(200).json({ message: "Lecture progress updated successfully", success: true });
  } catch (error) {
    console.error("Error updating lecture progress :", error);
    return res
      .status(500)
      .json({ message: "Error updating lecture progress", success: false });
  }
};

//mark as completed
export const markAsCompleted = async (req, res) =>{
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress= await CourseProgress.findOne({courseId,userId})
        if (!courseProgress) {
            return res.status(404).json({message:"Course progress not found",success:false})
        }
        courseProgress.lectureProgress.map((lecture)=>lecture.viewed=true)
        courseProgress.completed=true
        await courseProgress.save()
        return res.status(200).json({message:"Course marked as completed",success:true})
    } catch (error) {
        console.error("Error marking as completed :", error);
        return res.status(500).json({ message: "Error marking as completed", success: false})
    }
}

//mark as incomplete
export const markAsIncomplete = async (req, res) =>{
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress= await CourseProgress.findOne({courseId,userId})
        if (!courseProgress) {
            return res.status(404).json({message:"Course progress not found",success:false})
        }
        courseProgress.lectureProgress.map((lecture)=>lecture.viewed=false)
        courseProgress.completed=false
        await courseProgress.save()
        return res.status(200).json({message:"Course marked as incomplete",success:true})
    } catch (error) {
        console.error("Error marking as incomplete :", error);
        return res.status(500).json({ message: "Error marking as incomplete", success: false})
    }
}
