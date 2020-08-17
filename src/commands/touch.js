export default function (stdin, stdout, stderr) {
  return async (path) => {
    const f = await Deno.create(path);
    f.close();
  };
}
