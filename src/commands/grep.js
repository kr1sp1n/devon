export default function (stdin, stdout, stderr) {
  return async (pattern, filename) => {
    const results = [];
    const regex = new RegExp(pattern);
    // check if data comes from stdin:
    let input = new TextDecoder().decode(await Deno.readAll(stdin));
    if (input === "") {
      const file = await Deno.open(filename);
      buffer = await Deno.readAll(file);
      Deno.close(file.rid);
      input = new TextDecoder().decode(buffer);
    }
    const lines = input.split(/\r\n|\r|\n/);
    lines.forEach((line) => {
      if (regex.test(line)) results.push(line);
    });
    stdout.write(new TextEncoder().encode(results.join("\n")));
  };
}
