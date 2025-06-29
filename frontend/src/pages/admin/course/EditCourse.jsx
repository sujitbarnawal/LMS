import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import CourseTab from "./CourseTab";

function EditCourse() {
  const{id}=useParams()
  return (
    <div className="mt-24 ml-5 mr-5 md:ml-8 ">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">Add Course Details</h1>
        <Link to={`/admin/course/${id}/lecture`}>
          <Button className={"cursor-pointer"}>
            Lectures
            <Book className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
}

export default EditCourse;
