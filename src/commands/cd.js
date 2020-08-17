export default function (stdin, stdout, stderr) {
  return (path) => {
    try {
      Deno.chdir(path);
    } catch (err) {
      stderr.write(new TextEncoder().encode(err.message));
    }
  };
}
