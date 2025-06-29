/* eslint-disable react-hooks/exhaustive-deps */
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function CourseTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [removeIsLoading, setRemoveIsLoading] = useState(false);
  const [publishIsLoading, setPublishIsLoading] = useState(false);

  const navigate = useNavigate();
  const [course, setCourse] = useState({});

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const url = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();

  const getThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setInput({
      ...input,
      courseThumbnail: file,
    });
    setThumbnailPreview(previewUrl);
  };

  const getInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const saveDetails = async () => {
    try {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("courseTitle", input.courseTitle);
      formdata.append("subTitle", input.subTitle);
      formdata.append("description", input.description);
      formdata.append("category", input.category);
      formdata.append("courseLevel", input.courseLevel);
      formdata.append("coursePrice", input.coursePrice);
      formdata.append("courseThumbnail", input.courseThumbnail);
      const response = await axios.post(
        `${url}/api/course/admin/course/${id}/edit`,
        formdata,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setCourse(response.data.course);
        navigate("/admin/courses");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCourse = async () => {
    try {
      setRemoveIsLoading(true);
      const response = await axios.post(
        `${url}/api/course/admin/course/${id}/remove`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/courses");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setRemoveIsLoading(false);
    }
  };

  const publishCourse = async (query) => {
    try {
      setPublishIsLoading(true);
      const response = await axios.post(
        `${url}/api/course/admin/course/${id}/togglepublish?publish=${query}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/admin/courses')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setPublishIsLoading(false);
    }
  };

  useEffect(() => {
    const getCourseById = async () => {
      try {
        const response = await axios.get(
          `${url}/api/course/${id}/get`,
          { withCredentials: true }
        );
        if (response.data.success) {
          const fetchedCourse = response.data.course;
          setCourse(fetchedCourse);
          setInput({
            courseTitle: fetchedCourse.courseTitle || "",
            subTitle: fetchedCourse.subTitle || "",
            description: fetchedCourse.description || "",
            category: fetchedCourse.category || "",
            courseLevel: fetchedCourse.courseLevel || "",
            coursePrice: fetchedCourse.coursePrice || "",
            courseThumbnail: fetchedCourse.courseThumbnail || "",
          });
          setThumbnailPreview(fetchedCourse.courseThumbnail);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    };
    getCourseById();
  }, []);

  return (
    <Card>
      <CardHeader className={"flex sm:flex-row flex-col  justify-between"}>
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>Make changes to your courses here</CardDescription>
        </div>
        <div className="space-x-2">
          {publishIsLoading ? (
            <Button disabled={true}>Please wait...</Button>
          ) : (
            <Button
              onClick={() => publishCourse(!course.isPublished)}
              className={"cursor-pointer"}
              variant={"outline"}
              disabled={!course?.lectures || course.lectures.length === 0}
            >
              {course.isPublished ? "Unpublish" : "Publish"}
            </Button>
          )}

          {removeIsLoading ? (
            <Button disabled={true}>
              Removing...
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              className={"cursor-pointer"}
              onClick={removeCourse}
            >
              Remove Course
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 ">
          <div>
            <Label className={"mb-2"}>Title</Label>
            <Input
              name="courseTitle"
              value={input.courseTitle}
              onChange={getInput}
              type={"text"}
              placeholder={"Ex. ReactJS Crash Course"}
            />
          </div>
          <div>
            <Label className={"mb-2"}>Subtitle</Label>
            <Input
              name="subTitle"
              value={input.subTitle}
              onChange={getInput}
              type={"text"}
              placeholder={"Ex. Specialize in React"}
            />
          </div>
          <div>
            <Label className={"mb-2"}>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex max-md:flex-col max-md:items-start items-center gap-5">
            <div>
              <Label className={"mb-2"}>Category</Label>
              <Select
                onValueChange={(value) =>
                  setInput({ ...input, category: value })
                }
                value={input.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Backend Development">
                      Backend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="Mobile App Development">
                      Mobile App Development
                    </SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Artificial Intelligence">
                      Artificial Intelligence
                    </SelectItem>
                    <SelectItem value="Machine Learning">
                      Machine Learning
                    </SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Cloud Computing">
                      Cloud Computing
                    </SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Blockchain">Blockchain</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Data Engineering">
                      Data Engineering
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={"mb-2"}>Course Level</Label>
              <Select
                onValueChange={(value) =>
                  setInput({ ...input, courseLevel: value })
                }
                value={input.courseLevel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={"mb-2"}>Price</Label>
              <Input
                name="coursePrice"
                value={input.coursePrice}
                onChange={getInput}
                type={"number"}
                placeholder={"450"}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2">Course Thumbnail</Label>
            <Input
              onChange={getThumbnail}
              type={"file"}
              accept="image/*"
              className={"w-fit"}
            />
            {thumbnailPreview && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <img
                  src={thumbnailPreview}
                  alt="Course thumbnail preview"
                  className="max-w-xs h-auto rounded-md border object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/admin/courses")}
              className={"cursor-pointer"}
              variant={"outline"}
            >
              Cancel
            </Button>
            {!isLoading ? (
              <Button onClick={saveDetails} className={"cursor-pointer"}>
                Save
              </Button>
            ) : (
              <Button className={"cursor-pointer"} disabled={true}>
                Saving...
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
