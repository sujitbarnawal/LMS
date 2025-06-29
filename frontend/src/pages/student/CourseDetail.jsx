/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// import PurchaseCourseButton from "@/components/PurchaseCourseButton";
import { GenerateSignature } from "@/utils/GenerateSignature";
import useLmsStore from "@/store/lmsStore";
// import ReactPlayer from 'react-player'

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL;
  const transaction_uuid = Date.now().toString();
  const { setCourseId, user } = useLmsStore();
  const navigate = useNavigate();

  const { id } = useParams();
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
      }
    };
    getCourseById();
  }, []);

  // Function to sanitize and create HTML
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  //handleEsewa
  const handleEsewa = () => {
    document.getElementById("esewaForm").submit();
  };

  return (
    <div className="mt-16 space-y-5">
      <div className="bg-[#2d2f31] text-white ">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course?.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#c0c4fc] underline italic">
              {course?.creator?.name || "User"}
            </span>{" "}
          </p>
          <div className="flex items-center text-sm gap-2">
            <BadgeInfo size={16} />
            <p>Last Updated {course?.updatedAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length || 0}</p>
        </div>
      </div>

      {/* bottom */}
      <div className="flex max-w-7xl mx-auto my-5 px-4 md:px-8 flex-col lg:flex-row justify-between gap-8">
        {/* left side */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          {/* Use dangerouslySetInnerHTML with sanitized content */}
          <p
            className="max-w-none"
            dangerouslySetInnerHTML={createMarkup(course?.description)}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {(course?.lectures?.length || "No") + " lectures"}
              </CardDescription>
            </CardHeader>
            <CardContent className={"space-y-3"}>
              {course?.lectures?.map((lecture, index) => {
                const isAccessible = lecture.isPreviewFree || isPurchased;

                return (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span>
                      {isAccessible ? (
                        <PlayCircle size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </span>
                    <p>{lecture?.lectureTitle}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* right side */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
            {course?.lectures[0]?.isPreviewFree &&
              <div className="w-full aspect-video mb-4">
                <video
                  controls
                  className="w-full h-full rounded-md border object-cover"
                  src={course?.lectures[0]?.videoUrl}
                />
              </div>
            }
              <h1>{course?.lectures[0]?.lectureTitle}</h1>
              <Separator className={"my-2"} />
              <h1 className="text-lg md:text-xl font-semibold">
                Rs. {course?.coursePrice || 0}
              </h1>
            </CardContent>
          </Card>
          <CardFooter className={"flex justify-center p-4"}>
            {isPurchased ? (
              <Button
                onClick={() => navigate(`/course-progress/${id}`)}
                className={"w-full cursor-pointer"}
              >
                Continue Course
              </Button>
            ) : (
              <Button
                onClick={() => handleEsewa()}
                className={"w-full cursor-pointer"}
              >
                Purchase Course
              </Button>
            )}
          </CardFooter>
          <p className="text-sm text-pretty">
            For testing Esewa: <br />
            eSewa ID: 9806800001 Password/MPIN: 1122 Token/OTP:123456
          </p>
          <form
            id="esewaForm"
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
          >
            <input type="hidden" name="amount" value={course?.coursePrice} />
            <input type="hidden" name="tax_amount" value="0" />
            <input
              type="hidden"
              name="total_amount"
              value={course?.coursePrice}
            />
            <input
              type="hidden"
              name="transaction_uuid"
              value={transaction_uuid}
            />
            <input type="hidden" name="product_code" value="EPAYTEST" />
            <input type="hidden" name="product_service_charge" value="0" />
            <input type="hidden" name="product_delivery_charge" value="0" />
            <input
              type="hidden"
              name="success_url"
              value={`${url}/api/payment/esewa/success`}
            />
            <input
              type="hidden"
              name="failure_url"
              value={`${url}/api/payment/esewa/failure`}
            />
            <input
              type="hidden"
              name="signed_field_names"
              value="total_amount,transaction_uuid,product_code"
            />
            <input
              type="hidden"
              name="signature"
              value={GenerateSignature(
                `total_amount=${course?.coursePrice},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`
              )}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
