export const runtime = "nodejs";

// นำเข้าโมดูลที่จำเป็น -------------------
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import { Buffer } from "node:buffer";
import fs from "fs";
import path from "path";

function registerFonts(doc) {
  const fonts = {
    THSarabunNew: {
      normal: path.join(process.cwd(), "public", "fonts", "THSarabunNew.ttf"),
      bold: path.join(
        process.cwd(),
        "public",
        "fonts",
        "THSarabunNew Bold.ttf"
      ),
      italic: path.join(
        process.cwd(),
        "public",
        "fonts",
        "THSarabunNew Italic.ttf"
      ),
      ExtraBold: path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansThai ExtraBold.ttf"
      ),
    },
  };

  const registered = [];
  // ตรวจฟอนต์ก่อน register

  for (const [family, styles] of Object.entries(fonts)) {
    for (const [style, file] of Object.entries(styles)) {
      if (fs.existsSync(file)) {
        const fontName = `${family} ${style}`;
        doc.registerFont(fontName, file);
        registered.push(fontName);
      } else {
        console.warn(`Font Not Found : ${file}`);
      }
    }
    console.log("Registered fonts:", registered.join(", "));
    return fonts; // คืน object ไปใช้ภายหลังได้ด้วย
  }
}

function getFileName(base) {
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  return `${base}-${date}.pdf`;
}

const getThaiDate = () => {
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
};

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

  // วาดลายน้ำด้านหลังเอกสาร

  const WaterMarkPage = (doc, text = "PKW SERVICE SYSTEM") => {
    const { width, height } = doc.page;
    doc
      .save()
      .rotate(-45, { origin: [width / 2, height / 2] })
      .font("THSarabunNew")
      .fontSize(60)
      .fillColor("rgba(150, 150, 150, 0.2")
      .text(text, width / 4, height / 2, {
        align: "center",
        opacity: 0.1,
      })
      .restore();
  };

  // -------- HeaderPage ---------- //
  const HeaderPage = (doc) => {
    const startX = doc.page.margins.left;
    const startY = doc.page.margins.top;

    doc.image("./src/app/assets/logo.png", {
      width: 80,
    });
    // คำนวณตำแหน่งข้อความ (ขวาของโลโก้)
    const textX = startX + 80 + 10; // เว้นห่างจากโลโก้เล็กน้อย
    const textY = startY + 10; // ขยับลงมาหน่อยให้ดูบาลานซ์

    doc
      .font("THSarabunNew ExtraBold")
      .fontSize(24)
      .fillColor("#000")
      .text("PRAKEAWASAWITTAYA", textX, textY);

    doc
      .moveTo(textX, textY + 30)
      .lineTo(textX + 250, textY + 30)
      .lineWidth(1.5)
      .strokeColor("#000")
      .stroke();
    doc
      .font("THSarabunNew bold")
      .fontSize(18)
      .text("PKW SERVICE SYSTEM", textX, textY + 32);

    // Page number + date
    doc.fontSize(12).opacity(1);
    doc.text(
      `ออกเมื่อวันที่: ${getThaiDate()}`,
      { align: "right" },
      doc.page.margins.left,
      doc.page.height - 40
    );
  };

  const FooterPage = (doc, currentPage, pageNumber) => {
    doc
      .font("THSarabunNew normal")
      .fontSize(12)
      .fillColor("#888")
      .text(
        `หน้า ${currentPage} จาก ${pageNumber}`,
        doc.page.margins.right,
        790,
        {
          align: "right",
        }
      );
  };
  if (method === "qr-student") {
    try {
      await connectDB();
      const fileName = getFileName("PKW-QrCode-Student");
      const students = await Student.find();

      // สร่้าง table content แบบ QR
      const doc = new PDFDocument({
        size: "A4",
        margin: 30,
        info: {
          Title: "QrCode สำหรับการเช็คชื่อ",
          Author: "PKW SERVICE SYSTEM",
        },
      });

      // เช็ค fonts ในระบบ
      registerFonts(doc);

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      const pdfPromise = new Promise(async (resolve, reject) => {
        // ตั้งค่า layout
        const pageWidth =
          doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const colWidth = pageWidth / 3;
        const qrSize = 100;

        // กำหนดพิกัด x y
        let x = doc.page.margins.left;
        let y = doc.page.margins.top;

        // แยกข้อมูลตามชั้นเรียน
        const classes = [...new Set(students.map((s) => s.classes))];
        let isFirstClass = true;
        for (const cls of classes) {
          const classStudent = students.filter((s) => s.classes === cls);
          // ถ้าไม่ใช่ชั้นแรก ให้ขึ้นหน้าใหม่
          if (!isFirstClass) {
            doc.addPage();
          }
          isFirstClass = false;
          HeaderPage(doc);

          x = doc.page.margins.left;
          y = doc.y + 80;
          let count = 0;

          doc
            .fontSize(16)
            .fillColor("#000")
            .text(`ชั้น: ${cls}`, x + 30, y);
          y += 25;

          // วาด QRcode
          for (const student of classStudent) {
            const qrData = await QRCode.toDataURL(student.studentId);
            const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            // QRcode
            doc.image(buffer, x + (colWidth - qrSize) / 2, y, {
              width: qrSize,
              height: qrSize,
            });
            // Watermark ใต้ QrCode
            doc.save();
            doc.fontSize(10).opacity(0.1).fillColor("gray");
            const watermarkText = "PKW SERVICE SYSTEM";
            const watermarkX =
              x + (colWidth - doc.widthOfString(watermarkText)) / 2;
            const watermarkY = y + qrSize / 2;
            doc.text(watermarkText, watermarkX, watermarkY);
            doc.restore();

            // ข้อมูลใต้ QrCode
            doc
              .font("THSarabunNew bold")
              .fontSize(16)
              .text(`รหัส: ${student.studentId}`, x, y + qrSize + 5, {
                width: colWidth,
                align: "center",
              });
            doc.text(`ชื่อ: ${student.name}`, x, y + qrSize + 20, {
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
                HeaderPage(doc);
              }
            } else {
              x += colWidth;
            }
          }
        }
        y += 200;

        doc.end();
        doc.on("end", () => {
          try {
            // นับจำนวนหน้าเอกสาร
            const totalPages = doc.bufferedPageRange().count;
            for (let n = 0; n < totalPages; n++) {
              doc.switchToPage(n);
              FooterPage(doc, n + 1, totalPages);
            }

            resolve(Buffer.concat(buffers));
          } catch (error) {
            reject(error);
          }
        });
      });

      const pdfBuffer = await pdfPromise;

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${encodeURIComponent(
            fileName
          )}`,
        },
      });
    } catch (error) {
      console.error("Pdf generate failed", error);
      return NextResponse.json(
        { success: false, message: error },
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
