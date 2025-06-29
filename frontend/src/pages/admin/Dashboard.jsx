/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLmsStore from "@/store/lmsStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Dashboard() {
  const { user } = useLmsStore();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPurchasedCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/api/course/admin/purchsed-courses/get`, {
        withCredentials: true,
      });
      if (response.data.success) {
        console.log(response.data.purchasedCourses);
        const filteredCourses = response.data.purchasedCourses.filter(
          (course) => course.courseId?.creator === user._id
        );
        console.log(filteredCourses);
        setPurchasedCourses(filteredCourses);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "student") {
      navigate("/");
    }
    getPurchasedCourses();
  }, []);

  const courseData = purchasedCourses.map((course) => ({
    name: course.courseId?.courseTitle || "Untitled",
    price: course.courseId?.coursePrice || 0,
  }));

  const totalRevenue = purchasedCourses.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );

  return (
    <div className="mt-24 ml-5 mr-5 md:ml-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {purchasedCourses.length}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            Rs.{totalRevenue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Course Prices Line Chart */}
      <Card className="shadow-lg hover:shadow-xl  transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent className>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`Rs.${value}`, name]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
