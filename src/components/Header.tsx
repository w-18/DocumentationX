"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "@/context/session-context-provider";
import { useRouter } from "next/navigation";

type Session = {
  username: string;
  id: string;
  auth_service: "native" | "discord" | "github" | "google";
  auth_service_user_id: string | null;
  admin: boolean;
  premium: number;
  created_at: Date;
  pfp_url: string;
  iat: number;
  exp: number;
}
// Props for the DropdownItem component.
interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors text-sm"
  >
    {children}
  </div>
);

export default function Func(){
  // Cast the result from useSession so that TypeScript knows the shape.
  const { session, loading } = useSession() as {
    session: Session | null;
    loading: boolean;
  };
  const router = useRouter();
  const [isMinimal, setIsMinimal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // Use appropriate types for refs.
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const checkScreenSize = () => setIsMinimal(window.innerWidth < 640);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownHover = (show: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (show) {
      setShowDropdown(true);
    } else {
      timeoutRef.current = window.setTimeout(() => setShowDropdown(false), 200);
    }
  };

  return (
    <div className="fixed h-[60px] w-full z-50 top-0 left-0 right-0 flex items-center justify-between px-4">
      <h1
        className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
        onClick={() => router.push("/")}
      >
        {isMinimal ? "DocX" : process.env.NEXT_PUBLIC_WEBSITE_NAME || "DocX"}
      </h1>

      {loading ? (
        <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
      ) : session?.username ? (
        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={() => handleDropdownHover(true)}
          onMouseLeave={() => handleDropdownHover(false)}
        >
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 px-3 py-1.5 rounded-lg transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {session.pfp_url && (
              <img
                src={session.pfp_url + "?username=" + session.username}
                alt="Profile Picture"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-white font-bold">
              {session.username}
            </span>
          </div>

          {showDropdown && (
            <div
              className="absolute right-0 top-10 w-48 bg-white/10 rounded-xl backdrop-blur-sm shadow-xl"
              onMouseEnter={() => handleDropdownHover(true)}
              onMouseLeave={() => handleDropdownHover(false)}
            >
              <div className="p-3 border-b border-gray-700 flex items-center gap-2">
                {session.pfp_url && (
                  <div className="text-white bg-white">sfdgdfg

                  <img
                    src={session.pfp_url}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full"
                  />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">
                    {session.username.split("@")[0]}
                  </p>
                  <p className="text-gray-400 text-sm font-bold">
                    Auth: {session.auth_service}
                  </p>
                </div>
              </div>
              <div className="p-1.5">
                <DropdownItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/settings")}>
                  Settings
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/logout")}>
                  Log Out
                </DropdownItem>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() =>
            router.push(`/sign-in?ref=${encodeURIComponent(window.location.pathname)}`)
          }
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
