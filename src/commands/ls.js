import { fs, path as p } from "../deps.js";

export default async function (path = ".") {
  // console.log(p.basename(path))
  const options = {
    maxDepth: 1,
  };
  const result = [];
  for await (const entry of fs.walk(path, options)) {
    if (
      entry.name !== ".." &&
      p.basename(path) !== entry.name
    ) {
      result.push(entry.name);
    }
    // console.log(entry);
  }
  if (result.length === 0) return;
  return result.join("\n");
}
