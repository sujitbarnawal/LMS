import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate=useNavigate()
  const[searchQuery,setSearchQuery]=useState("")
  const searchHandler=(e)=>{
    e.preventDefault()
    if(searchQuery.trim()!==""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("")
  }
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4 pt-4">
          Personalize your Learnings
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Match with your best learning options and optimize Your learning
          journey
        </p>
        <form onSubmit={searchHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            placeholder="Search courses"
            className={"flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"}
          ></Input>
          <Button type="submit" className="bg-blue-600   dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer">
            Search
          </Button>
        </form>
        <Button onClick={()=>navigate('/course/search?query')} className="bg-white text-blue-600 dark:bg-gray-800 rounded-full cursor-pointer hover:bg-gray-200">Explore Courses</Button>
      </div>
    </div>
  );
}

export default HeroSection;
