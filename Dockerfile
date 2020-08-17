FROM hayd/alpine-deno:1.3.0
WORKDIR /app
COPY src ./src
COPY test ./test
RUN deno test --unstable -A -q
RUN deno install -A --unstable -n devon -f -q ./src/index.js
ENTRYPOINT [ "devon" ]