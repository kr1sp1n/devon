import { exists, path } from "./deps.js";
const parsedUrl = new URL(import.meta.url);
const { protocol, pathname, origin } = parsedUrl;
const dirname = path.dirname(pathname);

const loadedCommands = [];

async function prompt() {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode("> "));
  const command = await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, command)).trim();
}

async function writeLine(input) {
  let output
  if (typeof input === "undefined") return;
  if (typeof input === "string") output = input;
  Deno.stdout.write(new TextEncoder().encode(output + "\n"))
}

// add new command via URL
async function addCommand(commandName, url) {
  const module = await import(url);
  const { default: fn } = module;
  const commandEntry = { name: commandName, fn };
  loadedCommands.push(commandEntry);
  return commandEntry;
}

async function parsePrompt(command) {
  // console.log('PARSE', command)
  const [commandName, ...args] = command.split(" ");
  if (commandName === "add") return await addCommand(args[0], args[1]);
  let commandLoaded = loadedCommands.find((c) => c.name === commandName);
  let commandFn;
  if (commandLoaded) {
    commandFn = commandLoaded.fn;
  } else {
    let commandExists = false;
    let commandFile;
    if (protocol === "file:") {
      commandFile = `${dirname}/commands/${commandName}.js`;
      commandExists = await exists(commandFile);
    } else {
      commandFile = `${origin}${dirname}/commands/${commandName}.js`;
      const { status } = await fetch(commandFile);
      if (status === 200) commandExists = true;
    }
    if (commandExists) {
      const { fn } = await addCommand(commandName, commandFile);
      commandFn = fn;
    } else {
      if (command === "") return;
      if (command === "exit") return Deno.exit();
      return console.error(`Command not found: ${commandName}`);
    }
  }
  writeLine(await commandFn.apply(null, args));
}

while (true) {
  await parsePrompt(await prompt());
}
