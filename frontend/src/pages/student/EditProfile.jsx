/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLmsStore from "@/store/lmsStore";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

function EditProfile() {
  const { user, setUser } = useLmsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledCourses,setEnrolledCourses]=useState([])
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [name, setName] = useState(user?.name);
  const [profilePhoto, setProfilePhoto] = useState("");
  const url = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();

  const getFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdateIsLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (profilePhoto) {
        formData.append("profile", profilePhoto);
      }

      const response = await axios.post(
        `${url}/api/user/profile/${id}/edit`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.user);
        setProfilePhoto(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setUpdateIsLoading(false);
    }
  };

  useEffect(()=>{
    const getAllEnrolledCourses=async()=>{
      try {
        setIsLoading(true)
        const response=await axios.get(`${url}/api/course/${id}/enrolled/get`,{withCredentials:true})
        if(response.data.success){
          setEnrolledCourses(response.data.enrolledCourses)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message)
      } finally{
        setIsLoading(false)
      }
    }
    getAllEnrolledCourses()
  },[])

  // const navigate=useNavigate()

  // useEffect(()=>{
  // if(!user){
  //   navigate('/login')
  // }
  // },[user])

  return (
    <div className="my-24 max-w-4xl mx-auto px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start mt-4 gap-8">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="profile_photo"
              className="rounded-full"
            />
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <h1 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 ml-2 dark:text-gray-300">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 ml-2 dark:text-gray-300">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 ml-2 dark:text-gray-300">
                {user?.role}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className={"mt-2 cursor-pointer"}>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    value={name}
                    type={"text"}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Profile
                  </Label>
                  <Input
                    onChange={getFile}
                    id="profile"
                    type={"file"}
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                {updateIsLoading ? (
                  <Button disabled={true}>
                    Updating...
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  </Button>
                ) : (
                  <Button className={"cursor-pointer"} onClick={updateProfile}>
                    Save changes
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {user?.role === "student" && (
        <div className="mt-6">
          {enrolledCourses.length>0 &&
          <h1 className="font-medium text-lg">Courses you are enrolled in</h1>
          }
          {isLoading ? (
            <EnrolledCoursesSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
              {enrolledCourses.length === 0 ? (
                <h1>You have not enrolled yet</h1>
              ) : (
                enrolledCourses.map((course) =>
                  course && course._id ? (
                    <Course key={course._id} course={course} />
                  ) : (
                    null
                  )
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EditProfile;

const EnrolledCoursesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-60 mt-2 animate-pulse"
      ></div>
    ))}
  </div>
);
