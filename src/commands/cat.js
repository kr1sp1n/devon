import { flags, io, bytes } from "../deps.js";
const { parse: parseArgs } = flags;
const { StringReader, BufReader } = io;
const { concat } = bytes;
const opts = {
  boolean: ["number"],
  alias: {
    "number": "n",
  },
  default: {
    "number": false,
  },
};

export default function (stdin, stdout, stderr) {
  return async (...args) => {
    let lineNumber = 1;
    const lineBreak = new TextEncoder().encode("\n");
    const parsedArgs = parseArgs(args, opts);
    const filenames = parsedArgs._;
    for (const filename of filenames) {
      const file = await Deno.open(filename);
      const reader = new BufReader(file);
      let source = file;
      if (parsedArgs.number) {
        while (true) {
          const r = await reader.readLine();
          if (r === null) {
            break;
          }
          const { line } = r;
          const newLine = concat(
            concat(new TextEncoder().encode(`${lineNumber}\t`), line),
            lineBreak,
          );
          lineNumber += 1;
          await stdout.write(newLine);
        }
      } else {
        await Deno.copy(source, stdout);
      }
      file.close();
    }
  };
}
