import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

function EditLecture() {
  const {id}=useParams()
  return (
    <div className="mt-24 mx-10">
      <div className="flex items-center gap-2">
        <Link to={`/admin/course/${id}/lecture`}>
          <Button size={"icon"} variant={"outline"} className={"cursor-pointer rounded-full"}>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="font-bold text-xl">Update lecture details</h1>
      </div>
      <LectureTab/>
    </div>
  );
}

export default EditLecture;
