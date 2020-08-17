import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import cat from "../src/commands/cat.js";

Deno.test("cat", async () => {
  let buffOut = new Deno.Buffer();
  await cat(Deno.stdin, buffOut, Deno.stderr)(
    "./test/fixtures/testdir/test1.txt",
  );
  const expected = new TextEncoder().encode("Hello\nWorld");
  const actual = await Deno.readAll(buffOut);
  assertEquals(actual, expected);
});

Deno.test("cat -n", async () => {
  let buffOut = new Deno.Buffer();
  await cat(Deno.stdin, buffOut, Deno.stderr)(
    "-n",
    "./test/fixtures/testdir/test1.txt",
  );
  const expected = new TextEncoder().encode("1\tHello\n2\tWorld\n");
  const actual = await Deno.readAll(buffOut);
  assertEquals(actual, expected);
});
