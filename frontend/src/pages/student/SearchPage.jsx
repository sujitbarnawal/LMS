/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);

  const url = import.meta.env.VITE_BACKEND_URL;
  const [courses, setCourses] = useState([]);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const value = query.get("query");

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleFilterChange = (categories, price) => {
    setSelectedCategory(categories);
    setSortByPrice(price);
  };

  const getSearchedCourse = async ({
    searchQuery,
    categories,
    sortByPrice,
  }) => {
    try {
      setIsLoading(true);
      let queryString = `search?query=${encodeURIComponent(searchQuery)}`;
      if (categories && categories.length > 0) {
        const categoryString = categories.map(encodeURIComponent).join(",");
        queryString += `&categories=${categoryString}`;
      }
      if (sortByPrice) {
        queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
      }
      const response = await axios.get(`${url}/api/course/${queryString}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (value) {
      getSearchedCourse({
        searchQuery: value,
        categories: selectedCategory,
        sortByPrice: sortByPrice,
      });
    }
  }, []);

  useEffect(() => {
    getSearchedCourse({
      searchQuery: value,
      categories: selectedCategory,
      sortByPrice: sortByPrice,
    });
  }, [selectedCategory, sortByPrice, value]);

  return (
    <div className="max-w-7xl mt-10  mx-auto p-4 md:p-8">
      <div className="my-6">
        {value && (
          <>
            <h1 className="font-bold text-xl md:text-2xl">
              results for "{value}"
            </h1>
            <p>
              showing results for{" "}
              <span className="text-blue-800 font-bold">{value}</span>{" "}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1">
          {isLoading ? (
            [1, 2, 3].map((_, index) => <CourseSkeleton key={index} />)
          ) : courses.length === 0 ? (
            <CourseNotFound />
          ) : (
            courses.map((course, index) => (
              <SearchResult course={course} key={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button className={"cursor-pointer"} variant="link">
          Browse All Courses
        </Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 mt-2" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};
