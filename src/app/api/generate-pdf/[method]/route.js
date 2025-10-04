import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import fs from "fs";
import path from "path";

const fontPath = path.join(
  process.cwd(),
  "public",
  "fonts",
  "Sarabun-Medium.ttf"
); // วางไฟล์ ttf ใน public/fonts
function getFileName() {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "");
  return `report_behaviorScore-${date}_${time}`;
}
export async function GET(req, { params }) {
  const token = getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token)
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "คุณไม่ได้รับอนุญาต",
        code: "UNAUTHORIZED",
      },
      { status: 401 }
    );

  const awaitmethod = await params;
  const method = awaitmethod.method;
  if (method === "qr-student") {
    try {
      await connectDB();
      const students = await Student.find();
      const doc = new PDFDocument({ size: "A4", margin: 30 });
      if (fs.existsSync(fontPath)) {
        doc.registerFont("SarabunMedium", fontPath);
        doc.font("SarabunMedium");
      } else {
        console.log("Font not found, using default");
      }
      const buffers = [];

      return new Promise(async (resolve, reject) => {
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(
            new NextResponse(pdfBuffer, {
              header: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=qr_student.pdf",
              },
            })
          );
        });
        doc.on("error", (err) => reject(err));
        const pageWidth =
          doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const colWidth = pageWidth / 3;
        const qrSize = 100;

        let x = doc.page.margins.left;
        let y = doc.page.margins.top;
        let count = 0;

        for (const student of students) {
          const qrData = await QRCode.toDataURL(student.studentId);
          const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");

          doc.image(buffer, x + (colWidth - qrSize) / 2, y, {
            width: qrSize,
            height: qrSize,
          });
          doc
            .fontSize(12)
            .text(`รหัส : ${student.studentId}`, x, y + qrSize + 5, {
              width: colWidth,
              align: "center",
            });
          doc.text(`ชื่อ : ${student.name}`, x, y + qrSize + 20, {
            width: colWidth,
            align: "center",
          });
          doc.text(`ชั้น : ${student.classes}`, x, y + qrSize + 35, {
            width: colWidth,
            align: "center",
          });

          count++;
          if (count % 3 === 0) {
            x = doc.page.margins.left;
            y += 180;
            if (y + 180 > doc.page.height - doc.page.margins.bottom) {
              doc.addPage();
              y = doc.page.margins.top;
            }
          } else {
            x += colWidth;
          }
        }
        doc.end();
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }
  }
  if (method === "report_student-behaviorScore") {
    try {
      const filename = getFileName();
      const reportDir = path.join(proces.cwd(), "pdf-historyFiles");
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      const filePath = path.join(reportDir, filename);

      const doc = new PDFDocument({ size: "A4", margin: 40 });
      doc.pipe(fs.createWriteStream(filePath));
      doc.registerFont("Sarabun-Medium", "./public/fonts/Sarabun-Medium.ttf");
      doc.font("Sarabun-medium");

      doc.fontSize(20).text("");
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }
  }
}
