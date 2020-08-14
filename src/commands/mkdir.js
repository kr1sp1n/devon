export default function (path) {
  return Deno.mkdir(path, { recursive: true });
}
