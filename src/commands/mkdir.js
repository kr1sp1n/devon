export default function (stdin, stdout, stderr) {
  return (path) => {
    Deno.mkdir(path, { recursive: true });
  };
}
