/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function CourseTable() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getAllAdminCourses = async (req, res) => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${url}/api/course/admin/get`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getAllAdminCourses();
  }, []);

  // Skeleton rows for loading state
  const skeletonRows = Array(5)
    .fill(0)
    .map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50px] ml-auto" />
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="mt-24 ml-5 mr-5 md:ml-8">
      <Button
        onClick={() => navigate("/admin/course/create")}
        className={"p-4 cursor-pointer mb-4"}
      >
        New Course <PlusCircle />
      </Button>

      {/* Table for courses */}
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? skeletonRows
            : courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-medium">
                    {course.courseTitle}
                  </TableCell>
                  <TableCell>{course.coursePrice?<>Rs.{course.coursePrice}</>:"NA"}</TableCell>
                  <TableCell>{course.isPublished==true ? <Badge className={"bg-green-600"}>Published</Badge> : <Badge>Draft</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={()=>navigate(`/admin/course/${course._id}/edit`)} size={"sm"} variant={"outline"} className={"cursor-pointer"}><Edit/></Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CourseTable;
