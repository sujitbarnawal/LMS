import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";

function Course({course}) {

  const navigate=useNavigate()

  return (
    <Card
      className={
        "overflow-hidden rounded-lg pt-0 dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      }
    >
      <div className="relative">
        <img
          src={course?.courseThumbnail}
          className="w-full h-36 object-cover rounded-t-lg "
          alt="course_thumbnail"
        />
      </div>
      <CardContent className={"px-5 py-4 space-y-2"}>
        <h1 onClick={()=>navigate(`/course-details/${course?._id}`) } className="hover:underline cursor-pointer font-bold text-lg truncate">
          {course?.courseTitle}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={course?.creator.photoUrl ||"https://github.com/shadcn.png"}
                alt="profile_photo"
                className="rounded-full"
              />
            </Avatar>
            <h1 className="font-medium text-sm ">{course?.creator?.name}</h1>
          </div>
          <Badge className={"bg-blue-600 text-white px-2 py-1 text-xs rounded-full"}>{course?.courseLevel}</Badge>
        </div>
        <div className="text-lg font-bold">
            <span>Rs.{course?.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default Course;
