import { BufReader } from "../deps.js";

export default function (stdin, stdout, stderr) {
  return async (url) => {
    if (!url.startsWith("gemini://")) {
      url = `gemini://${url}`;
    }
    // replace gemini protocol to be able to parse URL:
    url = url.replace("gemini://", "https://");

    let parsedUrl;
    try {
      // try to parse URL:
      parsedUrl = new URL(url);
    } catch (e) {
      console.error(e);
      return;
    }

    if (!parsedUrl.pathname.startsWith("/")) {
      parsedUrl.pathname = "/";
    }

    try {
      const conn = await Deno.connectTls(
        { hostname: parsedUrl.hostname, port: 1965 },
      );
      const geminiUrl = `gemini://${parsedUrl.hostname}${parsedUrl.pathname}`;
      const reader = new BufReader(conn);
      await conn.write(
        new TextEncoder().encode(`${geminiUrl}\r\n`),
      );
      const header = await reader.readString("\n");
      const [status, ...rest] = (header || "4 ").split(/\s/);
      const meta = rest.join(" ");
      const statusCode = Number(status.substr(0, 1));
      let body;
      if (statusCode === 2) {
        const bodyBytes = await Deno.readAll(reader);
        body = new TextDecoder().decode(bodyBytes);
      }
      stdout.write(new TextEncoder().encode(`${header}\n${body}`));
    } catch (err) {
      stderr.write(new TextEncoder().encode(err.message));
    }
  };
}
