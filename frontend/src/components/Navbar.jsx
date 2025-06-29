import { School } from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useLmsStore from "@/store/lmsStore";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import DarkMode from "./DarkMode";
import axios from "axios";

const Navbar = () => {
  const { user,setUser } = useLmsStore();
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate=useNavigate()

  const handleLogout=async()=>{
    try {
      const response = await axios.post(`${url}/api/user/logout`,{},{
        withCredentials:true
      })
      if(response.data.success){
        setUser(null)
        toast.success(response.data.message)
        navigate('/login')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  }

  return (
    <div className="h-16 px-5 md:px-10 dark:bg-gray-900  bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 ">
      {/*Desktop View */}
      <div className="hidden md:flex mx-auto max-w-7xl justify-between items-center gap-10 h-full">
        {/* Logo */}
        <div onClick={()=>navigate('/')} className="flex items-center  gap-2 cursor-pointer">
          <School size={"30"} />
          <h1 className="font-extrabold text-2xl">TalentPath</h1>
        </div>
        {/* profile and mode */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className={"cursor-pointer"}>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="profile_photo"
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel><p className="text-blue-600">{user?.name}</p></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user?.role==="student"&& <DropdownMenuItem onClick={()=>navigate('/my-learnings')}>My Learning</DropdownMenuItem>}
                  {user?.role==="instructor"&& <DropdownMenuItem onClick={()=>navigate('/admin/courses')}>Courses</DropdownMenuItem>}
                  <DropdownMenuItem onClick={()=>navigate(`/profile/${user._id}/edit`)}>Edit Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuGroup>
                {user.role ==="instructor" &&
                <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>navigate('/admin/dashboard')}>Dashboard</DropdownMenuItem>
                </>
                }
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={()=>navigate('/login') } className={"cursor-pointer"} variant={"outline"}>
                Login
              </Button>
              <Button onClick={()=>navigate('/login') } className={"cursor-pointer"}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/*Mobile View */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 onClick={()=>navigate('/')} className="font-extrabold text-2xl cursor-pointer">TalentPath</h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

const MobileNavbar=()=>{
  const { user,setUser } = useLmsStore();
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate=useNavigate()

  const handleLogout=async()=>{
    try {
      const response = await axios.post(`${url}/api/user/logout`,{},{
        withCredentials:true
      })
      if(response.data.success){
        setUser(null)
        toast.success(response.data.message)
        navigate('/login')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className={
            "rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300"
          }
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className={"flex flex-col"}>
        <SheetHeader
          className={"flex flex-row items-center justify-between mt-10"}
        >
          <SheetTitle><p className="text-blue-600">{user?.name}</p></SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DarkMode />
            </DropdownMenuTrigger>
          </DropdownMenu>
        </SheetHeader>
          {user &&
          <nav className="flex flex-col space-y-4 ml-5">
            {user?.role==="student"&&<NavLink to={"/my-learnings"}>My Learning</NavLink>}
            {user?.role==="instructor"&&<NavLink to={"/admin/courses"}>Courses</NavLink>}
          <NavLink to={`/profile/${user._id}/edit`}>Edit Profile</NavLink>
          <p onClick={handleLogout}>Logout</p>
        </nav>
          }
        
        {user?.role === "instructor" && (
          <SheetFooter className={"mt-0"}>
            <SheetClose asChild>
              <Button onClick={()=>navigate('/admin/dashboard')}>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default Navbar;
