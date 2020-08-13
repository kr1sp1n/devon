# devon
deno as cross-plattform OS

The idea is to have most of the busybox commands in some kind of shell inside deno runtime.
I try to use only runtime API and standard library. No third party modules.

## run

```bash
deno run -A --unstable --quiet src/index.js
```

## current commands

* curl -> `curl https://example.com`
* exit
* gemini -> `gemini gemini.circumlunar.space`
* ls
* mkdir
* pwd
* touch

## install as executable

```bash
deno install -A --unstable -q -n devon https://raw.githubusercontent.com/kr1sp1n/devon/master/bundle.js
```