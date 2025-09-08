"use client";
import React, { useRef, useState, useEffect } from "react";
import { Camera, QrCode, BarChart3, RotateCcw, PowerOff } from "lucide-react";
import Swal from "sweetalert2";
import { Html5Qrcode } from "html5-qrcode";

function QRScanning({ onScan, label = "Scan QR" }) {
  const scannerRef = useRef(null);
  const [result, setResult] = useState("");
  const [scanning, IsScanning] = useState(false);
  const html5QrCodeRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
    }
  }, []);
  const handleScan = (data) => {
    if (onScan) onScan(data);
  };
  // ฟังก์ชันหยุดสแกน
  const stopScanning = async () => {
    if (!scanning || !html5QrCodeRef) return;
    try {
      await html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        IsScanning(false);
      });
    } catch (error) {
      Swal.fire({
        title: "ไม่สามารถปิดกล้องได้!",
        text: error,
        icon: "error",
        timer: 3000,
        showCloseButton: true,
      });
    }
    IsScanning(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  const startScanning = async () => {
    if (!html5QrCodeRef.current) return;
    try {
      const cameras = await Html5Qrcode.getCameras();
      const config = {
        fps: 25,
        qrbox: { width: 150, height: 150 },
        aspectRetio: 1.0,
        showTorchButtonIfSupported: true,
      };
      if (cameras && cameras.length) {
        IsScanning(true);
        await html5QrCodeRef.current
          .start(
            { facingMode: "environment" },
            config,
            async (decodedText, decodedResult) => {
              // วาดกรอบรอบ QR ที่เจอ
              if (decodedResult?.decodedResult?.points && canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                const points = decodedResult.decodedResult.points;
                ctx.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                points.forEach((p, idx) => {
                  if (idx > 0) ctx.lineTo(p.x, p.y);
                });
                ctx.closePath();
                ctx.stroke();
              }
              const beepSound = new Audio("/scanner.mp3");
              beepSound.play();
              setResult(decodedText);
              handleScan(decodedText);
              setTimeout(() => {
                setResult('');
              }, 500);
            }
          )
          .then(() => {
            scannerRef.current = html5QrCodeRef;
            IsScanning(true);
          })
          .catch((err) => {
            Swal.fire({
              title: "เริ่มสแกนไม่ได้!",
              text: err,
              timer: 3000,
              showConfirmButton: true,
            });
          });
      }
    } catch (error) {
      Swal.fire({
        title: "เริ่มสแกนไม่ได้!",
        text: error,
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6">
          <h1 className=" flex items-center justify-center text-2xl font-bold text-center text-gray-800 mb-2">
            <Camera className="text-blue-500 mr-2"/>
            ตัวสแกน QR Code
          </h1>
          <p className="text-center text-gray-600">กรุณาวาง QRcode ภายในกรอบ</p>
          <div className="flex rounded-lg mt-4">
            <div
              id="reader"
              className="m-auto w-50 h-50 border-4 border-[#AFFDFF] rounded-2xl shadow-lg bg-black relative"
            ></div>
            {/* กรอบ Overlay */}
            <canvas
              ref={canvasRef}
              width={120}
              height={100}
              className="absolute top-0 left-0 rounded-2xl"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-2">
          {!scanning ? (
            <button
              onClick={startScanning}
              className="relative z-10 flex items-center px-4 py-2 bg-green-500 hover:bg-green-700 hover:transition-colors text-white rounded-lg shadow"
            >
              เริ่มสแกน <QrCode width={20} height={20} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="relative z-10 flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 hover:transition-colors  text-white rounded-lg shadow"
            >
              หยุดสแกน <PowerOff width={20} height={20} className="ml-2" />
            </button>
          )}
        </div>

        <div className="bg-white mt-2 p-4 m-auto">
          <p className="font-semibold text-center">สถานะการเช็คชื่อ</p>
          <hr className="text-gray-400 w-[80%] m-auto py-2" />
          <p className="break-words text-blue-600 text-center">
            {result || "ไม่มีข้อมูล"}
          </p>
        </div>
      </div>
      {/* ปรับสไตล์ video ภายใน html5-qrcode ให้พอดีกรอบ */}
      <style jsx global>{`
        #reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important; /* ครอบให้เต็มกรอบแบบไม่ยืด */
          border-radius: 1rem; /* ให้โค้งตาม container (rounded-2xl) */
        }
        /* ซ่อน control ภายใน lib ที่อาจเกินกรอบ */
        #reader__scan_region img,
        #reader__dashboard_section_csr,
        #reader__header_message {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default QRScanning;
