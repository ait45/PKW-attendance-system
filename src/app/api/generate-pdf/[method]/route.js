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
  return `report_behaviorScore-${date}_${time}.pdf`;
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
                "Content-Disposition": "atteachment; filename=PKW-QrCode-Student.pdf",
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
      const reportDir = path.join(process.cwd(), "pdf-historyFiles");
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      const filePath = path.join(reportDir, filename);

      const doc = new PDFDocument({ size: "A4", margin: 40 });
      doc.pipe(fs.createWriteStream(filePath));
      doc.registerFont("SarabunMedium", fontPath);
      doc.font("SarabunMedium");
      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));

      const pdfEndPromise = new Promise((resolve) => {
        doc.on("end", () => resolve(Buffer.concat(buffers)));
      });

      doc.fontSize(20).text("รายงานคะแนนความประพฤติ", { align: "center" });
      doc.moveDown(1);

      const tableTop = 100;
      const rowHeight = 25;

      // Column positions
      const columns = [
        { header: "รหัสนักเรียน", x: 20, width: 60 },
        { header: "ชื่อ", x: 80, width: 70 },
        { header: "ชั้น", x: 150, width: 30 },
        { header: "คะแนนความประพฤติ", x: 180, width: 90 },
        { header: "วันที่เข้าร่วม", x: 270, width: 50 },
        { header: "วันที่ลา", x: 320, width: 40 },
        { header: "วันที่สาย", x: 360, width: 40 },
        { header: "วันที่ขาด", x: 400, width: 40 },
      ];

      const data_history_raw = await Student.find();
      const data_history = data_history_raw.map((value) => {
        return {
          studentId: value.studentId,
          name: value.name,
          classes: value.classes,
          behaviorScore: value.behaviorScore,
          comeDays: value.comeDays,
          leaveDays: value.leaveDays,
          lateDays: value.lateDays,
          absentDays: value.absentDays,
        };
      });
      doc.fontSize(10);
      columns.forEach((col) => {
        doc.text(col.header, col.x, tableTop, {
          width: col.width,
          align: "left",
        });
      });

      // วาดเส้นกรอบ header
      doc
        .moveTo(20, tableTop - 2)
        .lineTo(450, tableTop - 2)
        .stroke();
      doc
        .moveTo(20, tableTop + rowHeight - 2)
        .lineTo(450, tableTop + rowHeight - 2)
        .stroke();

      // วาดเส้นแบ่ง column
      columns.forEach((col) => {
        doc
          .moveTo(col.x, tableTop - 2)
          .lineTo(col.x, tableTop + rowHeight * (data_history.length + 1))
          .stroke();
      });

      // เขียน row ข้อมูล
      doc.fontSize(10);
      data_history.forEach((stu, i) => {
        const y = tableTop + rowHeight * (i + 1);
        doc.text(stu.studentId, columns[0].x, y, { width: columns[0].width });
        doc.text(stu.name, columns[1].x, y, { width: columns[1].width });
        doc.text(stu.grade, columns[2].x, y, { width: columns[2].width });
        doc.text(stu.behaviorScore.toString(), columns[3].x, y, {
          width: columns[3].width,
        });
        doc.text(stu.present, columns[4].x, y, { width: columns[4].width });
        doc.text(stu.leave, columns[5].x, y, { width: columns[5].width });
        doc.text(stu.late, columns[6].x, y, { width: columns[6].width });
        doc.text(stu.absent, columns[7].x, y, { width: columns[7].width });

        // วาดเส้น row
        doc
          .moveTo(20, y + rowHeight - 2)
          .lineTo(450, y + rowHeight - 2)
          .stroke();
      });
      doc.end();

      const pdfBuffer = await pdfEndPromise;
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Dispostion": `attachment; filename=${filename}`,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }
  }
}
