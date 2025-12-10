import express from "express";
import next from "next";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import { autoCutoff } from "./scripts/checkCutoff.js";
import path from "path";
import fs from "fs";
import cookie from "cookie";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// setting ratelimit api

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = next({ dev, hostname, port, turbopack: dev });
const handle = app.getRequestHandler();

function test() {
  console.log(new Date().toLocaleDateString("th-TH"));
  console.log(
    new Date().toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

app.prepare().then(() => {
  const server = express();

  /* The code `server.set('trust proxy', 1);` is setting the trust proxy setting in the Express server.
  This setting is used to indicate to the server that it is behind a proxy and to trust the
  X-Forwarded-* headers set by the proxy. */
  server.set("trust proxy", 1);

  server.use("/api", limiter);

  server.use(async (req, res, next) => {
    const pathname = req.path;

    try {
      const cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : {};
      req.cookies = cookies;

      // อ่านสถานะระบบ
      const systemPath = path.join(process.cwd(), "config", "system.json");
      let systemStatus = { main_active: true };
      try {
        if (fs.existsSync(systemPath)) {
          systemStatus = JSON.parse(fs.readFileSync(systemPath, "utf8"));
        } else {
          console.warn("⚠️ system.json not found, defaulting to active:true");
        }
      } catch (error) {
        console.error("Error reading system.json:", error);
      }

      // หน้าที่ยกเว้นจากการ redirect
      const allowedPaths = [
        "/system-off",
        "/teacher",
        "/api",
        "/settings",
        "/login",
        "/_next",
        "/favicon.ico",
      ];
      // ✅ ข้ามถ้าเป็น asset ภายใน Next.js เช่น /_next หรือ /__nextjs_*
      const isInternalAsset =
        pathname.startsWith("/_next") ||
        pathname.startsWith("/__nextjs") ||
        pathname.includes(".woff2") ||
        pathname.includes(".js") ||
        pathname.includes(".css");

      const isAllowed = allowedPaths.some((p) => pathname.startsWith(p));

      if (!pathname.startsWith("/api/auth")) {
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: false,
        });
        // ถ้าระบบปิด + ไม่ใช่ path ที่อนุญาต + ไม่ใช่หน้าแรก
        if (
          !systemStatus.main_active &&
          !isAllowed &&
          !isInternalAsset &&
          pathname !== "/"
        ) {
          // ✅ ใช้ AND (&&) ไม่ใช่ OR (||)
          const isTeacherOrAdmin =
            token?.role === "teacher" && token?.isAdmin === true;
          const notAuthOrSystemOff =
            !pathname.startsWith("/api/auth") &&
            !pathname.startsWith("/system-off");

          if (!isTeacherOrAdmin && notAuthOrSystemOff && !res.headersSent) {
            res.setHeader("Set-Cookie", [
              "next-auth.session-token=; Max-Age=0; Path=/;",
              "__Secure-next-auth.session-token=; Max-Age=0; Path=/;",
            ]);
            console.log("Redirecting to /system-off from:", pathname);
            res.writeHead(302, { Location: "/system-off" });
            return res.end(); // ✅ หยุดการทำงานหลัง redirect
          }
        }
      }

      next(); // ไป middleware ถัดไป ถ้ายังไม่ redirect
    } catch (error) {
      console.error("Middleware error:", error);
      next(); // อย่าลืมเรียก next() ตอน error เพื่อไม่ให้ request ค้าง
    }
  });

  server.all("/api/auth/:path", (req, res) => handle(req, res));
  server.all(/.*/, (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server ready on http://${hostname}:${port}`);

    // setInterval autoCutoff
    setInterval(async () => {
      try {
        await autoCutoff();
      } catch (err) {
        console.error("Error autoCutoff:", err);
      }
    }, 600000); // ทุก 10 นาที

    // setInterval test log
    setInterval(() => {
      const now = new Date();
      console.log(now.toLocaleDateString("th-TH"));
      console.log(
        now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 60000); // ทุก 1 นาที
  });
});
