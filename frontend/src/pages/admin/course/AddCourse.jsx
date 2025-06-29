import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddCourse() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;
  const [input, setInput] = useState({
    courseTitle: "",
    category: "",
  });

  const createCourse = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${url}/api/course/create`, input, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/courses");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-24 mx-10 flex-1">
      <div className="mb-4">
        <h1 className="font-bold text-2xl mb-2">Add New Course</h1>
        <p className="text-md">
          Fill out the form below to create a new course offering
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label className={"mb-4"}>Title</Label>
          <Input
            onChange={(e) =>
              setInput({ ...input, courseTitle: e.target.value })
            }
            value={input.courseTitle}
            type={"text"}
            className={"w-1/2"}
            name="courseTitle"
            placeholder="Course name"
          />
        </div>
        <div>
          <Label className={"mb-4"}>Category</Label>
          <Select
            onValueChange={(value) => setInput({ ...input, category: value })}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                <SelectItem value="Data Engineering">Data Engineering</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin/courses")}
            className={"cursor-pointer"}
            variant={"outline"}
          >
            Back
          </Button>
          {isLoading ? (
            <Button disabled={true}>
              Creating... <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            </Button>
          ) : (
            <Button onClick={createCourse} className={"cursor-pointer"}>
              Create
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
