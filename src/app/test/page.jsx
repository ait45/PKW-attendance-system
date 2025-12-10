"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

export default function QRScannerWithBeep() {
  const scannerRef = useRef(null);
  const audioContextRef = useRef(null);

  // วิธีที่ 1: สร้างเสียง beep แบบเครื่องสแกนบาร์โค้ด
  const playBeepSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      // Resume AudioContext ถ้าถูก suspend
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // เสียงแบบเครื่องสแกนบาร์โค้ด: ความถี่สูง, สั้น, แหลม
      oscillator.frequency.setValueAtTime(2800, audioContext.currentTime); // 2800Hz แหลมกว่า
      oscillator.type = "square"; // เสียงแหลมคมชัด

      // Envelope: เริ่มเบา -> ดัง -> เบา (เหมือนเครื่องจริง)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.4,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.08);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08); // สั้นๆ 0.08 วินาที
    } catch (error) {
      console.error("Error playing beep sound:", error);
      // Fallback ใช้ vibration แทน (บนมือถือ)
      if ("vibrate" in navigator) {
        navigator.vibrate(100);
      }
    }
  };

  // วิธีที่ 2: ใช้ Base64 Audio Data (แบบเครื่องสแกนจริง)
  const playBarcodeBeep = () => {
    try {
      // ไฟล์เสียง beep ในรูปแบบ base64 (เสียงสั้นๆ แหลมๆ)
      const beepSound =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmseAUyQ2u/LdA==";

      const audio = new Audio("/scanner.mp3");
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } catch (error) {
      console.error("Error creating audio:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
          aspectRatio: 1.0,
        },
        false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`QR Code scanned: ${decodedText}`);

        // เล่นเสียง beep เมื่อสแกนสำเร็จ
        playBeepSound(); // หรือใช้ playBeepFromFile() แทน

        // หยุดการสแกนชั่วคราวเพื่อป้องกันการสแกนซ้ำ
        scanner.pause(true);

        // แสดงผลลัพธ์
        alert(`QR Code: ${decodedText}`);

        // เริ่มสแกนใหม่หลังจาก 2 วินาที
        setTimeout(() => {
          scanner.resume();
        }, 2000);
      };

      const onScanFailure = (error) => {
        // console.warn(`QR Code scan error: ${error}`);
      };

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      };
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1
        className="text-2xl font-Black mb-4"
        style={{ fontFamily: "var(--font-Kanit)" }}
      >
        QR Code Scanner with Beep
      </h1>
      <div id="qr-reader" style={{ width: "100%" }}></div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">การตั้งค่าเสียง:</h3>
        <button
          onClick={playBarcodeBeep}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          ทดสอบเสียง Beep
        </button>
        <p className="text-sm text-gray-600 mt-2">
          * หากไม่ได้ยินเสียง ให้ตรวจสอบว่าเบราว์เซอร์อนุญาตให้เล่นเสียงหรือไม่
        </p>
      </div>

      <button
        onClick={async () => {
          const req = await fetch("/api/test");
          const data = await req.json();
          console.log(data);
        }}
      >
        ยิง script
      </button>
    </div>
  );
}
