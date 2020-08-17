export default function (stdin, stdout, stderr) {
  return () => {
    const envs = Object.entries(Deno.env.toObject());
    const result = envs.map(([key, value]) => `${key}=${value}`);
    stdout.write(new TextEncoder().encode(result.join("\n")));
  };
}
