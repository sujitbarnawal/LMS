
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

function SearchResult({ course }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-300 py-4">
      <Link
        to={`/course-details/${course?._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course?.courseThumbnail}
          className="h-32 w-full md:w-56 object-cover rounded-sm"
          alt="thumbnail"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold md:text-lg">{course?.courseTitle||"title"}</h1>
          <p className="text-sm text-gray-600" >{course?.subTitle||"subtitle"}</p>
          <p className="text-sm text-gray-700">Instructor: <span className="font-bold">{course?.creator?.name||"creator"}</span></p>
          <Badge className={"w-fit  md:mt-0"}>{course?.courseLevel||"medium"}</Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl">Rs.{course.coursePrice}</h1>
      </div>
    </div>
  );
}

export default SearchResult;
