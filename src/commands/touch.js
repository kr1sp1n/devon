export default async function (path) {
  const f = await Deno.create(path);
  f.close();
}
