"use client";

import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Func() {
  const [isMinimal, setIsMinimal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Handle window resizing for minimal view
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set the initial window width
      setIsMinimal(window.innerWidth < 640);

      const handleResize = () => {
        setIsMinimal(window.innerWidth < 640);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup on unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Handle header show/hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY)

      if (window.scrollY <10) {
        // Always show the header if the page is at the top
        setShowHeader(true);
      } else if (window.scrollY > lastScrollY.current) {
        // User is scrolling down: hide the header
        setShowHeader(false);
      } else {
        // User is scrolling up: show the header
        setShowHeader(true);
      }
      // Update the last scroll position
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed h-[50px] w-auto justify-center text-gray-100 z-50 top-0 left-0 right-0 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <h1
        className={`text-4xl ml-4 mt-2 font-bold transition-all duration-300 ease-in-out transform hover:cursor-pointer ${
          isMinimal ? "scale-100 opacity-100" : "scale-100 opacity-90"
        }`}
        onClick={() => redirect("/")}
      >
        {isMinimal ? "DocX" : process.env.NEXT_PUBLIC_WEBSITE_NAME || "Error"}
      </h1>
    </div>
  );
}
