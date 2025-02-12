"use client";
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";
import { BsGithub, BsDiscord, BsGoogle } from "react-icons/bs";

const socialSignIns = [
  {
    icon: BsDiscord,
    label: "Continue with Discord",
    action: () =>
      redirect("/api/v1/auth/redirect?service=discord", RedirectType.push),
  },
  {
    icon: BsGithub,
    label: "Continue with GitHub",
    action: () =>
      redirect("/api/v1/auth/redirect?service=github", RedirectType.push),
  },
  {
    icon: BsGoogle,
    label: "Continue with Google",
    action: () =>
      redirect("/api/v1/auth/redirect?service=google", RedirectType.push),
  },
];

export default function Page() {
  const [isSignIn, setIsSignIn] = useState(true);
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error state
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Banner state to display success or error messages
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Validation functions
  const validateUsername = (name: string) => {
    // Must be 3-20 characters; letters, numbers, and underscores only.
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(name);
  };

  const validatePassword = (pass: string) => {
    // At least 8 characters, one uppercase, one lowercase, one digit, and one special character.
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/;
    return passwordRegex.test(pass);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let valid = true;

    // Final validation check before submission.
    if (!validateUsername(username)) {
      setUsernameError(
        "Username must be 3-20 characters and can only contain letters, numbers, and underscores."
      );
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character."
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!isSignIn && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) return;

    // Build query parameters for the API call.
    const params = new URLSearchParams({
      username,
      password,
    });

    if (!isSignIn) {
      params.append("service", "native-n");
    } else {
      params.append("service", "native-r");
    }

    console.log("Submitting with params:", params.toString());
    try {
      const response = await fetch(`/api/v1/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({
          service: params.get("service"),
          u: params.get("username"),
          p: params.get("password"),
        }),
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setBanner({ message: "Authentication successful!", type: "success" });
        setTimeout(() => redirect("/"), 1500)
      } else if (result.error) {
        setBanner({ message: result.error, type: "error" });
      } else {
        setBanner({
          message: "Unexpected response from server.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setBanner({
        message: "Error submitting form. Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15">
        {/* Banner */}
        {banner && (
          <div
            className={`p-4 mb-4 text-center rounded-md ${
              banner.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {banner.message}
          </div>
        )}

        {/* Sliding Tabs */}
        <div className="relative mb-8">
          <div className="flex">
            <button
              type="button"
              className={`flex-1 text-center py-4 text-lg font-semibold ${
                isSignIn ? "text-blue-400" : "text-gray-400"
              } transition-colors duration-300`}
              onClick={() => {
                setIsSignIn(true);
                // Reset errors and banner when switching tabs
                setUsernameError("");
                setPasswordError("");
                setConfirmPasswordError("");
                setBanner(null);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 text-center py-4 text-lg font-semibold ${
                !isSignIn ? "text-blue-400" : "text-gray-400"
              } transition-colors duration-300`}
              onClick={() => {
                setIsSignIn(false);
                setUsernameError("");
                setPasswordError("");
                setConfirmPasswordError("");
                setBanner(null);
              }}
            >
              Sign Up
            </button>
          </div>
          <div
            className={`absolute bottom-0 h-1 bg-blue-400 transition-all duration-300 ease-in-out w-1/2 ${
              isSignIn ? "left-0" : "left-1/2"
            }`}
          ></div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Johndoe1"
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value);
                // Validate on change (real-time preview)
                if (value === "" || !validateUsername(value)) {
                  setUsernameError(
                    "Username must be 3-20 characters and can only contain letters, numbers, and underscores."
                  );
                } else {
                  setUsernameError("");
                }
              }}
              className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 transition-colors duration-300"
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                if (value === "" || !validatePassword(value)) {
                  setPasswordError(
                    "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character."
                  );
                } else {
                  setPasswordError("");
                }
                // For sign-up mode, validate confirm password in real time
                if (!isSignIn && confirmPassword && value !== confirmPassword) {
                  setConfirmPasswordError("Passwords do not match.");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 transition-colors duration-300"
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password (Sign Up Only) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSignIn ? "max-h-0 opacity-0" : "max-h-[100px] opacity-100"
            }`}
          >
            {!isSignIn && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    if (password !== value) {
                      setConfirmPasswordError("Passwords do not match.");
                    } else {
                      setConfirmPasswordError("");
                    }
                  }}
                  className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 transition-colors duration-300"
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-1">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-500 transition-colors duration-300"></div>
          <span className="mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-500 transition-colors duration-300"></div>
        </div>

        {/* Social Auth Buttons */}
        <div className="flex flex-col gap-4">
          {socialSignIns.map(({ icon: Icon, label, action }, index) => (
            <button
              key={index}
              type="button"
              className="w-full flex items-center justify-center py-3 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 transform hover:scale-105"
              onClick={action}
            >
              <Icon className="w-6 h-6 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
