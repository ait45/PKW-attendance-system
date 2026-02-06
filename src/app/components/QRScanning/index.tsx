"use client";
import React, { useRef, useState, useEffect } from "react";
import { Camera, QrCode, PowerOff } from "lucide-react";
import Swal from "sweetalert2";
import { Html5Qrcode } from "html5-qrcode";


function QRScanning({ onScan, holiday }: { onScan: any; holiday: boolean }) {

  const [result, setResult] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);

  const lastScanTime = useRef<number>(0);
  const delay: number = 3000;

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nextPage = useRef(false);
  const togglePageBeforeStop = () => {
    nextPage.current = !nextPage.current;
  };
  const [loading, setLoading] = useState<boolean>(false);

  const handleScan = (data: string) => {
    const json = {
      id: data,
    };
    if (onScan) onScan(json);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
  });

  useEffect(() => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
    }
    return () => {
      if (nextPage.current) {
        Toast.fire({
          title: "กล้องจะปิดใช้งานเมื่อเปลี่ยนหน้า!",
          icon: "warning",
          timer: 2000,
        });
        stopScanning();
      }
    };
  }, []);

  // ฟังก์ชันหยุดสแกน
  const stopScanning = async () => {
    togglePageBeforeStop();
    try {
      await Toast.fire({
        title: "กล้องกำลังปิด กรุณารอสักครู่",
        timer: 2000,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      setScanning(false);

      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current
          .stop()
          .then(() => {
            Toast.close();
            html5QrCodeRef.current?.clear();
          })
          .catch(() => {
            Toast.close();
            html5QrCodeRef.current?.clear();
          });
      }
      Toast.close();
    } catch (error: Error |any) {
      Swal.fire({
        title: "ไม่สามารถปิดกล้องได้!",
        text: error,
        icon: "error",
        timer: 3000,
        showCloseButton: true,
      });
    }
    setScanning(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };
  const startScanning = async () => {
    togglePageBeforeStop();
    setLoading(true);
    if (!html5QrCodeRef.current) return;
    Toast.fire({
      title: "กล้องกำลังเปิด กรุณารอสักครู่",
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const cameras = await Html5Qrcode.getCameras();
      const config = {
        fps: 25,
        qrbox: { width: 150, height: 150 },
        aspectRetio: 1.0,
        showTorchButtonIfSupported: true,
      };

      if (cameras && cameras.length) {
        setScanning(true);
        Swal.close();
        setLoading(false);
        await html5QrCodeRef.current
          .start(
            { facingMode: "environment" },
            config,
            async (decodedText, decodedResult) => {
              const now = Date.now();
              if (now - lastScanTime.current < delay) return;

              lastScanTime.current = now;
              // วาดกรอบรอบ QR ที่เจอ
              if ((decodedResult?.result as any)?.points && canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                  const points = (decodedResult.result as any).points;
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
                  points.forEach((p: any, idx: number) => {
                    if (idx > 0) ctx.lineTo(p.x, p.y);
                  });
                  ctx.closePath();
                  ctx.stroke();
                }
              }
              const beepSound = new Audio("/scanner.mp3");
              beepSound.play();
              setResult(decodedText);
              handleScan(decodedText as any);
              setTimeout(() => {
                setResult("");
              }, 500);
            },
            (errorMessage) => {
              // parse error, ignore it.
            }
          )
          .then(() => {
            setScanning(true);
          })
          .catch((err) => {
            Swal.fire({
              title: "เริ่มสแกนไม่ได้!",
              text: err,
              timer: 3000,
              icon: "error",
              showConfirmButton: true,
            });
          });
      }
    } catch (error: Error | any) {
      Swal.fire({
        title: "เริ่มสแกนไม่ได้!",
        text: error,
        timer: 3000,
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div
      className={`bg-linear-to-br from-blue-50 to-indigo-100 rounded-md shadow-md py-8 px-4 ${
        loading && "cursor-wait pointer-events-none"
      }`}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6">
          <h1 className=" flex items-center justify-center text-2xl font-bold text-center text-gray-800 mb-2">
            <Camera className="text-blue-500 mr-2" />
            SCANNER
          </h1>
          <p className="text-center text-gray-600 text-sm">
            กรุณาวาง QRcode ภายในกรอบ
          </p>
          <div className="flex mt-4">
            <div
              id="reader"
              className="m-auto w-50 h-50 border-4 border-[#AFFDFF] shadow-lg bg-black relative"
            />
            {/* กรอบ Overlay */}
            <canvas
              ref={canvasRef}
              width={120}
              height={100}
              className="absolute top-0 left-0"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-2">
          {!scanning ? (
            <button
              onClick={startScanning}
              disabled={holiday}
              className="relative z-10 flex items-center px-4 py-2 bg-green-500 hover:bg-green-700 hover:transition-colors text-white rounded-lg shadow disabled:cursor-not-allowed disabled:bg-green-700"
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
          <p className="font-semibold text-center">ข้อมูลการสแกน</p>
          <hr className="text-gray-400 w-[80%] m-auto py-2" />
          <p className="warp-break-words text-blue-600 text-center">
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
