/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import Course from "./Course";
import toast from "react-hot-toast";
import axios from "axios";
import useLmsStore from "@/store/lmsStore";
// import useLmsStore from "@/store/lmsStore";
// import { useNavigate } from "react-router-dom";

function MyLearnings() {
  const [myLearningCourses,setMyLearningCourses] = useState([]);
  const {user} = useLmsStore()
  const [isLoading,setIsLoading] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;
  // const navigate=useNavigate()

  // useEffect(()=>{
  //   if(!user){
  //     navigate('/login')
  //   }
  //   },[user])

  useEffect(()=>{
      const getAllEnrolledCourses=async()=>{
        try {
          setIsLoading(true)
          const response=await axios.get(`${url}/api/course/${user._id}/enrolled/get`,{withCredentials:true})
          if(response.data.success){
            setMyLearningCourses(response.data.enrolledCourses)
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || error?.message)
        } finally{
          setIsLoading(false)
        }
      }
      getAllEnrolledCourses()
    },[])

  return (
    <div className="max-w-4xl mx-auto my-24 px-4  ">
      <h1 className="font-bold text-2xl">MY LEARNINGS</h1>
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearningCourses.length === 0 ? (
          <p>You are not enrolled in any courses</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearningCourses.map((course,index) => (
            <Course key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLearnings;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((course, index) => (
      <div
        key={index}
        course={course}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-80 animate-pulse"
      ></div>
    ))}
  </div>
);
