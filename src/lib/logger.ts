"use server";
import fs from "fs";
import path from "path";

type LogLevel = "info" | "error" | "warn" | "debug" | "critical" | "log";

interface LogPayload {
  level: LogLevel;
  message: string;
  userId?: string;
  route?: string;
  ip?: string;
  meta?: unknown;
}

export async function log(payload: LogPayload) {
  const entry = {
    ...payload,
    timestamp: new Date().toISOString(),
  };
  // 1) console (dev)
  if (process.env.NODE_ENV !== "production") {
    console[payload.level === "info" ? "log" : "error"](entry);
  }

  // 2) save files

  await savelog(entry);
}

async function savelog(entry: LogPayload & { timestamp: string }) {
  const pathFile = path.join(process.cwd(), "log/system.log");
  if (!fs.existsSync(pathFile)) {
    fs.mkdirSync(pathFile, { recursive: true });
  }
  fs.appendFileSync(pathFile, JSON.stringify(entry) + "\n");
}
