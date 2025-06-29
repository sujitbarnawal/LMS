/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Lecture from "./Lecture";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function CreateLecture() {
  const [input, setInput] = useState({
    lectureTitle: "",
  });
  const [createIsLoading, setCreateIsLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const url = import.meta.env.VITE_BACKEND_URL;

  const getLectures = async () => {
      try {
        setSkeletonLoading(true);
        const response = await axios.get(
          `${url}/api/course/admin/course/${id}/lectures/get`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setLectures(response.data.lectures);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      } finally {
        setSkeletonLoading(false);
      }
    };

  const createLecture = async () => {
    try {
      setCreateIsLoading(true);
      const response = await axios.post(
        `${url}/api/course/admin/course/${id}/lecture/create`,
        { lectureTitle: input.lectureTitle },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setInput({ lectureTitle: "" });
        await getLectures();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setCreateIsLoading(false);
    }
  };

  useEffect(() => {
    getLectures();
  }, []);

  return (
    <div className="mt-24 mx-10 flex-1">
      <div className="mb-4">
        <h1 className="font-bold text-2xl mb-2">Add New Lecture</h1>
        <p className="text-md">
          Fill out the form below to create a new lecture
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label className={"mb-4"}>Title</Label>
          <Input
            onChange={(e) =>
              setInput({ ...input, lectureTitle: e.target.value })
            }
            value={input.lectureTitle}
            type={"text"}
            className={"w-1/2"}
            name="title"
            placeholder="Lecture name"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(`/admin/course/${id}/edit`)}
            className={"cursor-pointer"}
            variant={"outline"}
          >
            Back to Course
          </Button>
          {createIsLoading ? (
            <Button disabled={true}>
              Creating... <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </Button>
          ) : (
            <Button onClick={createLecture} className={"cursor-pointer"}>
              Create Lecture
            </Button>
          )}
        </div>
        <div className="mt-10">
          {skeletonLoading ? (
            <LecturesSkeleton />
          ) : (
            <>
              {lectures.length === 0 && (
                <p className="font-bold">No Lectures available for this course</p>
              )}
              {lectures.length!==0 &&
                lectures.map((lecture, index) => (
                  <Lecture lecture={lecture} key={lecture._id} index={index} courseId={id} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;

const LecturesSkeleton = () => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <Skeleton key={index} className="flex h-[30px] items-center justify-between bg-[#f7f9fa] dark:bg-[#1f1f1f] px-4 mb-2 rounded-md">
      </Skeleton>
    ));
};
