export default async  function() {
  // save output here:
  const buffer = new Deno.Buffer();
  // read filenames from function arguments:
  for (const filename of arguments) {
    const file = await Deno.open(filename);
    await Deno.copy(file, buffer);
    file.close();
  }
  return new TextDecoder().decode(await Deno.readAll(buffer))
}