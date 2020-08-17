import { exists, path } from "./deps.js";
const parsedUrl = new URL(import.meta.url);
const { protocol, pathname, origin } = parsedUrl;
const dirname = path.dirname(pathname);

const loadedCommands = [];

// some kind of bash history:
const history = [];

async function prompt() {
  const buf = new Uint8Array(1024);
  const [lastCommand] = history.slice(-1);
  const prefix = (lastCommand === "") ? "> " : "\n> ";
  await Deno.stdout.write(new TextEncoder().encode(prefix));
  const n = await Deno.stdin.read(buf);
  const text = new TextDecoder().decode(buf.subarray(0, n)).trim();
  history.push(text);
  return text;
}

// add new command via URL
async function addCommand(commandName, url) {
  const module = await import(url);
  const { default: fn } = module;
  const commandEntry = { name: commandName, fn };
  loadedCommands.push(commandEntry);
  return commandEntry;
}

function execCommand(
  stdin = Deno.stdin,
  stdout = Deno.stdout,
  stderr = Deno.stderr,
) {
  return async (commandName, args) => {
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
        if (commandName === "") {
          return;
        }
        if (commandName === "exit") return Deno.exit();
        return console.error(`Command not found: ${commandName}`);
      }
    }
    return commandFn.call(null, stdin, stdout, stderr).apply(
      null,
      args,
    );
  };
}

function parseCommand(command) {
  let [commandName, ...args] = command.split(" ").map((s) => s.trim());
  return { commandName, args };
}

async function parsePrompt(command) {
  const pipes = command.split("|").map((s) => s.trim());
  if (pipes.length > 1) {
    const results = [];
    for (const pipeCommand of pipes) {
      let buffIn = new Deno.Buffer();
      let buffOut = new Deno.Buffer();
      if (results.length > 0) {
        const [lastResult] = results.slice(-1);
        // the last buffOut is the new buffIn for the next command:
        buffIn = lastResult;
      }
      let { commandName, args } = parseCommand(pipeCommand);
      await execCommand(buffIn, buffOut, Deno.stderr)(commandName, args);
      results.push(buffOut);
    }
    const [lastResult] = results.slice(-1);
    await Deno.stdout.write(await Deno.readAll(lastResult));
  } else {
    let { commandName, args } = parseCommand(command);
    await execCommand()(commandName, args);
  }
}

while (true) {
  await parsePrompt(await prompt());
}
