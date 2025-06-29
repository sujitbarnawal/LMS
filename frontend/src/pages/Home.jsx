import useLmsStore from "@/store/lmsStore";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import HeroSection from "./student/HeroSection";
import Courses from "./student/Courses";

const Home = () => {
  const { user } = useLmsStore();
  const navigate = useNavigate("/login");

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user]);

  return (
    <>
      {user ? (
        user.role === "student" ? (
          <>
            <HeroSection />
            <Courses />
          </>
        ) : user.role === "instructor" ? (
          <Navigate to={'/admin'}/>
        ) : null
      ) : (
        <>
          <div className="min-h-screen bg-white text-gray-800">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-26 px-6 dark:from-gray-800 dark:to-gray-900">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome to Talent Path
                  </h1>
                  <p className="text-lg mb-6">
                    Your personalized Learning Management System. Empower your
                    skills anytime, anywhere.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-gray-50">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Why Choose Talent Path?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-xl font-semibold mb-2">
                      Interactive Courses
                    </h3>
                    <p>
                      Engage with modern, bite-sized lessons designed for every
                      learner.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-xl font-semibold mb-2">
                      Track Progress
                    </h3>
                    <p>
                      Keep an eye on your learning journey with visual progress
                      tools.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
                    <p>
                      Learn anytime, from anywhere with mobile-friendly access.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
