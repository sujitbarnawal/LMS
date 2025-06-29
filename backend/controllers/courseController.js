import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/lectureModel.js";
import PurchaseCourse from "../models/purchaseCourseModel.js";

//create course
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Please provide course title and category",
        success: false,
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    res
      .status(201)
      .json({ message: "Course created successfully", success: true, course });
  } catch (error) {
    console.error("Edit profile error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//get all courses by one creator
export const getAllAdminCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    res.status(200).json({
      message: "Courses retrieved successfully",
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//get published courses
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res
        .status(404)
        .json({ message: "No courses found", success: false });
    }
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get published courses error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//edit course
export const editCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      category,
      description,
      subTitle,
      courseLevel,
      coursePrice,
    } = req.body;
    const file = req.file;
    const courseId = req.params.id;

    let course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }
    let courseThumbnail = course.courseThumbnail;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "course_thumbnails",
      });
      courseThumbnail = result.secure_url;
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseTitle: courseTitle || course.courseTitle,
        category: category || course.category,
        description: description || course.description,
        subTitle: subTitle || course.subTitle,
        courseLevel: courseLevel || course.courseLevel,
        coursePrice: Number(coursePrice) || Number(course.coursePrice),
        courseThumbnail,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Course updated successfully",
      success: true,
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Edit course error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//get course by id
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId)
      .populate("lectures")
      .populate({ path: "creator", select: "name" });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course by id error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//remove course
export const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }

    if (course.lectures && course.lectures.length > 0) {
      await Lecture.deleteMany({ _id: { $in: course.lectures } });
    }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      message: "Course and associated lectures removed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Remove course error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// create lecture
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const courseId = req.params.id;
    if (!lectureTitle) {
      return res
        .status(400)
        .json({ message: "Lecture title is required", success: false });
    }
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "Course id is required", success: false });
    }
    const lecture = new Lecture({
      lectureTitle,
      course: courseId,
    });
    await lecture.save();
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    res
      .status(201)
      .json({ message: "Lecture created successfully", success: true });
  } catch (error) {
    console.error("Create lecture error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//get lectures
export const getLectures = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }
    res.status(200).json({ lectures: course.lectures, success: true });
  } catch (error) {
    console.error("Get lectures error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//edit lecture
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, isPreviewFree } = req.body;
    const file = req.file;
    const lectureId = req.params.lectureId;
    // const courseId = req.params.id;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ message: "Lecture not found", success: false });
    }

    let videoUrl = lecture.videoUrl;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "video",
        folder: "lectureVideos",
      });
      videoUrl = result.secure_url;
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        lectureTitle: lectureTitle || lecture.lectureTitle,
        isPreviewFree: isPreviewFree ?? lecture.isPreviewFree,
        videoUrl: videoUrl,
      },
      { new: true }
    );

    // await Course.updateOne(
    //   { _id: courseId, 'lectures._id': lectureId },
    //   {
    //     $set: {
    //       'lectures.$.lectureTitle': updatedLecture.lectureTitle,
    //       'lectures.$.isPreviewFree': updatedLecture.isPreviewFree,
    //       'lectures.$.videoUrl': updatedLecture.videoUrl,
    //     },
    //   }
    // );

    res.status(200).json({
      message: "Lecture updated successfully",
      lecture: updatedLecture,
      success: true,
    });
  } catch (error) {
    console.error("Edit lecture error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//get lecture by id
export const getLectureById = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ message: "Lecture not found", success: false });
    }
    res.status(200).json({ lecture, success: true });
  } catch (error) {
    console.error("Get lecture by id error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//remove lecture
export const removeLecture = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const courseId = req.params.id;

    // Delete the lecture
    await Lecture.findByIdAndDelete(lectureId);

    // Find the course and remove lecture reference
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }

    course.lectures = course.lectures.filter(
      (id) => id.toString() !== lectureId
    );

    await course.save();

    return res
      .status(200)
      .json({ message: "Lecture removed successfully", success: true });
  } catch (error) {
    console.error("Remove lecture error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//toggle publish unpublish course
export const togglePublishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }
    course.isPublished = publish === "true";
    await course.save();
    const publishMessage =
      publish === "true"
        ? "Course published successfully"
        : "Course unpublished successfully";
    return res.status(200).json({ message: publishMessage, success: true });
  } catch (error) {
    console.error("Toggle publish course error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.id; // check if this exists
    const courseId = req.params.id;
    const { transactionId } = req.query;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user id missing" });
    }

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID missing" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already purchased this course" });
    }

    const existingPurchase = await PurchaseCourse.findOne({
      userId,
      courseId,
      paymentId: transactionId,
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "This transaction has already been processed.",
      });
    }

    const newPurchase = new PurchaseCourse({
      userId,
      courseId,
      amount: course.coursePrice,
      status: "completed",
      paymentId: transactionId || "esewa",
    });

    await newPurchase.save();

    user.enrolledCourses.push(courseId);
    await user.save();

    course.enrolledStudents.push(userId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course purchased successfully",
    });
  } catch (error) {
    console.error("Purchase course error:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//get all user enrolled courses
export const getAllEnrolledCourses = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      populate: {
        path: "creator",
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const enrolledCourses = user.enrolledCourses;
    return res.status(200).json({ success: true, enrolledCourses });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//filter courses
export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;
    // create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    //if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }
    //if sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; //sort by ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; //sort by descending
    }
    let courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);
    return res.status(200).json({ success: true, courses: courses || [] });
  } catch (error) {
    console.error("Filter courses error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//get all purchased courses
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourses = await PurchaseCourse.find({
      status: "completed",
    }).populate("courseId");

    // Check if any courses were found
    if (!purchasedCourses || purchasedCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No purchased courses found",
        purchasedCourses: [],
      });
    }

    return res.status(200).json({
      success: true,
      purchasedCourses,
    });
  } catch (error) {
    console.error("Get all purchased courses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

