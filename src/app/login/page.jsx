"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
import Image from "next/image";
import logo from "../assets/logo.png";
import Footer from "../components/Footer/page";
import Swal from "sweetalert2";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  useEffect(() => {
    if (session && status === "authenticated") {
      const role = session?.user?.role;
      if (role === "teacher") {
        Swal.fire({
          width: "75%",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        router.replace("/teacher");
      } else if (role === "student") {
        router.replace("/dashboard");
        Swal.fire({
          width: "75%",
          didOpen: () => {
            Swal.showLoading();
          },
        });
      } else {
        router.replace("/login");
      }
    }
  }, [status, session, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    } else if (formData.username.length < 4) {
      newErrors.username = "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 4 ตัวอักษร";
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 13) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 13 ตัวอักษร";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrors({});
    const username = formData.username;
    const password = formData.password;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
      if (res.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        if (session?.user?.role === "teacher") {
          Swal.fire({
            title: "เข้าสู่ระบบสำเร็จ",
            icon: "success",
            timer: 5000,
            width: "90%",
            maxWidth: "350px",
          });
          router.push("/teacher");
        } else if (session?.user?.role === "student") {
          Swal.fire({
            title: "เข้าสู่ระบบสำเร็จ",
            icon: "success",
            timer: 5000,
            width: "90%",
            maxWidth: "350px",
          });
          router.push("/dashboard");
        } else {
          Swal.fire({
            title: "เข้าสู่ระบบไม่สำเร็จ",
            text: "สถานะไม่ถูกต้อง",
            icon: "error",
            timer: 5000,
            width: "80%",
            maxWidth: "350px",
          });
          router.push("/");
        }
      } else {
        Swal.fire({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: "กรุณาตรวจสอบชื่อผู้ใช้\nและรหัสผ่าน.",
          icon: "error",
          timer: 5000,
          width: "80%",
          maxWidth: "350px",
        });
      }
    } catch (error) {
      setErrors({ submit: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-10 md:p-18">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center scale-80 sm:scale-100">
            <div className="h-12 w-12 bg-white rounded-full flex justify-center items-center mr-1 shadow">
              <Image src={logo} width={35} height={35} alt="logo" />
            </div>
            <div className="h-12 w-12 bg-[#2EF8FF] rounded-full flex justify-center items-center shadow">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </div>

          <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-1">
            PKW SERVICE SYSTEM
          </h2>
          <hr className="max-w-40 md:max-w-80 text-[#2EF8FF] m-auto" />
          <p className="text-[12px] md:text-sm text-gray-600">
            กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white  sm:py-8 py-4 sm:px-6 px-3 shadow-lg rounded-lg">
          <div className="space-y-4 sm:space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-3.5 sm:h-5 w-3.5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-1.5 sm:pr-3 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3.5 sm:h-5 w-3.5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-1.5 sm:pr-3 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="กรอกรหัสผ่านของคุณ"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2EF8FF] focus:ring-[#2EF8FF] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-[10px] sm:text-sm text-gray-700"
                >
                  จดจำการเข้าสู่ระบบ
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[10px] sm:text-sm text-[#00CAD1] hover:text-[#00CAD1] transition-colors"
                >
                  ลืมรหัสผ่าน?
                </a>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="text-center">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#00CAD1] hover:bg-[#009EA3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            กลับเข้าสู่{" "}
            <a href="/" className="text-[#00CAD1]">
              หน้าแรก ?
            </a>
          </p>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
