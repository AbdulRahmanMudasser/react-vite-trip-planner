import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      await GetUserProfile(tokenResponse);
    },
    onError: (error) => console.log("Login Error:", error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("User Data:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="w-full p-2 shadow-sm flex justify-between items-center bg-white">
      {/* Logo and Title */}
      <div className="flex font-bold text-lg items-center">
        <img src="/logo.svg" alt="Logo" className="h-8 mr-2" />
        <h2>Trip Planner</h2>
      </div>

      {/* User Actions */}
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">
                My Trip
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt="User Profile"
                  className="h-[35px] w-[35px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={(val) => setOpenDialog(val)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className="flex font-bold text-lg">
                <img src="/logo.svg" alt="Logo" className="h-8 mr-2" />
                <h2>Trip Planner</h2>
              </div>
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication</p>

              <Button
                onClick={login}
                className="w-full mt-5 gap-4 items-center"
              >
                <FcGoogle />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;