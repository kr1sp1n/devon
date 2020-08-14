# devon
deno as cross-plattform OS

The idea is to have most of the busybox commands in some kind of shell inside deno runtime.
I try to use only runtime API and standard library. No third party modules.

## run

```bash
git clone git@github.com:kr1sp1n/devon.git
cd devon
deno run -A --unstable --quiet src/index.js
```

## current commands

* add -> `add ls http://localhost:5000/src/commands/ls.js`: load command with own alias from URL
* cat
* curl -> `curl https://example.com`
* exit
* gemini -> `gemini gemini.circumlunar.space`
* ls
* mkdir
* pwd
* touch