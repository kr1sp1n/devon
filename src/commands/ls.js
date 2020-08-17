import { fs, path as p } from "../deps.js";

export default function (stdin, stdout, stderr) {
  return async (path = ".") => {
    const options = {
      maxDepth: 1,
    };
    const result = [];
    if (path.startsWith("~")) path = path.replace("~", Deno.env.get("HOME"));
    for await (const entry of fs.walk(path, options)) {
      if (
        entry.name !== ".." &&
        p.basename(path) !== entry.name
      ) {
        result.push(entry.name);
      }
      // console.log(entry);
    }
    stdout.write(new TextEncoder().encode(result.sort().join("\n")));
  };
}
