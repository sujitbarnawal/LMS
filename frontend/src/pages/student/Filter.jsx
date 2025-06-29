import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "../../components/ui/select";
import { Separator } from "@/components/ui/separator";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";

const categories = [
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Backend Development", label: "Backend Development" },
  { id: "Fullstack Development", label: "Fullstack Development" },
  { id: "Mobile App Development", label: "Mobile App Development" },
  { id: "Data Science", label: "Data Science" },
  { id: "Artificial Intelligence", label: "Artificial Intelligence" },
  { id: "Machine Learning", label: "Machine Learning" },
  { id: "Cybersecurity", label: "Cybersecurity" },
  { id: "Cloud Computing", label: "Cloud Computing" },
  { id: "Devops", label: "DevOps" },
  { id: "Blockchain", label: "Blockchain" },
  { id: "UI/UX Design", label: "UI/UX Design" },
  { id: "Data Engineering", label: "Data Engineering" },
];

function Filter({ handleFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];
      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const handleSelectSortByPrice = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={handleSelectSortByPrice}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By Price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className={"my-4"} />
      <div>
        <h1 className="font-semibold mb-2">Category</h1>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label
              htmlFor={category.id}
              className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 leading-none"
            >
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;
