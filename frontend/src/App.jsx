import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyLearnings from "./pages/student/MyLearnings";
import EditProfile from "./pages/student/EditProfile";
import Dashboard from "./pages/admin/Dashboard";
import Admin from "./pages/admin/Admin";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import PaymentStatus from "./pages/student/PaymentStatus";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import Courses from "./pages/student/Courses";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";

// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
// ]);

function App() {
  return (
    <>
      {/* <RouterProvider router={appRouter}/> */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* user routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-learnings" element={<MyLearnings />} />
          <Route path="/profile/:id/edit" element={<EditProfile />} />
          <Route path="/course/search" element={<SearchPage />} />
          <Route path="/course-details/:id" element={<CourseDetail />} />
          <Route
            path="/course-progress/:id"
            element={
              <PurchaseCourseProtectedRoute>
                <CourseProgress />
              </PurchaseCourseProtectedRoute>
            }
          />
          {/* <Route path='/courses' element={<Courses/>}/> */}

          {/* admin routes */}
          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<CourseTable />} />
            <Route path="course/create" element={<AddCourse />} />
            <Route path="course/:id/edit" element={<EditCourse />} />
            <Route path="course/:id/lecture" element={<CreateLecture />} />
            <Route
              path="/admin/course/:id/lecture/:lectureId/edit"
              element={<EditLecture />}
            />
          </Route>

          {/*Payment routes */}
          <Route path="/payment" element={<PaymentStatus />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
