/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import useLmsStore from "@/store/lmsStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import CourseTable from "./course/CourseTable";
import AddCourse from "./course/AddCourse";
import EditCourse from "./course/EditCourse";
import CreateLecture from "./lecture/CreateLecture";
import EditLecture from "./lecture/EditLecture";


function Admin() {
  const { user } = useLmsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const {id,lectureId}=useParams()

  useEffect(() => {
    if (user?.role === "student") {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {location.pathname === "/admin/dashboard" && <Dashboard />}
        {location.pathname === "/admin/courses" && <CourseTable />}
        {location.pathname === "/admin/course/create" && <AddCourse />}
        {location.pathname === `/admin/course/${id}/edit` && <EditCourse />}
        {location.pathname === `/admin/course/${id}/lecture` && <CreateLecture />}
        {location.pathname === `/admin/course/${id}/lecture/${lectureId}/edit` && <EditLecture />}
        {location.pathname === "/admin" && (
          <div className="min-h-screen bg-white text-gray-800">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 px-6 dark:from-gray-800 dark:to-gray-900">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome to Talent Path Admin
                  </h1>
                  <p className="text-lg mb-6">
                    Manage your platform efficiently. Monitor courses, users, and more from one place.
                  </p>
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-gray-50">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Why Use the Admin Panel?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-xl font-semibold mb-2">
                      Course Management
                    </h3>
                    <p>
                      Easily add, update, and delete courses with intuitive controls.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-xl font-semibold mb-2">
                      User Control
                    </h3>
                    <p>
                      Track student progress and manage instructors effortlessly.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-xl font-semibold mb-2">
                      Insights & Analytics
                    </h3>
                    <p>
                      View performance data to make informed administrative decisions.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
