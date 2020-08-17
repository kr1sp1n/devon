import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import ls from "../src/commands/ls.js";

Deno.test("ls", async () => {
  let buffOut = new Deno.Buffer();
  await ls(Deno.stdin, buffOut, Deno.stderr)("./test/fixtures/testdir");
  const expected = new TextEncoder().encode("test1.txt\ntest2.csv");
  const actual = await Deno.readAll(buffOut);
  assertEquals(actual, expected);
});
