import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path, { resolve } from "path";

export async function GET() {
  try {
    const doc = new PDFDocument({ size: "A4", margin: 30 });
    const buffers = [];

    // register font
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Sarabun-Medium.ttf"
    );
    doc.registerFont("Sarabun-Medium", fontPath);
    doc.font("Sarabun-Medium");

    // ใส่ตัวอย่าง text + QR
    const qrData = await QRCode.toDataURL("66001");
    const buffer = Buffer.from(
      qrData.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
    return new Promise(async (resolve, reject) => {
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(
          new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "inline; filename=qr_student.pdf",
            },
          })
        );
      });
      doc.on("error", (err) => reject(err));
      doc.image(buffer, 50, 50, { width: 100, height: 100 });
      doc.text("รหัส: 66001", 50, 160);
      doc.text("ชื่อ: สมชาย ใจดี", 50, 180);
      doc.text("ชั้น: ม.6/1", 50, 200);
      doc.end();
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
}
