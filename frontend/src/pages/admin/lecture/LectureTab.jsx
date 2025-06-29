/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function LectureTab() {
  const [removeIsLoading, setRemoveIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;
  const { id, lectureId } = useParams();
  const navigate = useNavigate();
  const [videoPreview, setVideoPreview] = useState("");
  const [lecture, setLecture] = useState({});

  const [input, setInput] = useState({
    lectureTitle: "",
    videoUrl: "",
    isPreviewFree: false,
  });

  const getVideoUrl = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select an video file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setInput({
      ...input,
      videoUrl: file,
    });
    setVideoPreview(previewUrl);
  };

  const removeLecture = async () => {
    try {
      setRemoveIsLoading(true);
      const response = await axios.post(
        `${url}/api/course/admin/course/${id}/lecture/${lectureId}/remove`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Lecture removed successfully");
        navigate(`/admin/course/${id}/lecture`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setRemoveIsLoading(false);
    }
  };

  const updateLecture = async () => {
    try {
      setIsLoading(true)
      const formdata = new FormData();
      formdata.append("lectureTitle", input.lectureTitle);
      formdata.append("videoUrl", input.videoUrl);
      formdata.append("isPreviewFree", input.isPreviewFree);
      const response = await axios.post(`${url}/api/course/admin/course/${id}/lecture/${lectureId}/edit`,
        formdata,
        { withCredentials: true }
      )
      if (response.data.success) {
        toast.success("Lecture updated successfully");
        setLecture(response.data.lecture)
        navigate(`/admin/course/${id}/lecture`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const getLectureById = async () => {
      try {
        const response = await axios.get(
          `${url}/api/course/admin/course/${id}/lecture/${lectureId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          const fetchedLecture = response.data.lecture;
          setLecture(fetchedLecture);
          setInput({
            lectureTitle: fetchedLecture.lectureTitle || "",
            isPreviewFree: fetchedLecture.isPreviewFree || false,
            videoUrl: fetchedLecture.videoUrl || "",
          });
          setVideoPreview(fetchedLecture.videoUrl);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    };
    getLectureById();
  }, []);

  return (
    <Card className={"mt-4"}>
      <CardHeader className={"flex sm:flex-row flex-col justify-between"}>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription className={"mt-2"}>
            Make changes to your lecture here
          </CardDescription>
        </div>
        <div>
          {removeIsLoading ? (
            <Button disabled={true}>
              Removing...
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              className={"cursor-pointer"}
              onClick={removeLecture}
            >
              Remove Lecture
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 ">
          <div>
            <Label className={"mb-2"}>Title</Label>
            <Input
              name="lectureTitle"
              onChange={(e) =>
                setInput({ ...input, lectureTitle: e.target.value })
              }
              className={"w-1/2"}
              type={"text"}
              value={input.lectureTitle}
              placeholder={"Ex. Introduction"}
            />
          </div>
          <div>
            <Label className={"mb-2"}>
              Video<span className="text-red-500">*</span>
            </Label>
            <Input
              name="videoUrl"
              onChange={getVideoUrl}
              className={"w-1/2"}
              type={"file"}
              accept="video/*"
              placeholder={"Ex. Introduction"}
            />
            {videoPreview && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <video
                  controls
                  className="max-w-xs h-auto rounded-md border object-cover"
                  src={videoPreview}
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="free"
              checked={input.isPreviewFree}
              onCheckedChange={(checked) =>
                setInput({ ...input, isPreviewFree: checked })
              }
            />
            <Label htmlFor="free">Is Video Free</Label>
          </div>
          <div>
            {!isLoading ? (
              <Button onClick={updateLecture} className={"cursor-pointer"}>
                Update
              </Button>
            ) : (
              <Button className={"cursor-pointer"} disabled={true}>
                Updating...
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LectureTab;
