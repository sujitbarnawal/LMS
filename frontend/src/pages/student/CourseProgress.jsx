
/* eslint-disable react-hooks/exhaustive-deps */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { CheckCircle, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function CourseProgress() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [progress, setProgress] = useState();
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const updateLectureProgress = async (lectureId) => {
    try {
      const response = await axios.post(
        `${url}/api/course-progress/${id}/lecture/${lectureId}/view`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        // toast.success(response.data.message);
        getCourseProgress();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const markAsCompleted = async () => {
    try {
      const response = await axios.post(
        `${url}/api/course-progress/${id}/completed/mark`,{},
        { withCredentials: true }
      );
      if (response.data.success) {
        // setIsCompleted(true);
        toast.success(response.data.message);
        getCourseProgress();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const markAsIncomplete = async () => {
    try {
      const response = await axios.post(
        `${url}/api/course-progress/${id}/incomplete/mark`,{},
        { withCredentials: true }
      );
      if (response.data.success) {
        // setIsCompleted(false);
        toast.success(response.data.message);
        getCourseProgress();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const response = await axios.get(`${url}/api/course-progress/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCourseDetails(response.data.data.courseDetails);
        setProgress(response.data.data.progress);
        setIsCompleted(response.data.data.completed);
        if (!currentLecture) {
          setCurrentLecture(response.data.data?.courseDetails?.lectures[0]);
        }
        console.log(response.data.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const selectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  return (
    <div className="max-w-7xl p-4 mx-auto mt-20">
      {/* title */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseDetails.courseTitle}</h1>
        <Button onClick={isCompleted?markAsIncomplete:markAsCompleted} className={"cursor-pointer"}>
          {isCompleted ? "Incomplete" : "Complete"}
        </Button>
      </div>

      {/* bottom section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* video */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              onPlay={() => updateLectureProgress(currentLecture?._id)}
              controls
              className="w-full h-auto md:rounded-lg"
              src={currentLecture?.videoUrl}
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {currentLecture?.lectureTitle || "Lecture Title"}
            </h3>
          </div>
        </div>
        {/* lecture sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures?.map((lecture, index) => (
              <Card
                onClick={() => selectLecture(lecture)}
                className={`mb-3 hover:cursor-pointer transition transform  ${
                  lecture._id === currentLecture._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
                key={index}
              >
                <CardContent className={"flex items-center justify-between"}>
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      isCompleted ? (
                        <CheckCircle
                          className="text-green-500 mr-2"
                          size={24}
                        />
                      ) : (
                        <CheckCircle
                          className="text-yellow-500 mr-2"
                          size={24}
                        />
                      )
                    ) : (
                      <PlayCircle size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className={"text-lg font-medium"}>
                        {lecture?.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant="outline"
                      className={
                        isCompleted
                          ? "bg-green-200 text-green-600"
                          : "bg-yellow-200 text-yellow-600"
                      }
                    >
                      {isCompleted ? "completed" : "viewed"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseProgress;
