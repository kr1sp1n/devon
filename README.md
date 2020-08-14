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

## install as executable

```bash
deno install -A --unstable -n devon -f -q https://raw.githubusercontent.com/kr1sp1n/devon/master/src/index.js
```

## current commands

* `add` - load command with own alias from URL -> `add ls http://localhost:5000/src/commands/ls.js`
* `cat`
* `curl` - simple http client -> `curl https://example.com`
* `exit`
* `gemini` - a simple gemini client -> `gemini gemini.circumlunar.space`
* `ls`
* `mkdir` - the default is with `-p`
* `pwd`
* `touch`