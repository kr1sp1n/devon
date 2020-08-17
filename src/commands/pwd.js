export default function (stdin, stdout, stderr) {
  return () => stdout.write(new TextEncoder().encode(Deno.cwd()));
}
