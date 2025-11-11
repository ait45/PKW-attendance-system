import PDFDocument, { currentLineHeight, font } from "pdfkit";
import QRCode from "qrcode";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Buffer } from "node:buffer";
import fs from "fs";
import path from "path";

const fonts = {
  THSarabunNew: {
    normal: path.join(process.cwd(), "public", "fonts", "THSarabunNew.ttf"),
    bold: path.join(process.cwd(), "public", "fonts", "THSarabunNew Bold.ttf"),
  },
};

function getFileName(base) {
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  return `${base}-${date}.pdf`;
}

function getThaiDate() {
  const now = new Date();
  const year = now.getFullYear() + 543;
  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  return `${now.getDate()} ${monthNames[now.getMonth()]} ${year}`;
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

  const { method } = await params;
  if (method === "qr-student") {
    try {
      await connectDB();
      const fileName = getFileName("PKW-QrCode-Student");
      const students = await Student.find();
      const doc = new PDFDocument({ size: "A4", margin: 30 });
      if (fs.existsSync(fonts.THSarabunNew.normal)) {
        doc.registerFont("THSarabunNew", fonts.THSarabunNew.normal);
        doc.font("THSarabunNew");
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
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${encodeURIComponent(
                  fileName
                )}"`,
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
  if (method === "report_student-behaviorScore-all") {
    try {
      const filename = getFileName("behaviorScore-all");
      const data_student = await Student.find();
      pdfMake.vfs = pdfFonts.vfs;

      pdfMake.fonts = {
        THSarabunNew: {
          normal: "THSarabunNew.ttf",
          bold: "THSarabunNew Bold.ttf",
          italics: "THSarabunNew Italic.ttf",
          bolditalics: "THSarabunNew BoldItalic.ttf",
        },
      };
      // == Helper Function == //

      const logoPath = path.join(process.cwd(), "src", "app", "favicon.ico");
      const logoBase64 = fs.existsSync(logoPath)
        ? `data:image/png;base64,${fs
            .readFileSync(logoPath)
            .toString("base64")}`
        : null;

      const docDefinition = {
        pageSize: "A4",
        PageOrientation: "portrait",
        PageMargins: [40, 100, 40, 60],
        background: {
          text: "PKW SERVICE TH OFFICIAL",
          color: "gray",
          opacity: 0.15,
          fontSize: 60,
          bold: true,
          alignment: "center",
          margin: [0, 300],
        },

        header: function () {
          return {
            margin: [20, 15, 20, 10],
            stack: [
              {
                columns: [
                  logoBase64
                    ? {
                        image: logoBase64,
                        width: 50,
                        height: 50,
                        margin: [0, 0, 5, 0],
                      }
                    : { text: "" },
                  {
                    stack: [
                      {
                        text: "PKW SERVICE TH",
                        fontSize: 16,
                        bold: true,
                        lineHeight: 1.1,
                      },
                      {
                        text: "โรงเรียนพระแก้วอาสาวิทยา",
                        fontSize: 12,
                        lineHeight: 1.1,
                      },
                    ],
                    margin: [0, 5, 0, 0],
                  },

                  // วันที่พิมพ์
                  {
                    text: `วันที่พิมพ์: ${getThaiDate()}`,
                    alignment: "right",
                    fontSize: 10,
                    color: "blue",
                    margin: [0, 15, 0, 0],
                  },
                ],
              },
            ],
          };
        },

        footer: (currentPage, pageCount) => {
          return {
            margin: [20, 0, 20, 10],
            fontSize: 8,
            columns: [
              {
                text: "ผู้จัดทำรายงาน: ครูที่ปรึกษา / ระบบอัตโนมัติ PKW SERVICE",
                alignment: "left",
              },
              {
                text: `หน้า ${currentPage} จาก ${pageCount}`,
                alignment: "right",
              },
            ],
          };
        },
        content: [
          {
            margin: [0, 20],
            stack: [
              { text: "รายงานคะแนนความประพฤติ" },
              {
                table: {
                  headerRows: 1,
                  widths: [50, "*", 100, 60, 50, 40, 40, 40],
                  body: [
                    [
                      { text: "รหัส", style: "tableHeader" },
                      { text: "ชื่อ", style: "tableHeader" },
                      { text: "ชั้น", style: "tableHeader" },
                      { text: "คะแนน", style: "tableHeader" },
                      { text: "เข้าร่วม", style: "tableHeader" },
                      { text: "ลา", style: "tableHeader" },
                      { text: "สาย", style: "tableHeader" },
                      { text: "ขาด", style: "tableHeader" },
                    ],
                    ...data_student.map((index) => [
                      index.studentId,
                      index.name,
                      index.classes,
                      index.behaviorScore?.toString() || "-",
                      index.joinDays || "0",
                      index.leaveDays || "0",
                      index.lateDays || "0",
                      index.absentDays || "0",
                    ]),
                  ],
                },
                layout: {
                  fillColor: (rowIndex) => (rowIndex === 0 ? "#444" : null),
                  hLineColor: () => "#bbb",
                  vLineColor: () => "#bbb",
                },
              },
            ],
          },
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: "white",
            alignment: "center",
          },
        },
        defaultStyle: {
          font: "THSarabunNew",
          fontSize: 10,
        },
      };

      // สร้าง pdf

      return await new Promise((resolve) => {
        pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
          const Disposition = `inline; filename="${encodeURIComponent(
            filename
          )}`;

          resolve(
            new NextResponse(Buffer.from(buffer), {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": Disposition,
              },
            })
          );
        });
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
