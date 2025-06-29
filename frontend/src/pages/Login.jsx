/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import toast from "react-hot-toast";
import useLmsStore from "@/store/lmsStore";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("signup");

  const [loading, setLoading] = useState(false);

  const { user, setUser } = useLmsStore();

  const getLoginInput = (e) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const getSignupInput = (e) => {
    setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
  };

  const url = import.meta.env.VITE_BACKEND_URL;

  const loginHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/login`, loginInput, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUser(response.data.user);
        toast.success(response.data.message);
        setLoginInput({ email: "", password: "" });
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const signupHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/signup`, signupInput, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setSignupInput({ name: "", email: "", password: "" });
        setTabValue("login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center w-full h-screen max-sm:p-5">
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login with your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={getLoginInput}
                  value={loginInput.email}
                  name="email"
                  required
                  type="email"
                  id="email"
                  placeholder="sujit@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={getLoginInput}
                  value={loginInput.password}
                  name="password"
                  required
                  id="password"
                  type="password"
                  placeholder="xyz...."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={loginInput.role}
                  onValueChange={(value) =>
                    setLoginInput({ ...loginInput, role: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              {loading ? (
                <Button>
                  Please wait...
                  <Loader2 className="animate-spin" />{" "}
                </Button>
              ) : (
                <Button className={"cursor-pointer"} onClick={loginHandler}>Login</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Signup Form */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  onChange={getSignupInput}
                  value={signupInput.name}
                  required
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Sujit Barnawal"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={getSignupInput}
                  value={signupInput.email}
                  required
                  name="email"
                  id="email"
                  type="email"
                  placeholder="sujit@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={getSignupInput}
                  value={signupInput.password}
                  required
                  id="password"
                  name="password"
                  type="password"
                  placeholder="xyz...."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={signupInput.role}
                  onValueChange={(value) =>
                    setSignupInput({ ...signupInput, role: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              {loading ? (
                <Button>
                  Please wait... <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button className={"cursor-pointer"} onClick={signupHandler}>Signup</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
