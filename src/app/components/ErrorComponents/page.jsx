import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Wifi,
  Database,
} from "lucide-react";

const ErrorComponent = ({
  type = "general",
  title,
  message,
  onRetry,
  onGoHome,
  onGoBack,
  showRetry = true,
  showHome = true,
  showBack = true,
}) => {
  const errorTypes = {
    network: {
      icon: Wifi,
      title: "เกิดปัญหาการเชื่อมต่อ",
      message:
        "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
      bgColor: "from-blue-50 to-cyan-100",
      iconColor: "text-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    database: {
      icon: Database,
      title: "เกิดปัญหาฐานข้อมูล",
      message: "ไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
      bgColor: "from-purple-50 to-indigo-100",
      iconColor: "text-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    permission: {
      icon: AlertTriangle,
      title: "ไม่มีสิทธิ์เข้าถึง",
      message: "คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ",
      bgColor: "from-yellow-50 to-orange-100",
      iconColor: "text-yellow-500",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    notfound: {
      icon: AlertTriangle,
      title: "ไม่พบข้อมูล",
      message: "ไม่พบข้อมูลที่คุณกำลังมองหา อาจถูกลบหรือย้ายไปแล้ว",
      bgColor: "from-gray-50 to-slate-100",
      iconColor: "text-gray-500",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
    },
    general: {
      icon: AlertTriangle,
      title: "เกิดข้อผิดพลาด",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง",
      bgColor: "from-red-50 to-pink-100",
      iconColor: "text-red-500",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
  };

  const currentError = errorTypes[type] || errorTypes.general;
  const IconComponent = currentError.icon;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentError.bgColor}`}
    >
      <div className="text-center p-8 max-w-md mx-4">
        <div className="mb-8">
          <IconComponent
            className={`w-20 h-20 ${currentError.iconColor} mx-auto mb-6`}
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {title || currentError.title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {message || currentError.message}
          </p>
        </div>

        <div className="space-y-3">
          {showRetry && (
            <button
              onClick={handleRetry}
              className={`inline-flex items-center justify-center px-6 py-3 ${currentError.buttonColor} text-white rounded-lg transition-colors w-full font-medium`}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              ลองใหม่อีกครั้ง
            </button>
          )}

          {showHome && (
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors w-full font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              กลับสู่หน้าหลัก
            </button>
          )}

          {showBack && (
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ย้อนกลับ
            </button>
          )}
        </div>

        {/* แสดงเวลาที่เกิดข้อผิดพลาด */}
        <div className="mt-8 text-sm text-gray-500">
          เกิดข้อผิดพลาดเมื่อ: {new Date().toLocaleString("th-TH")}
        </div>
      </div>
    </div>
  );
};

export default ErrorComponents;
