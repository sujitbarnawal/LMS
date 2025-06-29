/* eslint-disable react-hooks/exhaustive-deps */
import useLmsStore from "@/store/lmsStore";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentStatus() {
  const purchaseProcessed = useRef(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;
  const { courseId } = useLmsStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const transactionId = queryParams.get("transactionId");

  useEffect(() => {
    const processedKey = `purchaseProcessed_${courseId}_${transactionId}`;
    const processed = sessionStorage.getItem(processedKey);

    if (processed) {
      purchaseProcessed.current = true;
    }

    if (!purchaseProcessed.current) {
      if (status === "success") {
        purchaseProcessed.current = true;
        sessionStorage.setItem(processedKey, "true");
        purchaseCourse();
      } else {
        toast.error("Payment failed or canceled");
        navigate(`/course/${courseId}`);
        purchaseProcessed.current = true;
      }
    }
  }, [status, navigate, courseId, transactionId]);

  const purchaseCourse = async () => {
    try {
      console.log(courseId);
      console.log(`${url}/api/course/${courseId}/purchase?transactionId=${transactionId}`);
      const response = await axios.post(
        `${url}/api/course/${courseId}/purchase?transactionId=${transactionId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Course purchased successfully");
        navigate(`/course-progress/${courseId}`);
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      navigate(`/course-details/${courseId}`);
    }
  };

  return null;
}

export default PaymentStatus;
