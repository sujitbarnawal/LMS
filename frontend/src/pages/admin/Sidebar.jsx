import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-r-gray-300 dark:border-gray-700
      p-5 sticky top-0 h-screen">
      <div className="mt-24 space-y-4">
        <Link className="flex items-center gap-2" to={'/admin/dashboard'}>
          <ChartNoAxesColumn size={"22"} />
          <h1>Dashboard</h1>
        </Link>
        <Link className="flex items-center gap-2" to={'/admin/courses'}>
          <SquareLibrary size="22" />
          <h1>Courses</h1>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
