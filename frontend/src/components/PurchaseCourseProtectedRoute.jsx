/* eslint-disable react-hooks/exhaustive-deps */
import useLmsStore from "@/store/lmsStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { user, setCourseId } = useLmsStore();
  const { id } = useParams(); 
  const url = import.meta.env.VITE_BACKEND_URL;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPurchased = course?.enrolledStudents?.includes(user._id);

  useEffect(() => {
    setCourseId(id);
    const getCourseById = async () => {
      try {
        const response = await axios.get(`${url}/api/course/${id}/get`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setCourse(response.data.course);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      } finally {
        setLoading(false);
      }
    };
    getCourseById();
  }, [id]);

  if (loading) return null; // or a spinner

  return isPurchased ? children : <Navigate to={`/course-details/${id}`} />;
};

export default PurchaseCourseProtectedRoute;
