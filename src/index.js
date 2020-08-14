import { exists, path } from "./deps.js";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

async function prompt() {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode("> "));
  const command = await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, command)).trim();
}

function writeLine(text) {
  if (typeof text === "undefined") return;
  Deno.stdout.write(new TextEncoder().encode(text + "\n"));
}

async function parsePrompt(command) {
  const [commandName, ...args] = command.split(" ");
  const commandFile = `${__dirname}/commands/${commandName}.js`;
  const commandExists = await exists(commandFile);
  if (commandExists) {
    const module = await import(commandFile);
    const { default: commandFn } = module;
    writeLine(await commandFn.apply(null, args));
  } else {
    if (command === "") return;
    if (command === "exit") return Deno.exit();
    console.error(`Command not found: ${commandName}`);
  }
}

while (true) {
  await parsePrompt(await prompt());
}
