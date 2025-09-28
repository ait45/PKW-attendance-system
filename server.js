import { createServer } from "http";
import { parse } from "url";
import next from "next";
import 'dotenv/config';
import { autoCutoff } from "./scripts/checkCutoff.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port, turbopack: dev });
const handle = app.getRequestHandler();

function test() {
  console.log(
    new Date().toLocaleDateString('th-TH')
  );
  console.log(
    new Date().toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
async function handelAutoCutoff () {
  await autoCutoff();
}
app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> ready on http://${hostname}:${port}`);

    setInterval(handelAutoCutoff, 600000);
    setInterval(test, 60000);

  });
});
