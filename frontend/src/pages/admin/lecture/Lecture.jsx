import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Lecture({ lecture, index, courseId }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-[#f7f9fa] dark:bg-[#1f1f1f] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture - {index + 1}{" "}
        {lecture.lectureTitle}
      </h1>
      <Edit
        onClick={() =>
          navigate(`/admin/course/${courseId}/lecture/${lecture._id}/edit`)
        }
        size={"20"}
        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      />
    </div>
  );
}
