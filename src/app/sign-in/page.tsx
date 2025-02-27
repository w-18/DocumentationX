"use client";
import { redirect, RedirectType } from "next/navigation";
import { useRef, useState } from "react";
import { BsGithub, BsDiscord, BsGoogle } from "react-icons/bs";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const captchaRef = useRef<TurnstileInstance | null>(null);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validateUsername = (name: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(name);
  };

  const validatePassword = (pass: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/;
    return passwordRegex.test(pass);
  };

  const submitWithCaptcha = async (token: string) => {
    const params = new URLSearchParams({
      username,
      password,
    });

    if (!isSignIn) {
      params.append("service", "native-n");
    } else {
      params.append("service", "native-r");
    }

    try {
      const response = await fetch(`/api/v1/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          s: params.get("service"),
          u: params.get("username"),
          p: params.get("password"),
          c: token,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setBanner({ message: "Authentication successful!", type: "success" });
        setTimeout(() => redirect("/"), 1500);
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

  const handleCaptchaSuccess = async (token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowCaptchaModal(false)
    await new Promise((resolve) => setTimeout(resolve, 350));
    await submitWithCaptcha(token);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let valid = true;

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

    setShowCaptchaModal(true);
  };

  const areFieldsFilled = isSignIn
    ? username.trim() !== "" && password.trim() !== ""
    : username.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 relative">
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
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
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
                setUsernameError(
                  value === "" || !validateUsername(value)
                    ? "Username must be 3-20 characters and can only contain letters, numbers, and underscores."
                    : ""
                );
              }}
              className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 transition-colors duration-300"
            />
            {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
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
                setPasswordError(
                  value === "" || !validatePassword(value)
                    ? "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character."
                    : ""
                );
                if (!isSignIn && confirmPassword && value !== confirmPassword) {
                  setConfirmPasswordError("Passwords do not match.");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 transition-colors duration-300"
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {!isSignIn && (
            <div className="transition-all duration-300">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
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
                  setConfirmPasswordError(password !== value ? "Passwords do not match." : "");
                }}
                className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 transition-colors duration-300"
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!areFieldsFilled}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              !areFieldsFilled ? "opacity-50 cursor-not-allowed" : ""
            }`}
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

      {/* Captcha Modal */}
      {showCaptchaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="w-full max-w-md p-8 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 relative">
            <button
              onClick={() => setShowCaptchaModal(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          <div className="flex justify-center">
          <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              options={{ size: "normal", theme: "dark" }}
              onSuccess={(a) => {handleCaptchaSuccess(a)}}
              ref={captchaRef}
            /> </div>
          </div>
        </div>
      )}
    </div>
  );
}
