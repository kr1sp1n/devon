// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("file:///Users/krispinschulz/code/my/devon/src/commands/pwd", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function default_1() {
        return Deno.cwd();
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/bytes/mod", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function findIndex(source, pat) {
        const s = pat[0];
        for (let i = 0; i < source.length; i++) {
            if (source[i] !== s)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j++;
                if (source[j] !== pat[j - pin]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin;
            }
        }
        return -1;
    }
    exports_2("findIndex", findIndex);
    function findLastIndex(source, pat) {
        const e = pat[pat.length - 1];
        for (let i = source.length - 1; i >= 0; i--) {
            if (source[i] !== e)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j--;
                if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin - pat.length + 1;
            }
        }
        return -1;
    }
    exports_2("findLastIndex", findLastIndex);
    function equal(source, match) {
        if (source.length !== match.length)
            return false;
        for (let i = 0; i < match.length; i++) {
            if (source[i] !== match[i])
                return false;
        }
        return true;
    }
    exports_2("equal", equal);
    function hasPrefix(source, prefix) {
        for (let i = 0, max = prefix.length; i < max; i++) {
            if (source[i] !== prefix[i])
                return false;
        }
        return true;
    }
    exports_2("hasPrefix", hasPrefix);
    function hasSuffix(source, suffix) {
        for (let srci = source.length - 1, sfxi = suffix.length - 1; sfxi >= 0; srci--, sfxi--) {
            if (source[srci] !== suffix[sfxi])
                return false;
        }
        return true;
    }
    exports_2("hasSuffix", hasSuffix);
    function repeat(origin, count) {
        if (count === 0) {
            return new Uint8Array();
        }
        if (count < 0) {
            throw new Error("bytes: negative repeat count");
        }
        else if ((origin.length * count) / count !== origin.length) {
            throw new Error("bytes: repeat count causes overflow");
        }
        const int = Math.floor(count);
        if (int !== count) {
            throw new Error("bytes: repeat count must be an integer");
        }
        const nb = new Uint8Array(origin.length * count);
        let bp = copyBytes(origin, nb);
        for (; bp < nb.length; bp *= 2) {
            copyBytes(nb.slice(0, bp), nb, bp);
        }
        return nb;
    }
    exports_2("repeat", repeat);
    function concat(origin, b) {
        const output = new Uint8Array(origin.length + b.length);
        output.set(origin, 0);
        output.set(b, origin.length);
        return output;
    }
    exports_2("concat", concat);
    function contains(source, pat) {
        return findIndex(source, pat) != -1;
    }
    exports_2("contains", contains);
    function copyBytes(src, dst, off = 0) {
        off = Math.max(0, Math.min(off, dst.byteLength));
        const dstBytesAvailable = dst.byteLength - off;
        if (src.byteLength > dstBytesAvailable) {
            src = src.subarray(0, dstBytesAvailable);
        }
        dst.set(src, off);
        return src.byteLength;
    }
    exports_2("copyBytes", copyBytes);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/_util/assert", [], function (exports_3, context_3) {
    "use strict";
    var DenoStdInternalError;
    var __moduleName = context_3 && context_3.id;
    function assert(expr, msg = "") {
        if (!expr) {
            throw new DenoStdInternalError(msg);
        }
    }
    exports_3("assert", assert);
    return {
        setters: [],
        execute: function () {
            DenoStdInternalError = class DenoStdInternalError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "DenoStdInternalError";
                }
            };
            exports_3("DenoStdInternalError", DenoStdInternalError);
        }
    };
});
System.register("https://deno.land/std@0.65.0/io/bufio", ["https://deno.land/std@0.65.0/bytes/mod", "https://deno.land/std@0.65.0/_util/assert"], function (exports_4, context_4) {
    "use strict";
    var mod_ts_1, assert_ts_1, DEFAULT_BUF_SIZE, MIN_BUF_SIZE, MAX_CONSECUTIVE_EMPTY_READS, CR, LF, BufferFullError, PartialReadError, BufReader, AbstractBufBase, BufWriter, BufWriterSync;
    var __moduleName = context_4 && context_4.id;
    function createLPS(pat) {
        const lps = new Uint8Array(pat.length);
        lps[0] = 0;
        let prefixEnd = 0;
        let i = 1;
        while (i < lps.length) {
            if (pat[i] == pat[prefixEnd]) {
                prefixEnd++;
                lps[i] = prefixEnd;
                i++;
            }
            else if (prefixEnd === 0) {
                lps[i] = 0;
                i++;
            }
            else {
                prefixEnd = pat[prefixEnd - 1];
            }
        }
        return lps;
    }
    async function* readDelim(reader, delim) {
        const delimLen = delim.length;
        const delimLPS = createLPS(delim);
        let inputBuffer = new Deno.Buffer();
        const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
        let inspectIndex = 0;
        let matchIndex = 0;
        while (true) {
            const result = await reader.read(inspectArr);
            if (result === null) {
                yield inputBuffer.bytes();
                return;
            }
            if (result < 0) {
                return;
            }
            const sliceRead = inspectArr.subarray(0, result);
            await Deno.writeAll(inputBuffer, sliceRead);
            let sliceToProcess = inputBuffer.bytes();
            while (inspectIndex < sliceToProcess.length) {
                if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
                    inspectIndex++;
                    matchIndex++;
                    if (matchIndex === delimLen) {
                        const matchEnd = inspectIndex - delimLen;
                        const readyBytes = sliceToProcess.subarray(0, matchEnd);
                        const pendingBytes = sliceToProcess.slice(inspectIndex);
                        yield readyBytes;
                        sliceToProcess = pendingBytes;
                        inspectIndex = 0;
                        matchIndex = 0;
                    }
                }
                else {
                    if (matchIndex === 0) {
                        inspectIndex++;
                    }
                    else {
                        matchIndex = delimLPS[matchIndex - 1];
                    }
                }
            }
            inputBuffer = new Deno.Buffer(sliceToProcess);
        }
    }
    exports_4("readDelim", readDelim);
    async function* readStringDelim(reader, delim) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        for await (const chunk of readDelim(reader, encoder.encode(delim))) {
            yield decoder.decode(chunk);
        }
    }
    exports_4("readStringDelim", readStringDelim);
    async function* readLines(reader) {
        yield* readStringDelim(reader, "\n");
    }
    exports_4("readLines", readLines);
    return {
        setters: [
            function (mod_ts_1_1) {
                mod_ts_1 = mod_ts_1_1;
            },
            function (assert_ts_1_1) {
                assert_ts_1 = assert_ts_1_1;
            }
        ],
        execute: function () {
            DEFAULT_BUF_SIZE = 4096;
            MIN_BUF_SIZE = 16;
            MAX_CONSECUTIVE_EMPTY_READS = 100;
            CR = "\r".charCodeAt(0);
            LF = "\n".charCodeAt(0);
            BufferFullError = class BufferFullError extends Error {
                constructor(partial) {
                    super("Buffer full");
                    this.partial = partial;
                    this.name = "BufferFullError";
                }
            };
            exports_4("BufferFullError", BufferFullError);
            PartialReadError = class PartialReadError extends Deno.errors.UnexpectedEof {
                constructor() {
                    super("Encountered UnexpectedEof, data only partially read");
                    this.name = "PartialReadError";
                }
            };
            exports_4("PartialReadError", PartialReadError);
            BufReader = class BufReader {
                constructor(rd, size = DEFAULT_BUF_SIZE) {
                    this.r = 0;
                    this.w = 0;
                    this.eof = false;
                    if (size < MIN_BUF_SIZE) {
                        size = MIN_BUF_SIZE;
                    }
                    this._reset(new Uint8Array(size), rd);
                }
                static create(r, size = DEFAULT_BUF_SIZE) {
                    return r instanceof BufReader ? r : new BufReader(r, size);
                }
                size() {
                    return this.buf.byteLength;
                }
                buffered() {
                    return this.w - this.r;
                }
                async _fill() {
                    if (this.r > 0) {
                        this.buf.copyWithin(0, this.r, this.w);
                        this.w -= this.r;
                        this.r = 0;
                    }
                    if (this.w >= this.buf.byteLength) {
                        throw Error("bufio: tried to fill full buffer");
                    }
                    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
                        const rr = await this.rd.read(this.buf.subarray(this.w));
                        if (rr === null) {
                            this.eof = true;
                            return;
                        }
                        assert_ts_1.assert(rr >= 0, "negative read");
                        this.w += rr;
                        if (rr > 0) {
                            return;
                        }
                    }
                    throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
                }
                reset(r) {
                    this._reset(this.buf, r);
                }
                _reset(buf, rd) {
                    this.buf = buf;
                    this.rd = rd;
                    this.eof = false;
                }
                async read(p) {
                    let rr = p.byteLength;
                    if (p.byteLength === 0)
                        return rr;
                    if (this.r === this.w) {
                        if (p.byteLength >= this.buf.byteLength) {
                            const rr = await this.rd.read(p);
                            const nread = rr ?? 0;
                            assert_ts_1.assert(nread >= 0, "negative read");
                            return rr;
                        }
                        this.r = 0;
                        this.w = 0;
                        rr = await this.rd.read(this.buf);
                        if (rr === 0 || rr === null)
                            return rr;
                        assert_ts_1.assert(rr >= 0, "negative read");
                        this.w += rr;
                    }
                    const copied = mod_ts_1.copyBytes(this.buf.subarray(this.r, this.w), p, 0);
                    this.r += copied;
                    return copied;
                }
                async readFull(p) {
                    let bytesRead = 0;
                    while (bytesRead < p.length) {
                        try {
                            const rr = await this.read(p.subarray(bytesRead));
                            if (rr === null) {
                                if (bytesRead === 0) {
                                    return null;
                                }
                                else {
                                    throw new PartialReadError();
                                }
                            }
                            bytesRead += rr;
                        }
                        catch (err) {
                            err.partial = p.subarray(0, bytesRead);
                            throw err;
                        }
                    }
                    return p;
                }
                async readByte() {
                    while (this.r === this.w) {
                        if (this.eof)
                            return null;
                        await this._fill();
                    }
                    const c = this.buf[this.r];
                    this.r++;
                    return c;
                }
                async readString(delim) {
                    if (delim.length !== 1) {
                        throw new Error("Delimiter should be a single character");
                    }
                    const buffer = await this.readSlice(delim.charCodeAt(0));
                    if (buffer === null)
                        return null;
                    return new TextDecoder().decode(buffer);
                }
                async readLine() {
                    let line;
                    try {
                        line = await this.readSlice(LF);
                    }
                    catch (err) {
                        let { partial } = err;
                        assert_ts_1.assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
                        if (!(err instanceof BufferFullError)) {
                            throw err;
                        }
                        if (!this.eof &&
                            partial.byteLength > 0 &&
                            partial[partial.byteLength - 1] === CR) {
                            assert_ts_1.assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                            this.r--;
                            partial = partial.subarray(0, partial.byteLength - 1);
                        }
                        return { line: partial, more: !this.eof };
                    }
                    if (line === null) {
                        return null;
                    }
                    if (line.byteLength === 0) {
                        return { line, more: false };
                    }
                    if (line[line.byteLength - 1] == LF) {
                        let drop = 1;
                        if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                            drop = 2;
                        }
                        line = line.subarray(0, line.byteLength - drop);
                    }
                    return { line, more: false };
                }
                async readSlice(delim) {
                    let s = 0;
                    let slice;
                    while (true) {
                        let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
                        if (i >= 0) {
                            i += s;
                            slice = this.buf.subarray(this.r, this.r + i + 1);
                            this.r += i + 1;
                            break;
                        }
                        if (this.eof) {
                            if (this.r === this.w) {
                                return null;
                            }
                            slice = this.buf.subarray(this.r, this.w);
                            this.r = this.w;
                            break;
                        }
                        if (this.buffered() >= this.buf.byteLength) {
                            this.r = this.w;
                            const oldbuf = this.buf;
                            const newbuf = this.buf.slice(0);
                            this.buf = newbuf;
                            throw new BufferFullError(oldbuf);
                        }
                        s = this.w - this.r;
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = slice;
                            throw err;
                        }
                    }
                    return slice;
                }
                async peek(n) {
                    if (n < 0) {
                        throw Error("negative count");
                    }
                    let avail = this.w - this.r;
                    while (avail < n && avail < this.buf.byteLength && !this.eof) {
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = this.buf.subarray(this.r, this.w);
                            throw err;
                        }
                        avail = this.w - this.r;
                    }
                    if (avail === 0 && this.eof) {
                        return null;
                    }
                    else if (avail < n && this.eof) {
                        return this.buf.subarray(this.r, this.r + avail);
                    }
                    else if (avail < n) {
                        throw new BufferFullError(this.buf.subarray(this.r, this.w));
                    }
                    return this.buf.subarray(this.r, this.r + n);
                }
            };
            exports_4("BufReader", BufReader);
            AbstractBufBase = class AbstractBufBase {
                constructor() {
                    this.usedBufferBytes = 0;
                    this.err = null;
                }
                size() {
                    return this.buf.byteLength;
                }
                available() {
                    return this.buf.byteLength - this.usedBufferBytes;
                }
                buffered() {
                    return this.usedBufferBytes;
                }
            };
            BufWriter = class BufWriter extends AbstractBufBase {
                constructor(writer, size = DEFAULT_BUF_SIZE) {
                    super();
                    this.writer = writer;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                static create(writer, size = DEFAULT_BUF_SIZE) {
                    return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
                }
                reset(w) {
                    this.err = null;
                    this.usedBufferBytes = 0;
                    this.writer = w;
                }
                async flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.usedBufferBytes === 0)
                        return;
                    try {
                        await Deno.writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    this.buf = new Uint8Array(this.buf.length);
                    this.usedBufferBytes = 0;
                }
                async write(data) {
                    if (this.err !== null)
                        throw this.err;
                    if (data.length === 0)
                        return 0;
                    let totalBytesWritten = 0;
                    let numBytesWritten = 0;
                    while (data.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            try {
                                numBytesWritten = await this.writer.write(data);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                            this.usedBufferBytes += numBytesWritten;
                            await this.flush();
                        }
                        totalBytesWritten += numBytesWritten;
                        data = data.subarray(numBytesWritten);
                    }
                    numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                    this.usedBufferBytes += numBytesWritten;
                    totalBytesWritten += numBytesWritten;
                    return totalBytesWritten;
                }
            };
            exports_4("BufWriter", BufWriter);
            BufWriterSync = class BufWriterSync extends AbstractBufBase {
                constructor(writer, size = DEFAULT_BUF_SIZE) {
                    super();
                    this.writer = writer;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                static create(writer, size = DEFAULT_BUF_SIZE) {
                    return writer instanceof BufWriterSync
                        ? writer
                        : new BufWriterSync(writer, size);
                }
                reset(w) {
                    this.err = null;
                    this.usedBufferBytes = 0;
                    this.writer = w;
                }
                flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.usedBufferBytes === 0)
                        return;
                    try {
                        Deno.writeAllSync(this.writer, this.buf.subarray(0, this.usedBufferBytes));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    this.buf = new Uint8Array(this.buf.length);
                    this.usedBufferBytes = 0;
                }
                writeSync(data) {
                    if (this.err !== null)
                        throw this.err;
                    if (data.length === 0)
                        return 0;
                    let totalBytesWritten = 0;
                    let numBytesWritten = 0;
                    while (data.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            try {
                                numBytesWritten = this.writer.writeSync(data);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                            this.usedBufferBytes += numBytesWritten;
                            this.flush();
                        }
                        totalBytesWritten += numBytesWritten;
                        data = data.subarray(numBytesWritten);
                    }
                    numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                    this.usedBufferBytes += numBytesWritten;
                    totalBytesWritten += numBytesWritten;
                    return totalBytesWritten;
                }
            };
            exports_4("BufWriterSync", BufWriterSync);
        }
    };
});
System.register("https://deno.land/std@0.65.0/io/ioutil", ["https://deno.land/std@0.65.0/_util/assert"], function (exports_5, context_5) {
    "use strict";
    var assert_ts_2, DEFAULT_BUFFER_SIZE, MAX_SAFE_INTEGER;
    var __moduleName = context_5 && context_5.id;
    async function copyN(r, dest, size) {
        let bytesRead = 0;
        let buf = new Uint8Array(DEFAULT_BUFFER_SIZE);
        while (bytesRead < size) {
            if (size - bytesRead < DEFAULT_BUFFER_SIZE) {
                buf = new Uint8Array(size - bytesRead);
            }
            const result = await r.read(buf);
            const nread = result ?? 0;
            bytesRead += nread;
            if (nread > 0) {
                let n = 0;
                while (n < nread) {
                    n += await dest.write(buf.slice(n, nread));
                }
                assert_ts_2.assert(n === nread, "could not write");
            }
            if (result === null) {
                break;
            }
        }
        return bytesRead;
    }
    exports_5("copyN", copyN);
    async function readShort(buf) {
        const high = await buf.readByte();
        if (high === null)
            return null;
        const low = await buf.readByte();
        if (low === null)
            throw new Deno.errors.UnexpectedEof();
        return (high << 8) | low;
    }
    exports_5("readShort", readShort);
    async function readInt(buf) {
        const high = await readShort(buf);
        if (high === null)
            return null;
        const low = await readShort(buf);
        if (low === null)
            throw new Deno.errors.UnexpectedEof();
        return (high << 16) | low;
    }
    exports_5("readInt", readInt);
    async function readLong(buf) {
        const high = await readInt(buf);
        if (high === null)
            return null;
        const low = await readInt(buf);
        if (low === null)
            throw new Deno.errors.UnexpectedEof();
        const big = (BigInt(high) << 32n) | BigInt(low);
        if (big > MAX_SAFE_INTEGER) {
            throw new RangeError("Long value too big to be represented as a JavaScript number.");
        }
        return Number(big);
    }
    exports_5("readLong", readLong);
    function sliceLongToBytes(d, dest = new Array(8)) {
        let big = BigInt(d);
        for (let i = 0; i < 8; i++) {
            dest[7 - i] = Number(big & 0xffn);
            big >>= 8n;
        }
        return dest;
    }
    exports_5("sliceLongToBytes", sliceLongToBytes);
    return {
        setters: [
            function (assert_ts_2_1) {
                assert_ts_2 = assert_ts_2_1;
            }
        ],
        execute: function () {
            DEFAULT_BUFFER_SIZE = 32 * 1024;
            MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
        }
    };
});
System.register("https://deno.land/std@0.65.0/encoding/utf8", [], function (exports_6, context_6) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_6 && context_6.id;
    function encode(input) {
        return encoder.encode(input);
    }
    exports_6("encode", encode);
    function decode(input) {
        return decoder.decode(input);
    }
    exports_6("decode", decode);
    return {
        setters: [],
        execute: function () {
            exports_6("encoder", encoder = new TextEncoder());
            exports_6("decoder", decoder = new TextDecoder());
        }
    };
});
System.register("https://deno.land/std@0.65.0/io/readers", ["https://deno.land/std@0.65.0/encoding/utf8"], function (exports_7, context_7) {
    "use strict";
    var utf8_ts_1, StringReader, MultiReader, LimitedReader;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (utf8_ts_1_1) {
                utf8_ts_1 = utf8_ts_1_1;
            }
        ],
        execute: function () {
            StringReader = class StringReader extends Deno.Buffer {
                constructor(s) {
                    super(utf8_ts_1.encode(s).buffer);
                }
            };
            exports_7("StringReader", StringReader);
            MultiReader = class MultiReader {
                constructor(...readers) {
                    this.currentIndex = 0;
                    this.readers = readers;
                }
                async read(p) {
                    const r = this.readers[this.currentIndex];
                    if (!r)
                        return null;
                    const result = await r.read(p);
                    if (result === null) {
                        this.currentIndex++;
                        return 0;
                    }
                    return result;
                }
            };
            exports_7("MultiReader", MultiReader);
            LimitedReader = class LimitedReader {
                constructor(reader, limit) {
                    this.reader = reader;
                    this.limit = limit;
                }
                async read(p) {
                    if (this.limit <= 0) {
                        return null;
                    }
                    if (p.length > this.limit) {
                        p = p.subarray(0, this.limit);
                    }
                    const n = await this.reader.read(p);
                    if (n == null) {
                        return null;
                    }
                    this.limit -= n;
                    return n;
                }
            };
            exports_7("LimitedReader", LimitedReader);
        }
    };
});
System.register("https://deno.land/std@0.65.0/io/writers", ["https://deno.land/std@0.65.0/encoding/utf8"], function (exports_8, context_8) {
    "use strict";
    var utf8_ts_2, StringWriter;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (utf8_ts_2_1) {
                utf8_ts_2 = utf8_ts_2_1;
            }
        ],
        execute: function () {
            StringWriter = class StringWriter {
                constructor(base = "") {
                    this.base = base;
                    this.chunks = [];
                    this.byteLength = 0;
                    const c = utf8_ts_2.encode(base);
                    this.chunks.push(c);
                    this.byteLength += c.byteLength;
                }
                write(p) {
                    return Promise.resolve(this.writeSync(p));
                }
                writeSync(p) {
                    this.chunks.push(p);
                    this.byteLength += p.byteLength;
                    this.cache = undefined;
                    return p.byteLength;
                }
                toString() {
                    if (this.cache) {
                        return this.cache;
                    }
                    const buf = new Uint8Array(this.byteLength);
                    let offs = 0;
                    for (const chunk of this.chunks) {
                        buf.set(chunk, offs);
                        offs += chunk.byteLength;
                    }
                    this.cache = utf8_ts_2.decode(buf);
                    return this.cache;
                }
            };
            exports_8("StringWriter", StringWriter);
        }
    };
});
System.register("https://deno.land/std@0.65.0/io/streams", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function fromStreamWriter(streamWriter) {
        return {
            async write(p) {
                await streamWriter.ready;
                await streamWriter.write(p);
                return p.length;
            },
        };
    }
    exports_9("fromStreamWriter", fromStreamWriter);
    function fromStreamReader(streamReader) {
        const buffer = new Deno.Buffer();
        return {
            async read(p) {
                if (buffer.empty()) {
                    const res = await streamReader.read();
                    if (res.done) {
                        return null;
                    }
                    await Deno.writeAll(buffer, res.value);
                }
                return buffer.read(p);
            },
        };
    }
    exports_9("fromStreamReader", fromStreamReader);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/io/mod", ["https://deno.land/std@0.65.0/io/bufio", "https://deno.land/std@0.65.0/io/ioutil", "https://deno.land/std@0.65.0/io/readers", "https://deno.land/std@0.65.0/io/writers", "https://deno.land/std@0.65.0/io/streams"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_10(exports);
    }
    return {
        setters: [
            function (bufio_ts_1_1) {
                exportStar_1(bufio_ts_1_1);
            },
            function (ioutil_ts_1_1) {
                exportStar_1(ioutil_ts_1_1);
            },
            function (readers_ts_1_1) {
                exportStar_1(readers_ts_1_1);
            },
            function (writers_ts_1_1) {
                exportStar_1(writers_ts_1_1);
            },
            function (streams_ts_1_1) {
                exportStar_1(streams_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/exists", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    async function exists(filePath) {
        try {
            await Deno.lstat(filePath);
            return true;
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                return false;
            }
            throw err;
        }
    }
    exports_11("exists", exists);
    function existsSync(filePath) {
        try {
            Deno.lstatSync(filePath);
            return true;
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                return false;
            }
            throw err;
        }
    }
    exports_11("existsSync", existsSync);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/_constants", [], function (exports_12, context_12) {
    "use strict";
    var CHAR_UPPERCASE_A, CHAR_LOWERCASE_A, CHAR_UPPERCASE_Z, CHAR_LOWERCASE_Z, CHAR_DOT, CHAR_FORWARD_SLASH, CHAR_BACKWARD_SLASH, CHAR_VERTICAL_LINE, CHAR_COLON, CHAR_QUESTION_MARK, CHAR_UNDERSCORE, CHAR_LINE_FEED, CHAR_CARRIAGE_RETURN, CHAR_TAB, CHAR_FORM_FEED, CHAR_EXCLAMATION_MARK, CHAR_HASH, CHAR_SPACE, CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_LEFT_ANGLE_BRACKET, CHAR_RIGHT_ANGLE_BRACKET, CHAR_LEFT_CURLY_BRACKET, CHAR_RIGHT_CURLY_BRACKET, CHAR_HYPHEN_MINUS, CHAR_PLUS, CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE, CHAR_PERCENT, CHAR_SEMICOLON, CHAR_CIRCUMFLEX_ACCENT, CHAR_GRAVE_ACCENT, CHAR_AT, CHAR_AMPERSAND, CHAR_EQUAL, CHAR_0, CHAR_9, NATIVE_OS, navigator, isWindows;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            exports_12("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65);
            exports_12("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97);
            exports_12("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90);
            exports_12("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122);
            exports_12("CHAR_DOT", CHAR_DOT = 46);
            exports_12("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47);
            exports_12("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92);
            exports_12("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124);
            exports_12("CHAR_COLON", CHAR_COLON = 58);
            exports_12("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63);
            exports_12("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95);
            exports_12("CHAR_LINE_FEED", CHAR_LINE_FEED = 10);
            exports_12("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13);
            exports_12("CHAR_TAB", CHAR_TAB = 9);
            exports_12("CHAR_FORM_FEED", CHAR_FORM_FEED = 12);
            exports_12("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33);
            exports_12("CHAR_HASH", CHAR_HASH = 35);
            exports_12("CHAR_SPACE", CHAR_SPACE = 32);
            exports_12("CHAR_NO_BREAK_SPACE", CHAR_NO_BREAK_SPACE = 160);
            exports_12("CHAR_ZERO_WIDTH_NOBREAK_SPACE", CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279);
            exports_12("CHAR_LEFT_SQUARE_BRACKET", CHAR_LEFT_SQUARE_BRACKET = 91);
            exports_12("CHAR_RIGHT_SQUARE_BRACKET", CHAR_RIGHT_SQUARE_BRACKET = 93);
            exports_12("CHAR_LEFT_ANGLE_BRACKET", CHAR_LEFT_ANGLE_BRACKET = 60);
            exports_12("CHAR_RIGHT_ANGLE_BRACKET", CHAR_RIGHT_ANGLE_BRACKET = 62);
            exports_12("CHAR_LEFT_CURLY_BRACKET", CHAR_LEFT_CURLY_BRACKET = 123);
            exports_12("CHAR_RIGHT_CURLY_BRACKET", CHAR_RIGHT_CURLY_BRACKET = 125);
            exports_12("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45);
            exports_12("CHAR_PLUS", CHAR_PLUS = 43);
            exports_12("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34);
            exports_12("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39);
            exports_12("CHAR_PERCENT", CHAR_PERCENT = 37);
            exports_12("CHAR_SEMICOLON", CHAR_SEMICOLON = 59);
            exports_12("CHAR_CIRCUMFLEX_ACCENT", CHAR_CIRCUMFLEX_ACCENT = 94);
            exports_12("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96);
            exports_12("CHAR_AT", CHAR_AT = 64);
            exports_12("CHAR_AMPERSAND", CHAR_AMPERSAND = 38);
            exports_12("CHAR_EQUAL", CHAR_EQUAL = 61);
            exports_12("CHAR_0", CHAR_0 = 48);
            exports_12("CHAR_9", CHAR_9 = 57);
            NATIVE_OS = "linux";
            exports_12("NATIVE_OS", NATIVE_OS);
            navigator = globalThis.navigator;
            if (globalThis.Deno != null) {
                exports_12("NATIVE_OS", NATIVE_OS = Deno.build.os);
            }
            else if (navigator?.appVersion?.includes?.("Win") ?? false) {
                exports_12("NATIVE_OS", NATIVE_OS = "windows");
            }
            exports_12("isWindows", isWindows = NATIVE_OS == "windows");
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/_interface", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/_util", ["https://deno.land/std@0.65.0/path/_constants"], function (exports_14, context_14) {
    "use strict";
    var _constants_ts_1;
    var __moduleName = context_14 && context_14.id;
    function assertPath(path) {
        if (typeof path !== "string") {
            throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
        }
    }
    exports_14("assertPath", assertPath);
    function isPosixPathSeparator(code) {
        return code === _constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_14("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
        return isPosixPathSeparator(code) || code === _constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_14("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
        return ((code >= _constants_ts_1.CHAR_LOWERCASE_A && code <= _constants_ts_1.CHAR_LOWERCASE_Z) ||
            (code >= _constants_ts_1.CHAR_UPPERCASE_A && code <= _constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_14("isWindowsDeviceRoot", isWindowsDeviceRoot);
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        let res = "";
        let lastSegmentLength = 0;
        let lastSlash = -1;
        let dots = 0;
        let code;
        for (let i = 0, len = path.length; i <= len; ++i) {
            if (i < len)
                code = path.charCodeAt(i);
            else if (isPathSeparator(code))
                break;
            else
                code = _constants_ts_1.CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) {
                }
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 ||
                        lastSegmentLength !== 2 ||
                        res.charCodeAt(res.length - 1) !== _constants_ts_1.CHAR_DOT ||
                        res.charCodeAt(res.length - 2) !== _constants_ts_1.CHAR_DOT) {
                        if (res.length > 2) {
                            const lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            }
                            else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += `${separator}..`;
                        else
                            res = "..";
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += separator + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === _constants_ts_1.CHAR_DOT && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    exports_14("normalizeString", normalizeString);
    function _format(sep, pathObject) {
        const dir = pathObject.dir || pathObject.root;
        const base = pathObject.base ||
            (pathObject.name || "") + (pathObject.ext || "");
        if (!dir)
            return base;
        if (dir === pathObject.root)
            return dir + base;
        return dir + sep + base;
    }
    exports_14("_format", _format);
    return {
        setters: [
            function (_constants_ts_1_1) {
                _constants_ts_1 = _constants_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/win32", ["https://deno.land/std@0.65.0/path/_constants", "https://deno.land/std@0.65.0/path/_util", "https://deno.land/std@0.65.0/_util/assert"], function (exports_15, context_15) {
    "use strict";
    var _constants_ts_2, _util_ts_1, assert_ts_3, sep, delimiter;
    var __moduleName = context_15 && context_15.id;
    function resolve(...pathSegments) {
        let resolvedDevice = "";
        let resolvedTail = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1; i--) {
            let path;
            if (i >= 0) {
                path = pathSegments[i];
            }
            else if (!resolvedDevice) {
                if (globalThis.Deno == null) {
                    throw new TypeError("Resolved a drive-letter-less path without a CWD.");
                }
                path = Deno.cwd();
            }
            else {
                if (globalThis.Deno == null) {
                    throw new TypeError("Resolved a relative path without a CWD.");
                }
                path = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
                if (path === undefined ||
                    path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                    path = `${resolvedDevice}\\`;
                }
            }
            _util_ts_1.assertPath(path);
            const len = path.length;
            if (len === 0)
                continue;
            let rootEnd = 0;
            let device = "";
            let isAbsolute = false;
            const code = path.charCodeAt(0);
            if (len > 1) {
                if (_util_ts_1.isPathSeparator(code)) {
                    isAbsolute = true;
                    if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
                        let j = 2;
                        let last = j;
                        for (; j < len; ++j) {
                            if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            const firstPart = path.slice(last, j);
                            last = j;
                            for (; j < len; ++j) {
                                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j < len && j !== last) {
                                last = j;
                                for (; j < len; ++j) {
                                    if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                        break;
                                }
                                if (j === len) {
                                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                                    rootEnd = j;
                                }
                                else if (j !== last) {
                                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                    rootEnd = j;
                                }
                            }
                        }
                    }
                    else {
                        rootEnd = 1;
                    }
                }
                else if (_util_ts_1.isWindowsDeviceRoot(code)) {
                    if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
                        device = path.slice(0, 2);
                        rootEnd = 2;
                        if (len > 2) {
                            if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                                isAbsolute = true;
                                rootEnd = 3;
                            }
                        }
                    }
                }
            }
            else if (_util_ts_1.isPathSeparator(code)) {
                rootEnd = 1;
                isAbsolute = true;
            }
            if (device.length > 0 &&
                resolvedDevice.length > 0 &&
                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
                continue;
            }
            if (resolvedDevice.length === 0 && device.length > 0) {
                resolvedDevice = device;
            }
            if (!resolvedAbsolute) {
                resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
                resolvedAbsolute = isAbsolute;
            }
            if (resolvedAbsolute && resolvedDevice.length > 0)
                break;
        }
        resolvedTail = _util_ts_1.normalizeString(resolvedTail, !resolvedAbsolute, "\\", _util_ts_1.isPathSeparator);
        return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    }
    exports_15("resolve", resolve);
    function normalize(path) {
        _util_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = 0;
        let device;
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (_util_ts_1.isPathSeparator(code)) {
                isAbsolute = true;
                if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for (; j < len; ++j) {
                        if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        last = j;
                        for (; j < len; ++j) {
                            if (!_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for (; j < len; ++j) {
                                if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                return `\\\\${firstPart}\\${path.slice(last)}\\`;
                            }
                            else if (j !== last) {
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if (_util_ts_1.isWindowsDeviceRoot(code)) {
                if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if (_util_ts_1.isPathSeparator(code)) {
            return "\\";
        }
        let tail;
        if (rootEnd < len) {
            tail = _util_ts_1.normalizeString(path.slice(rootEnd), !isAbsolute, "\\", _util_ts_1.isPathSeparator);
        }
        else {
            tail = "";
        }
        if (tail.length === 0 && !isAbsolute)
            tail = ".";
        if (tail.length > 0 && _util_ts_1.isPathSeparator(path.charCodeAt(len - 1))) {
            tail += "\\";
        }
        if (device === undefined) {
            if (isAbsolute) {
                if (tail.length > 0)
                    return `\\${tail}`;
                else
                    return "\\";
            }
            else if (tail.length > 0) {
                return tail;
            }
            else {
                return "";
            }
        }
        else if (isAbsolute) {
            if (tail.length > 0)
                return `${device}\\${tail}`;
            else
                return `${device}\\`;
        }
        else if (tail.length > 0) {
            return device + tail;
        }
        else {
            return device;
        }
    }
    exports_15("normalize", normalize);
    function isAbsolute(path) {
        _util_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return false;
        const code = path.charCodeAt(0);
        if (_util_ts_1.isPathSeparator(code)) {
            return true;
        }
        else if (_util_ts_1.isWindowsDeviceRoot(code)) {
            if (len > 2 && path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(2)))
                    return true;
            }
        }
        return false;
    }
    exports_15("isAbsolute", isAbsolute);
    function join(...paths) {
        const pathsCount = paths.length;
        if (pathsCount === 0)
            return ".";
        let joined;
        let firstPart = null;
        for (let i = 0; i < pathsCount; ++i) {
            const path = paths[i];
            _util_ts_1.assertPath(path);
            if (path.length > 0) {
                if (joined === undefined)
                    joined = firstPart = path;
                else
                    joined += `\\${path}`;
            }
        }
        if (joined === undefined)
            return ".";
        let needsReplace = true;
        let slashCount = 0;
        assert_ts_3.assert(firstPart != null);
        if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
            ++slashCount;
            const firstLen = firstPart.length;
            if (firstLen > 1) {
                if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(2)))
                            ++slashCount;
                        else {
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            for (; slashCount < joined.length; ++slashCount) {
                if (!_util_ts_1.isPathSeparator(joined.charCodeAt(slashCount)))
                    break;
            }
            if (slashCount >= 2)
                joined = `\\${joined.slice(slashCount)}`;
        }
        return normalize(joined);
    }
    exports_15("join", join);
    function relative(from, to) {
        _util_ts_1.assertPath(from);
        _util_ts_1.assertPath(to);
        if (from === to)
            return "";
        const fromOrig = resolve(from);
        const toOrig = resolve(to);
        if (fromOrig === toOrig)
            return "";
        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();
        if (from === to)
            return "";
        let fromStart = 0;
        let fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        for (; fromEnd - 1 > fromStart; --fromEnd) {
            if (from.charCodeAt(fromEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        let toStart = 0;
        let toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        for (; toEnd - 1 > toStart; --toEnd) {
            if (to.charCodeAt(toEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH) {
                        return toOrig.slice(toStart + i + 1);
                    }
                    else if (i === 2) {
                        return toOrig.slice(toStart + i);
                    }
                }
                if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH) {
                        lastCommonSep = i;
                    }
                    else if (i === 2) {
                        lastCommonSep = 3;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === _constants_ts_2.CHAR_BACKWARD_SLASH)
                lastCommonSep = i;
        }
        if (i !== length && lastCommonSep === -1) {
            return toOrig;
        }
        let out = "";
        if (lastCommonSep === -1)
            lastCommonSep = 0;
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === _constants_ts_2.CHAR_BACKWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "\\..";
            }
        }
        if (out.length > 0) {
            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
        }
        else {
            toStart += lastCommonSep;
            if (toOrig.charCodeAt(toStart) === _constants_ts_2.CHAR_BACKWARD_SLASH)
                ++toStart;
            return toOrig.slice(toStart, toEnd);
        }
    }
    exports_15("relative", relative);
    function toNamespacedPath(path) {
        if (typeof path !== "string")
            return path;
        if (path.length === 0)
            return "";
        const resolvedPath = resolve(path);
        if (resolvedPath.length >= 3) {
            if (resolvedPath.charCodeAt(0) === _constants_ts_2.CHAR_BACKWARD_SLASH) {
                if (resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_BACKWARD_SLASH) {
                    const code = resolvedPath.charCodeAt(2);
                    if (code !== _constants_ts_2.CHAR_QUESTION_MARK && code !== _constants_ts_2.CHAR_DOT) {
                        return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                    }
                }
            }
            else if (_util_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
                if (resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
                    resolvedPath.charCodeAt(2) === _constants_ts_2.CHAR_BACKWARD_SLASH) {
                    return `\\\\?\\${resolvedPath}`;
                }
            }
        }
        return path;
    }
    exports_15("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
        _util_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = -1;
        let end = -1;
        let matchedSlash = true;
        let offset = 0;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (_util_ts_1.isPathSeparator(code)) {
                rootEnd = offset = 1;
                if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for (; j < len; ++j) {
                        if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for (; j < len; ++j) {
                            if (!_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for (; j < len; ++j) {
                                if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                return path;
                            }
                            if (j !== last) {
                                rootEnd = offset = j + 1;
                            }
                        }
                    }
                }
            }
            else if (_util_ts_1.isWindowsDeviceRoot(code)) {
                if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
                    rootEnd = offset = 2;
                    if (len > 2) {
                        if (_util_ts_1.isPathSeparator(path.charCodeAt(2)))
                            rootEnd = offset = 3;
                    }
                }
            }
        }
        else if (_util_ts_1.isPathSeparator(code)) {
            return path;
        }
        for (let i = len - 1; i >= offset; --i) {
            if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                matchedSlash = false;
            }
        }
        if (end === -1) {
            if (rootEnd === -1)
                return ".";
            else
                end = rootEnd;
        }
        return path.slice(0, end);
    }
    exports_15("dirname", dirname);
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        _util_ts_1.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        if (path.length >= 2) {
            const drive = path.charCodeAt(0);
            if (_util_ts_1.isWindowsDeviceRoot(drive)) {
                if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON)
                    start = 2;
            }
        }
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= start; --i) {
                const code = path.charCodeAt(i);
                if (_util_ts_1.isPathSeparator(code)) {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                end = i;
                            }
                        }
                        else {
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= start; --i) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports_15("basename", basename);
    function extname(path) {
        _util_ts_1.assertPath(path);
        let start = 0;
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let preDotState = 0;
        if (path.length >= 2 &&
            path.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
            _util_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))) {
            start = startPart = 2;
        }
        for (let i = path.length - 1; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (_util_ts_1.isPathSeparator(code)) {
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
            if (code === _constants_ts_2.CHAR_DOT) {
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            preDotState === 0 ||
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports_15("extname", extname);
    function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return _util_ts_1._format("\\", pathObject);
    }
    exports_15("format", format);
    function parse(path) {
        _util_ts_1.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        const len = path.length;
        if (len === 0)
            return ret;
        let rootEnd = 0;
        let code = path.charCodeAt(0);
        if (len > 1) {
            if (_util_ts_1.isPathSeparator(code)) {
                rootEnd = 1;
                if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for (; j < len; ++j) {
                        if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for (; j < len; ++j) {
                            if (!_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for (; j < len; ++j) {
                                if (_util_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                rootEnd = j + 1;
                            }
                        }
                    }
                }
            }
            else if (_util_ts_1.isWindowsDeviceRoot(code)) {
                if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
                    rootEnd = 2;
                    if (len > 2) {
                        if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            if (len === 3) {
                                ret.root = ret.dir = path;
                                return ret;
                            }
                            rootEnd = 3;
                        }
                    }
                    else {
                        ret.root = ret.dir = path;
                        return ret;
                    }
                }
            }
        }
        else if (_util_ts_1.isPathSeparator(code)) {
            ret.root = ret.dir = path;
            return ret;
        }
        if (rootEnd > 0)
            ret.root = path.slice(0, rootEnd);
        let startDot = -1;
        let startPart = rootEnd;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        let preDotState = 0;
        for (; i >= rootEnd; --i) {
            code = path.charCodeAt(i);
            if (_util_ts_1.isPathSeparator(code)) {
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
            if (code === _constants_ts_2.CHAR_DOT) {
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            preDotState === 0 ||
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0 && startPart !== rootEnd) {
            ret.dir = path.slice(0, startPart - 1);
        }
        else
            ret.dir = ret.root;
        return ret;
    }
    exports_15("parse", parse);
    function fromFileUrl(url) {
        url = url instanceof URL ? url : new URL(url);
        if (url.protocol != "file:") {
            throw new TypeError("Must be a file URL.");
        }
        let path = decodeURIComponent(url.pathname
            .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
            .replace(/\//g, "\\"));
        if (url.hostname != "") {
            path = `\\\\${url.hostname}${path}`;
        }
        return path;
    }
    exports_15("fromFileUrl", fromFileUrl);
    return {
        setters: [
            function (_constants_ts_2_1) {
                _constants_ts_2 = _constants_ts_2_1;
            },
            function (_util_ts_1_1) {
                _util_ts_1 = _util_ts_1_1;
            },
            function (assert_ts_3_1) {
                assert_ts_3 = assert_ts_3_1;
            }
        ],
        execute: function () {
            exports_15("sep", sep = "\\");
            exports_15("delimiter", delimiter = ";");
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/posix", ["https://deno.land/std@0.65.0/path/_constants", "https://deno.land/std@0.65.0/path/_util"], function (exports_16, context_16) {
    "use strict";
    var _constants_ts_3, _util_ts_2, sep, delimiter;
    var __moduleName = context_16 && context_16.id;
    function resolve(...pathSegments) {
        let resolvedPath = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            let path;
            if (i >= 0)
                path = pathSegments[i];
            else {
                if (globalThis.Deno == null) {
                    throw new TypeError("Resolved a relative path without a CWD.");
                }
                path = Deno.cwd();
            }
            _util_ts_2.assertPath(path);
            if (path.length === 0) {
                continue;
            }
            resolvedPath = `${path}/${resolvedPath}`;
            resolvedAbsolute = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
        }
        resolvedPath = _util_ts_2.normalizeString(resolvedPath, !resolvedAbsolute, "/", _util_ts_2.isPosixPathSeparator);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
                return `/${resolvedPath}`;
            else
                return "/";
        }
        else if (resolvedPath.length > 0)
            return resolvedPath;
        else
            return ".";
    }
    exports_16("resolve", resolve);
    function normalize(path) {
        _util_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const isAbsolute = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
        const trailingSeparator = path.charCodeAt(path.length - 1) === _constants_ts_3.CHAR_FORWARD_SLASH;
        path = _util_ts_2.normalizeString(path, !isAbsolute, "/", _util_ts_2.isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute)
            path = ".";
        if (path.length > 0 && trailingSeparator)
            path += "/";
        if (isAbsolute)
            return `/${path}`;
        return path;
    }
    exports_16("normalize", normalize);
    function isAbsolute(path) {
        _util_ts_2.assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_16("isAbsolute", isAbsolute);
    function join(...paths) {
        if (paths.length === 0)
            return ".";
        let joined;
        for (let i = 0, len = paths.length; i < len; ++i) {
            const path = paths[i];
            _util_ts_2.assertPath(path);
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `/${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalize(joined);
    }
    exports_16("join", join);
    function relative(from, to) {
        _util_ts_2.assertPath(from);
        _util_ts_2.assertPath(to);
        if (from === to)
            return "";
        from = resolve(from);
        to = resolve(to);
        if (from === to)
            return "";
        let fromStart = 1;
        const fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== _constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        let toStart = 1;
        const toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== _constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
                        return to.slice(toStart + i + 1);
                    }
                    else if (i === 0) {
                        return to.slice(toStart + i);
                    }
                }
                else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
                        lastCommonSep = i;
                    }
                    else if (i === 0) {
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === _constants_ts_3.CHAR_FORWARD_SLASH)
                lastCommonSep = i;
        }
        let out = "";
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "/..";
            }
        }
        if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === _constants_ts_3.CHAR_FORWARD_SLASH)
                ++toStart;
            return to.slice(toStart);
        }
    }
    exports_16("relative", relative);
    function toNamespacedPath(path) {
        return path;
    }
    exports_16("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
        _util_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const hasRoot = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
        let end = -1;
        let matchedSlash = true;
        for (let i = path.length - 1; i >= 1; --i) {
            if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                matchedSlash = false;
            }
        }
        if (end === -1)
            return hasRoot ? "/" : ".";
        if (hasRoot && end === 1)
            return "//";
        return path.slice(0, end);
    }
    exports_16("dirname", dirname);
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        _util_ts_2.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
                const code = path.charCodeAt(i);
                if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                end = i;
                            }
                        }
                        else {
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports_16("basename", basename);
    function extname(path) {
        _util_ts_2.assertPath(path);
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let preDotState = 0;
        for (let i = path.length - 1; i >= 0; --i) {
            const code = path.charCodeAt(i);
            if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
            if (code === _constants_ts_3.CHAR_DOT) {
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            preDotState === 0 ||
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports_16("extname", extname);
    function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return _util_ts_2._format("/", pathObject);
    }
    exports_16("format", format);
    function parse(path) {
        _util_ts_2.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path.length === 0)
            return ret;
        const isAbsolute = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
        let start;
        if (isAbsolute) {
            ret.root = "/";
            start = 1;
        }
        else {
            start = 0;
        }
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        let preDotState = 0;
        for (; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
            if (code === _constants_ts_3.CHAR_DOT) {
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            preDotState === 0 ||
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) {
                    ret.base = ret.name = path.slice(1, end);
                }
                else {
                    ret.base = ret.name = path.slice(startPart, end);
                }
            }
        }
        else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            }
            else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute)
            ret.dir = "/";
        return ret;
    }
    exports_16("parse", parse);
    function fromFileUrl(url) {
        url = url instanceof URL ? url : new URL(url);
        if (url.protocol != "file:") {
            throw new TypeError("Must be a file URL.");
        }
        return decodeURIComponent(url.pathname);
    }
    exports_16("fromFileUrl", fromFileUrl);
    return {
        setters: [
            function (_constants_ts_3_1) {
                _constants_ts_3 = _constants_ts_3_1;
            },
            function (_util_ts_2_1) {
                _util_ts_2 = _util_ts_2_1;
            }
        ],
        execute: function () {
            exports_16("sep", sep = "/");
            exports_16("delimiter", delimiter = ":");
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/separator", ["https://deno.land/std@0.65.0/path/_constants"], function (exports_17, context_17) {
    "use strict";
    var _constants_ts_4, SEP, SEP_PATTERN;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (_constants_ts_4_1) {
                _constants_ts_4 = _constants_ts_4_1;
            }
        ],
        execute: function () {
            exports_17("SEP", SEP = _constants_ts_4.isWindows ? "\\" : "/");
            exports_17("SEP_PATTERN", SEP_PATTERN = _constants_ts_4.isWindows ? /[\\/]+/ : /\/+/);
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/common", ["https://deno.land/std@0.65.0/path/separator"], function (exports_18, context_18) {
    "use strict";
    var separator_ts_1;
    var __moduleName = context_18 && context_18.id;
    function common(paths, sep = separator_ts_1.SEP) {
        const [first = "", ...remaining] = paths;
        if (first === "" || remaining.length === 0) {
            return first.substring(0, first.lastIndexOf(sep) + 1);
        }
        const parts = first.split(sep);
        let endOfPrefix = parts.length;
        for (const path of remaining) {
            const compare = path.split(sep);
            for (let i = 0; i < endOfPrefix; i++) {
                if (compare[i] !== parts[i]) {
                    endOfPrefix = i;
                }
            }
            if (endOfPrefix === 0) {
                return "";
            }
        }
        const prefix = parts.slice(0, endOfPrefix).join(sep);
        return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_18("common", common);
    return {
        setters: [
            function (separator_ts_1_1) {
                separator_ts_1 = separator_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/glob", ["https://deno.land/std@0.65.0/path/_constants", "https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/path/separator"], function (exports_19, context_19) {
    "use strict";
    var _constants_ts_5, mod_ts_2, separator_ts_2;
    var __moduleName = context_19 && context_19.id;
    function globToRegExp(glob, { extended = true, globstar: globstarOption = true, os = _constants_ts_5.NATIVE_OS } = {}) {
        const sep = os == "windows" ? `(?:\\\\|\\/)+` : `\\/+`;
        const sepMaybe = os == "windows" ? `(?:\\\\|\\/)*` : `\\/*`;
        const seps = os == "windows" ? ["\\", "/"] : ["/"];
        const sepRaw = os == "windows" ? `\\` : `/`;
        const globstar = os == "windows"
            ? `(?:[^\\\\/]*(?:\\\\|\\/|$)+)*`
            : `(?:[^/]*(?:\\/|$)+)*`;
        const wildcard = os == "windows" ? `[^\\\\/]*` : `[^/]*`;
        const extStack = [];
        let inGroup = false;
        let inRange = false;
        let regExpString = "";
        let newLength = glob.length;
        for (; newLength > 0 && seps.includes(glob[newLength - 1]); newLength--)
            ;
        glob = glob.slice(0, newLength);
        let c, n;
        for (let i = 0; i < glob.length; i++) {
            c = glob[i];
            n = glob[i + 1];
            if (seps.includes(c)) {
                regExpString += sep;
                while (seps.includes(glob[i + 1]))
                    i++;
                continue;
            }
            if (c == "[") {
                if (inRange && n == ":") {
                    i++;
                    let value = "";
                    while (glob[++i] !== ":")
                        value += glob[i];
                    if (value == "alnum")
                        regExpString += "\\w\\d";
                    else if (value == "space")
                        regExpString += "\\s";
                    else if (value == "digit")
                        regExpString += "\\d";
                    i++;
                    continue;
                }
                inRange = true;
                regExpString += c;
                continue;
            }
            if (c == "]") {
                inRange = false;
                regExpString += c;
                continue;
            }
            if (c == "!") {
                if (inRange) {
                    if (glob[i - 1] == "[") {
                        regExpString += "^";
                        continue;
                    }
                }
                else if (extended) {
                    if (n == "(") {
                        extStack.push(c);
                        regExpString += "(?!";
                        i++;
                        continue;
                    }
                    regExpString += `\\${c}`;
                    continue;
                }
                else {
                    regExpString += `\\${c}`;
                    continue;
                }
            }
            if (inRange) {
                if (c == "\\" || c == "^" && glob[i - 1] == "[")
                    regExpString += `\\${c}`;
                else
                    regExpString += c;
                continue;
            }
            if (["\\", "$", "^", ".", "="].includes(c)) {
                regExpString += `\\${c}`;
                continue;
            }
            if (c == "(") {
                if (extStack.length) {
                    regExpString += `${c}?:`;
                    continue;
                }
                regExpString += `\\${c}`;
                continue;
            }
            if (c == ")") {
                if (extStack.length) {
                    regExpString += c;
                    const type = extStack.pop();
                    if (type == "@") {
                        regExpString += "{1}";
                    }
                    else if (type == "!") {
                        regExpString += wildcard;
                    }
                    else {
                        regExpString += type;
                    }
                    continue;
                }
                regExpString += `\\${c}`;
                continue;
            }
            if (c == "|") {
                if (extStack.length) {
                    regExpString += c;
                    continue;
                }
                regExpString += `\\${c}`;
                continue;
            }
            if (c == "+") {
                if (n == "(" && extended) {
                    extStack.push(c);
                    continue;
                }
                regExpString += `\\${c}`;
                continue;
            }
            if (c == "@" && extended) {
                if (n == "(") {
                    extStack.push(c);
                    continue;
                }
            }
            if (c == "?") {
                if (extended) {
                    if (n == "(") {
                        extStack.push(c);
                    }
                    continue;
                }
                else {
                    regExpString += ".";
                    continue;
                }
            }
            if (c == "{") {
                inGroup = true;
                regExpString += "(?:";
                continue;
            }
            if (c == "}") {
                inGroup = false;
                regExpString += ")";
                continue;
            }
            if (c == ",") {
                if (inGroup) {
                    regExpString += "|";
                    continue;
                }
                regExpString += `\\${c}`;
                continue;
            }
            if (c == "*") {
                if (n == "(" && extended) {
                    extStack.push(c);
                    continue;
                }
                const prevChar = glob[i - 1];
                let starCount = 1;
                while (glob[i + 1] == "*") {
                    starCount++;
                    i++;
                }
                const nextChar = glob[i + 1];
                const isGlobstar = globstarOption && starCount > 1 &&
                    [sepRaw, "/", undefined].includes(prevChar) &&
                    [sepRaw, "/", undefined].includes(nextChar);
                if (isGlobstar) {
                    regExpString += globstar;
                    while (seps.includes(glob[i + 1]))
                        i++;
                }
                else {
                    regExpString += wildcard;
                }
                continue;
            }
            regExpString += c;
        }
        regExpString = `^${regExpString}${regExpString != "" ? sepMaybe : ""}$`;
        return new RegExp(regExpString);
    }
    exports_19("globToRegExp", globToRegExp);
    function isGlob(str) {
        const chars = { "{": "}", "(": ")", "[": "]" };
        const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
        if (str === "") {
            return false;
        }
        let match;
        while ((match = regex.exec(str))) {
            if (match[2])
                return true;
            let idx = match.index + match[0].length;
            const open = match[1];
            const close = open ? chars[open] : null;
            if (open && close) {
                const n = str.indexOf(close, idx);
                if (n !== -1) {
                    idx = n + 1;
                }
            }
            str = str.slice(idx);
        }
        return false;
    }
    exports_19("isGlob", isGlob);
    function normalizeGlob(glob, { globstar = false } = {}) {
        if (glob.match(/\0/g)) {
            throw new Error(`Glob contains invalid characters: "${glob}"`);
        }
        if (!globstar) {
            return mod_ts_2.normalize(glob);
        }
        const s = separator_ts_2.SEP_PATTERN.source;
        const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
        return mod_ts_2.normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
    }
    exports_19("normalizeGlob", normalizeGlob);
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
        if (!globstar || globs.length == 0) {
            return mod_ts_2.join(...globs);
        }
        if (globs.length === 0)
            return ".";
        let joined;
        for (const glob of globs) {
            const path = glob;
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `${separator_ts_2.SEP}${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalizeGlob(joined, { extended, globstar });
    }
    exports_19("joinGlobs", joinGlobs);
    return {
        setters: [
            function (_constants_ts_5_1) {
                _constants_ts_5 = _constants_ts_5_1;
            },
            function (mod_ts_2_1) {
                mod_ts_2 = mod_ts_2_1;
            },
            function (separator_ts_2_1) {
                separator_ts_2 = separator_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/path/mod", ["https://deno.land/std@0.65.0/path/_constants", "https://deno.land/std@0.65.0/path/win32", "https://deno.land/std@0.65.0/path/posix", "https://deno.land/std@0.65.0/path/common", "https://deno.land/std@0.65.0/path/separator", "https://deno.land/std@0.65.0/path/_interface", "https://deno.land/std@0.65.0/path/glob"], function (exports_20, context_20) {
    "use strict";
    var _constants_ts_6, _win32, _posix, path, win32, posix, basename, delimiter, dirname, extname, format, fromFileUrl, isAbsolute, join, normalize, parse, relative, resolve, sep, toNamespacedPath;
    var __moduleName = context_20 && context_20.id;
    var exportedNames_1 = {
        "win32": true,
        "posix": true,
        "basename": true,
        "delimiter": true,
        "dirname": true,
        "extname": true,
        "format": true,
        "fromFileUrl": true,
        "isAbsolute": true,
        "join": true,
        "normalize": true,
        "parse": true,
        "relative": true,
        "resolve": true,
        "sep": true,
        "toNamespacedPath": true,
        "SEP": true,
        "SEP_PATTERN": true
    };
    function exportStar_2(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_20(exports);
    }
    return {
        setters: [
            function (_constants_ts_6_1) {
                _constants_ts_6 = _constants_ts_6_1;
            },
            function (_win32_1) {
                _win32 = _win32_1;
            },
            function (_posix_1) {
                _posix = _posix_1;
            },
            function (common_ts_1_1) {
                exportStar_2(common_ts_1_1);
            },
            function (separator_ts_3_1) {
                exports_20({
                    "SEP": separator_ts_3_1["SEP"],
                    "SEP_PATTERN": separator_ts_3_1["SEP_PATTERN"]
                });
            },
            function (_interface_ts_1_1) {
                exportStar_2(_interface_ts_1_1);
            },
            function (glob_ts_1_1) {
                exportStar_2(glob_ts_1_1);
            }
        ],
        execute: function () {
            path = _constants_ts_6.isWindows ? _win32 : _posix;
            exports_20("win32", win32 = _win32);
            exports_20("posix", posix = _posix);
            exports_20("basename", basename = path.basename), exports_20("delimiter", delimiter = path.delimiter), exports_20("dirname", dirname = path.dirname), exports_20("extname", extname = path.extname), exports_20("format", format = path.format), exports_20("fromFileUrl", fromFileUrl = path.fromFileUrl), exports_20("isAbsolute", isAbsolute = path.isAbsolute), exports_20("join", join = path.join), exports_20("normalize", normalize = path.normalize), exports_20("parse", parse = path.parse), exports_20("relative", relative = path.relative), exports_20("resolve", resolve = path.resolve), exports_20("sep", sep = path.sep), exports_20("toNamespacedPath", toNamespacedPath = path.toNamespacedPath);
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/empty_dir", ["https://deno.land/std@0.65.0/path/mod"], function (exports_21, context_21) {
    "use strict";
    var mod_ts_3;
    var __moduleName = context_21 && context_21.id;
    async function emptyDir(dir) {
        try {
            const items = [];
            for await (const dirEntry of Deno.readDir(dir)) {
                items.push(dirEntry);
            }
            while (items.length) {
                const item = items.shift();
                if (item && item.name) {
                    const filepath = mod_ts_3.join(dir, item.name);
                    await Deno.remove(filepath, { recursive: true });
                }
            }
        }
        catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
                throw err;
            }
            await Deno.mkdir(dir, { recursive: true });
        }
    }
    exports_21("emptyDir", emptyDir);
    function emptyDirSync(dir) {
        try {
            const items = [...Deno.readDirSync(dir)];
            while (items.length) {
                const item = items.shift();
                if (item && item.name) {
                    const filepath = mod_ts_3.join(dir, item.name);
                    Deno.removeSync(filepath, { recursive: true });
                }
            }
        }
        catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
                throw err;
            }
            Deno.mkdirSync(dir, { recursive: true });
            return;
        }
    }
    exports_21("emptyDirSync", emptyDirSync);
    return {
        setters: [
            function (mod_ts_3_1) {
                mod_ts_3 = mod_ts_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/_util", ["https://deno.land/std@0.65.0/path/mod"], function (exports_22, context_22) {
    "use strict";
    var path;
    var __moduleName = context_22 && context_22.id;
    function isSubdir(src, dest, sep = path.sep) {
        if (src === dest) {
            return false;
        }
        const srcArray = src.split(sep);
        const destArray = dest.split(sep);
        return srcArray.every((current, i) => destArray[i] === current);
    }
    exports_22("isSubdir", isSubdir);
    function getFileInfoType(fileInfo) {
        return fileInfo.isFile
            ? "file"
            : fileInfo.isDirectory
                ? "dir"
                : fileInfo.isSymlink
                    ? "symlink"
                    : undefined;
    }
    exports_22("getFileInfoType", getFileInfoType);
    return {
        setters: [
            function (path_1) {
                path = path_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/ensure_dir", ["https://deno.land/std@0.65.0/fs/_util"], function (exports_23, context_23) {
    "use strict";
    var _util_ts_3;
    var __moduleName = context_23 && context_23.id;
    async function ensureDir(dir) {
        try {
            const fileInfo = await Deno.lstat(dir);
            if (!fileInfo.isDirectory) {
                throw new Error(`Ensure path exists, expected 'dir', got '${_util_ts_3.getFileInfoType(fileInfo)}'`);
            }
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                await Deno.mkdir(dir, { recursive: true });
                return;
            }
            throw err;
        }
    }
    exports_23("ensureDir", ensureDir);
    function ensureDirSync(dir) {
        try {
            const fileInfo = Deno.lstatSync(dir);
            if (!fileInfo.isDirectory) {
                throw new Error(`Ensure path exists, expected 'dir', got '${_util_ts_3.getFileInfoType(fileInfo)}'`);
            }
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                Deno.mkdirSync(dir, { recursive: true });
                return;
            }
            throw err;
        }
    }
    exports_23("ensureDirSync", ensureDirSync);
    return {
        setters: [
            function (_util_ts_3_1) {
                _util_ts_3 = _util_ts_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/ensure_file", ["https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/fs/ensure_dir", "https://deno.land/std@0.65.0/fs/_util"], function (exports_24, context_24) {
    "use strict";
    var path, ensure_dir_ts_1, _util_ts_4;
    var __moduleName = context_24 && context_24.id;
    async function ensureFile(filePath) {
        try {
            const stat = await Deno.lstat(filePath);
            if (!stat.isFile) {
                throw new Error(`Ensure path exists, expected 'file', got '${_util_ts_4.getFileInfoType(stat)}'`);
            }
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                await ensure_dir_ts_1.ensureDir(path.dirname(filePath));
                await Deno.writeFile(filePath, new Uint8Array());
                return;
            }
            throw err;
        }
    }
    exports_24("ensureFile", ensureFile);
    function ensureFileSync(filePath) {
        try {
            const stat = Deno.lstatSync(filePath);
            if (!stat.isFile) {
                throw new Error(`Ensure path exists, expected 'file', got '${_util_ts_4.getFileInfoType(stat)}'`);
            }
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                ensure_dir_ts_1.ensureDirSync(path.dirname(filePath));
                Deno.writeFileSync(filePath, new Uint8Array());
                return;
            }
            throw err;
        }
    }
    exports_24("ensureFileSync", ensureFileSync);
    return {
        setters: [
            function (path_2) {
                path = path_2;
            },
            function (ensure_dir_ts_1_1) {
                ensure_dir_ts_1 = ensure_dir_ts_1_1;
            },
            function (_util_ts_4_1) {
                _util_ts_4 = _util_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/ensure_link", ["https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/fs/ensure_dir", "https://deno.land/std@0.65.0/fs/exists", "https://deno.land/std@0.65.0/fs/_util"], function (exports_25, context_25) {
    "use strict";
    var path, ensure_dir_ts_2, exists_ts_1, _util_ts_5;
    var __moduleName = context_25 && context_25.id;
    async function ensureLink(src, dest) {
        if (await exists_ts_1.exists(dest)) {
            const destStatInfo = await Deno.lstat(dest);
            const destFilePathType = _util_ts_5.getFileInfoType(destStatInfo);
            if (destFilePathType !== "file") {
                throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
            }
            return;
        }
        await ensure_dir_ts_2.ensureDir(path.dirname(dest));
        await Deno.link(src, dest);
    }
    exports_25("ensureLink", ensureLink);
    function ensureLinkSync(src, dest) {
        if (exists_ts_1.existsSync(dest)) {
            const destStatInfo = Deno.lstatSync(dest);
            const destFilePathType = _util_ts_5.getFileInfoType(destStatInfo);
            if (destFilePathType !== "file") {
                throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
            }
            return;
        }
        ensure_dir_ts_2.ensureDirSync(path.dirname(dest));
        Deno.linkSync(src, dest);
    }
    exports_25("ensureLinkSync", ensureLinkSync);
    return {
        setters: [
            function (path_3) {
                path = path_3;
            },
            function (ensure_dir_ts_2_1) {
                ensure_dir_ts_2 = ensure_dir_ts_2_1;
            },
            function (exists_ts_1_1) {
                exists_ts_1 = exists_ts_1_1;
            },
            function (_util_ts_5_1) {
                _util_ts_5 = _util_ts_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/ensure_symlink", ["https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/fs/ensure_dir", "https://deno.land/std@0.65.0/fs/exists", "https://deno.land/std@0.65.0/fs/_util"], function (exports_26, context_26) {
    "use strict";
    var path, ensure_dir_ts_3, exists_ts_2, _util_ts_6;
    var __moduleName = context_26 && context_26.id;
    async function ensureSymlink(src, dest) {
        const srcStatInfo = await Deno.lstat(src);
        const srcFilePathType = _util_ts_6.getFileInfoType(srcStatInfo);
        if (await exists_ts_2.exists(dest)) {
            const destStatInfo = await Deno.lstat(dest);
            const destFilePathType = _util_ts_6.getFileInfoType(destStatInfo);
            if (destFilePathType !== "symlink") {
                throw new Error(`Ensure path exists, expected 'symlink', got '${destFilePathType}'`);
            }
            return;
        }
        await ensure_dir_ts_3.ensureDir(path.dirname(dest));
        if (Deno.build.os === "windows") {
            await Deno.symlink(src, dest, {
                type: srcFilePathType === "dir" ? "dir" : "file",
            });
        }
        else {
            await Deno.symlink(src, dest);
        }
    }
    exports_26("ensureSymlink", ensureSymlink);
    function ensureSymlinkSync(src, dest) {
        const srcStatInfo = Deno.lstatSync(src);
        const srcFilePathType = _util_ts_6.getFileInfoType(srcStatInfo);
        if (exists_ts_2.existsSync(dest)) {
            const destStatInfo = Deno.lstatSync(dest);
            const destFilePathType = _util_ts_6.getFileInfoType(destStatInfo);
            if (destFilePathType !== "symlink") {
                throw new Error(`Ensure path exists, expected 'symlink', got '${destFilePathType}'`);
            }
            return;
        }
        ensure_dir_ts_3.ensureDirSync(path.dirname(dest));
        if (Deno.build.os === "windows") {
            Deno.symlinkSync(src, dest, {
                type: srcFilePathType === "dir" ? "dir" : "file",
            });
        }
        else {
            Deno.symlinkSync(src, dest);
        }
    }
    exports_26("ensureSymlinkSync", ensureSymlinkSync);
    return {
        setters: [
            function (path_4) {
                path = path_4;
            },
            function (ensure_dir_ts_3_1) {
                ensure_dir_ts_3 = ensure_dir_ts_3_1;
            },
            function (exists_ts_2_1) {
                exists_ts_2 = exists_ts_2_1;
            },
            function (_util_ts_6_1) {
                _util_ts_6 = _util_ts_6_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/walk", ["https://deno.land/std@0.65.0/_util/assert", "https://deno.land/std@0.65.0/path/mod"], function (exports_27, context_27) {
    "use strict";
    var assert_ts_4, mod_ts_4;
    var __moduleName = context_27 && context_27.id;
    function createWalkEntrySync(path) {
        path = mod_ts_4.normalize(path);
        const name = mod_ts_4.basename(path);
        const info = Deno.statSync(path);
        return {
            path,
            name,
            isFile: info.isFile,
            isDirectory: info.isDirectory,
            isSymlink: info.isSymlink,
        };
    }
    exports_27("createWalkEntrySync", createWalkEntrySync);
    async function createWalkEntry(path) {
        path = mod_ts_4.normalize(path);
        const name = mod_ts_4.basename(path);
        const info = await Deno.stat(path);
        return {
            path,
            name,
            isFile: info.isFile,
            isDirectory: info.isDirectory,
            isSymlink: info.isSymlink,
        };
    }
    exports_27("createWalkEntry", createWalkEntry);
    function include(path, exts, match, skip) {
        if (exts && !exts.some((ext) => path.endsWith(ext))) {
            return false;
        }
        if (match && !match.some((pattern) => !!path.match(pattern))) {
            return false;
        }
        if (skip && skip.some((pattern) => !!path.match(pattern))) {
            return false;
        }
        return true;
    }
    async function* walk(root, { maxDepth = Infinity, includeFiles = true, includeDirs = true, followSymlinks = false, exts = undefined, match = undefined, skip = undefined, } = {}) {
        if (maxDepth < 0) {
            return;
        }
        if (includeDirs && include(root, exts, match, skip)) {
            yield await createWalkEntry(root);
        }
        if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
            return;
        }
        for await (const entry of Deno.readDir(root)) {
            if (entry.isSymlink) {
                if (followSymlinks) {
                    throw new Error("unimplemented");
                }
                else {
                    continue;
                }
            }
            assert_ts_4.assert(entry.name != null);
            const path = mod_ts_4.join(root, entry.name);
            if (entry.isFile) {
                if (includeFiles && include(path, exts, match, skip)) {
                    yield { path, ...entry };
                }
            }
            else {
                yield* walk(path, {
                    maxDepth: maxDepth - 1,
                    includeFiles,
                    includeDirs,
                    followSymlinks,
                    exts,
                    match,
                    skip,
                });
            }
        }
    }
    exports_27("walk", walk);
    function* walkSync(root, { maxDepth = Infinity, includeFiles = true, includeDirs = true, followSymlinks = false, exts = undefined, match = undefined, skip = undefined, } = {}) {
        if (maxDepth < 0) {
            return;
        }
        if (includeDirs && include(root, exts, match, skip)) {
            yield createWalkEntrySync(root);
        }
        if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
            return;
        }
        for (const entry of Deno.readDirSync(root)) {
            if (entry.isSymlink) {
                if (followSymlinks) {
                    throw new Error("unimplemented");
                }
                else {
                    continue;
                }
            }
            assert_ts_4.assert(entry.name != null);
            const path = mod_ts_4.join(root, entry.name);
            if (entry.isFile) {
                if (includeFiles && include(path, exts, match, skip)) {
                    yield { path, ...entry };
                }
            }
            else {
                yield* walkSync(path, {
                    maxDepth: maxDepth - 1,
                    includeFiles,
                    includeDirs,
                    followSymlinks,
                    exts,
                    match,
                    skip,
                });
            }
        }
    }
    exports_27("walkSync", walkSync);
    return {
        setters: [
            function (assert_ts_4_1) {
                assert_ts_4 = assert_ts_4_1;
            },
            function (mod_ts_4_1) {
                mod_ts_4 = mod_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/expand_glob", ["https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/fs/walk", "https://deno.land/std@0.65.0/_util/assert"], function (exports_28, context_28) {
    "use strict";
    var mod_ts_5, walk_ts_1, assert_ts_5, isWindows;
    var __moduleName = context_28 && context_28.id;
    function split(path) {
        const s = mod_ts_5.SEP_PATTERN.source;
        const segments = path
            .replace(new RegExp(`^${s}|${s}$`, "g"), "")
            .split(mod_ts_5.SEP_PATTERN);
        const isAbsolute_ = mod_ts_5.isAbsolute(path);
        return {
            segments,
            isAbsolute: isAbsolute_,
            hasTrailingSep: !!path.match(new RegExp(`${s}$`)),
            winRoot: isWindows && isAbsolute_ ? segments.shift() : undefined,
        };
    }
    function throwUnlessNotFound(error) {
        if (!(error instanceof Deno.errors.NotFound)) {
            throw error;
        }
    }
    function comparePath(a, b) {
        if (a.path < b.path)
            return -1;
        if (a.path > b.path)
            return 1;
        return 0;
    }
    async function* expandGlob(glob, { root = Deno.cwd(), exclude = [], includeDirs = true, extended = false, globstar = false, } = {}) {
        const globOptions = { extended, globstar };
        const absRoot = mod_ts_5.isAbsolute(root)
            ? mod_ts_5.normalize(root)
            : mod_ts_5.joinGlobs([Deno.cwd(), root], globOptions);
        const resolveFromRoot = (path) => mod_ts_5.isAbsolute(path)
            ? mod_ts_5.normalize(path)
            : mod_ts_5.joinGlobs([absRoot, path], globOptions);
        const excludePatterns = exclude
            .map(resolveFromRoot)
            .map((s) => mod_ts_5.globToRegExp(s, globOptions));
        const shouldInclude = (path) => !excludePatterns.some((p) => !!path.match(p));
        const { segments, hasTrailingSep, winRoot } = split(resolveFromRoot(glob));
        let fixedRoot = winRoot != undefined ? winRoot : "/";
        while (segments.length > 0 && !mod_ts_5.isGlob(segments[0])) {
            const seg = segments.shift();
            assert_ts_5.assert(seg != null);
            fixedRoot = mod_ts_5.joinGlobs([fixedRoot, seg], globOptions);
        }
        let fixedRootInfo;
        try {
            fixedRootInfo = await walk_ts_1.createWalkEntry(fixedRoot);
        }
        catch (error) {
            return throwUnlessNotFound(error);
        }
        async function* advanceMatch(walkInfo, globSegment) {
            if (!walkInfo.isDirectory) {
                return;
            }
            else if (globSegment == "..") {
                const parentPath = mod_ts_5.joinGlobs([walkInfo.path, ".."], globOptions);
                try {
                    if (shouldInclude(parentPath)) {
                        return yield await walk_ts_1.createWalkEntry(parentPath);
                    }
                }
                catch (error) {
                    throwUnlessNotFound(error);
                }
                return;
            }
            else if (globSegment == "**") {
                return yield* walk_ts_1.walk(walkInfo.path, {
                    includeFiles: false,
                    skip: excludePatterns,
                });
            }
            yield* walk_ts_1.walk(walkInfo.path, {
                maxDepth: 1,
                match: [
                    mod_ts_5.globToRegExp(mod_ts_5.joinGlobs([walkInfo.path, globSegment], globOptions), globOptions),
                ],
                skip: excludePatterns,
            });
        }
        let currentMatches = [fixedRootInfo];
        for (const segment of segments) {
            const nextMatchMap = new Map();
            for (const currentMatch of currentMatches) {
                for await (const nextMatch of advanceMatch(currentMatch, segment)) {
                    nextMatchMap.set(nextMatch.path, nextMatch);
                }
            }
            currentMatches = [...nextMatchMap.values()].sort(comparePath);
        }
        if (hasTrailingSep) {
            currentMatches = currentMatches.filter((entry) => entry.isDirectory);
        }
        if (!includeDirs) {
            currentMatches = currentMatches.filter((entry) => !entry.isDirectory);
        }
        yield* currentMatches;
    }
    exports_28("expandGlob", expandGlob);
    function* expandGlobSync(glob, { root = Deno.cwd(), exclude = [], includeDirs = true, extended = false, globstar = false, } = {}) {
        const globOptions = { extended, globstar };
        const absRoot = mod_ts_5.isAbsolute(root)
            ? mod_ts_5.normalize(root)
            : mod_ts_5.joinGlobs([Deno.cwd(), root], globOptions);
        const resolveFromRoot = (path) => mod_ts_5.isAbsolute(path)
            ? mod_ts_5.normalize(path)
            : mod_ts_5.joinGlobs([absRoot, path], globOptions);
        const excludePatterns = exclude
            .map(resolveFromRoot)
            .map((s) => mod_ts_5.globToRegExp(s, globOptions));
        const shouldInclude = (path) => !excludePatterns.some((p) => !!path.match(p));
        const { segments, hasTrailingSep, winRoot } = split(resolveFromRoot(glob));
        let fixedRoot = winRoot != undefined ? winRoot : "/";
        while (segments.length > 0 && !mod_ts_5.isGlob(segments[0])) {
            const seg = segments.shift();
            assert_ts_5.assert(seg != null);
            fixedRoot = mod_ts_5.joinGlobs([fixedRoot, seg], globOptions);
        }
        let fixedRootInfo;
        try {
            fixedRootInfo = walk_ts_1.createWalkEntrySync(fixedRoot);
        }
        catch (error) {
            return throwUnlessNotFound(error);
        }
        function* advanceMatch(walkInfo, globSegment) {
            if (!walkInfo.isDirectory) {
                return;
            }
            else if (globSegment == "..") {
                const parentPath = mod_ts_5.joinGlobs([walkInfo.path, ".."], globOptions);
                try {
                    if (shouldInclude(parentPath)) {
                        return yield walk_ts_1.createWalkEntrySync(parentPath);
                    }
                }
                catch (error) {
                    throwUnlessNotFound(error);
                }
                return;
            }
            else if (globSegment == "**") {
                return yield* walk_ts_1.walkSync(walkInfo.path, {
                    includeFiles: false,
                    skip: excludePatterns,
                });
            }
            yield* walk_ts_1.walkSync(walkInfo.path, {
                maxDepth: 1,
                match: [
                    mod_ts_5.globToRegExp(mod_ts_5.joinGlobs([walkInfo.path, globSegment], globOptions), globOptions),
                ],
                skip: excludePatterns,
            });
        }
        let currentMatches = [fixedRootInfo];
        for (const segment of segments) {
            const nextMatchMap = new Map();
            for (const currentMatch of currentMatches) {
                for (const nextMatch of advanceMatch(currentMatch, segment)) {
                    nextMatchMap.set(nextMatch.path, nextMatch);
                }
            }
            currentMatches = [...nextMatchMap.values()].sort(comparePath);
        }
        if (hasTrailingSep) {
            currentMatches = currentMatches.filter((entry) => entry.isDirectory);
        }
        if (!includeDirs) {
            currentMatches = currentMatches.filter((entry) => !entry.isDirectory);
        }
        yield* currentMatches;
    }
    exports_28("expandGlobSync", expandGlobSync);
    return {
        setters: [
            function (mod_ts_5_1) {
                mod_ts_5 = mod_ts_5_1;
            },
            function (walk_ts_1_1) {
                walk_ts_1 = walk_ts_1_1;
            },
            function (assert_ts_5_1) {
                assert_ts_5 = assert_ts_5_1;
            }
        ],
        execute: function () {
            isWindows = Deno.build.os == "windows";
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/move", ["https://deno.land/std@0.65.0/fs/exists", "https://deno.land/std@0.65.0/fs/_util"], function (exports_29, context_29) {
    "use strict";
    var exists_ts_3, _util_ts_7;
    var __moduleName = context_29 && context_29.id;
    async function move(src, dest, { overwrite = false } = {}) {
        const srcStat = await Deno.stat(src);
        if (srcStat.isDirectory && _util_ts_7.isSubdir(src, dest)) {
            throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
        }
        if (overwrite) {
            if (await exists_ts_3.exists(dest)) {
                await Deno.remove(dest, { recursive: true });
            }
            await Deno.rename(src, dest);
        }
        else {
            if (await exists_ts_3.exists(dest)) {
                throw new Error("dest already exists.");
            }
            await Deno.rename(src, dest);
        }
        return;
    }
    exports_29("move", move);
    function moveSync(src, dest, { overwrite = false } = {}) {
        const srcStat = Deno.statSync(src);
        if (srcStat.isDirectory && _util_ts_7.isSubdir(src, dest)) {
            throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
        }
        if (overwrite) {
            if (exists_ts_3.existsSync(dest)) {
                Deno.removeSync(dest, { recursive: true });
            }
            Deno.renameSync(src, dest);
        }
        else {
            if (exists_ts_3.existsSync(dest)) {
                throw new Error("dest already exists.");
            }
            Deno.renameSync(src, dest);
        }
    }
    exports_29("moveSync", moveSync);
    return {
        setters: [
            function (exists_ts_3_1) {
                exists_ts_3 = exists_ts_3_1;
            },
            function (_util_ts_7_1) {
                _util_ts_7 = _util_ts_7_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/copy", ["https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/fs/ensure_dir", "https://deno.land/std@0.65.0/fs/_util", "https://deno.land/std@0.65.0/_util/assert"], function (exports_30, context_30) {
    "use strict";
    var path, ensure_dir_ts_4, _util_ts_8, assert_ts_6, isWindows;
    var __moduleName = context_30 && context_30.id;
    async function ensureValidCopy(src, dest, options, isCopyFolder = false) {
        let destStat;
        try {
            destStat = await Deno.lstat(dest);
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                return;
            }
            throw err;
        }
        if (isCopyFolder && !destStat.isDirectory) {
            throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!options.overwrite) {
            throw new Error(`'${dest}' already exists.`);
        }
        return destStat;
    }
    function ensureValidCopySync(src, dest, options, isCopyFolder = false) {
        let destStat;
        try {
            destStat = Deno.lstatSync(dest);
        }
        catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                return;
            }
            throw err;
        }
        if (isCopyFolder && !destStat.isDirectory) {
            throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!options.overwrite) {
            throw new Error(`'${dest}' already exists.`);
        }
        return destStat;
    }
    async function copyFile(src, dest, options) {
        await ensureValidCopy(src, dest, options);
        await Deno.copyFile(src, dest);
        if (options.preserveTimestamps) {
            const statInfo = await Deno.stat(src);
            assert_ts_6.assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
            assert_ts_6.assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
            await Deno.utime(dest, statInfo.atime, statInfo.mtime);
        }
    }
    function copyFileSync(src, dest, options) {
        ensureValidCopySync(src, dest, options);
        Deno.copyFileSync(src, dest);
        if (options.preserveTimestamps) {
            const statInfo = Deno.statSync(src);
            assert_ts_6.assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
            assert_ts_6.assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
            Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
        }
    }
    async function copySymLink(src, dest, options) {
        await ensureValidCopy(src, dest, options);
        const originSrcFilePath = await Deno.readLink(src);
        const type = _util_ts_8.getFileInfoType(await Deno.lstat(src));
        if (isWindows) {
            await Deno.symlink(originSrcFilePath, dest, {
                type: type === "dir" ? "dir" : "file",
            });
        }
        else {
            await Deno.symlink(originSrcFilePath, dest);
        }
        if (options.preserveTimestamps) {
            const statInfo = await Deno.lstat(src);
            assert_ts_6.assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
            assert_ts_6.assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
            await Deno.utime(dest, statInfo.atime, statInfo.mtime);
        }
    }
    function copySymlinkSync(src, dest, options) {
        ensureValidCopySync(src, dest, options);
        const originSrcFilePath = Deno.readLinkSync(src);
        const type = _util_ts_8.getFileInfoType(Deno.lstatSync(src));
        if (isWindows) {
            Deno.symlinkSync(originSrcFilePath, dest, {
                type: type === "dir" ? "dir" : "file",
            });
        }
        else {
            Deno.symlinkSync(originSrcFilePath, dest);
        }
        if (options.preserveTimestamps) {
            const statInfo = Deno.lstatSync(src);
            assert_ts_6.assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
            assert_ts_6.assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
            Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
        }
    }
    async function copyDir(src, dest, options) {
        const destStat = await ensureValidCopy(src, dest, options, true);
        if (!destStat) {
            await ensure_dir_ts_4.ensureDir(dest);
        }
        if (options.preserveTimestamps) {
            const srcStatInfo = await Deno.stat(src);
            assert_ts_6.assert(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
            assert_ts_6.assert(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
            await Deno.utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
        }
        for await (const entry of Deno.readDir(src)) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, path.basename(srcPath));
            if (entry.isSymlink) {
                await copySymLink(srcPath, destPath, options);
            }
            else if (entry.isDirectory) {
                await copyDir(srcPath, destPath, options);
            }
            else if (entry.isFile) {
                await copyFile(srcPath, destPath, options);
            }
        }
    }
    function copyDirSync(src, dest, options) {
        const destStat = ensureValidCopySync(src, dest, options, true);
        if (!destStat) {
            ensure_dir_ts_4.ensureDirSync(dest);
        }
        if (options.preserveTimestamps) {
            const srcStatInfo = Deno.statSync(src);
            assert_ts_6.assert(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
            assert_ts_6.assert(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
            Deno.utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
        }
        for (const entry of Deno.readDirSync(src)) {
            assert_ts_6.assert(entry.name != null, "file.name must be set");
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, path.basename(srcPath));
            if (entry.isSymlink) {
                copySymlinkSync(srcPath, destPath, options);
            }
            else if (entry.isDirectory) {
                copyDirSync(srcPath, destPath, options);
            }
            else if (entry.isFile) {
                copyFileSync(srcPath, destPath, options);
            }
        }
    }
    async function copy(src, dest, options = {}) {
        src = path.resolve(src);
        dest = path.resolve(dest);
        if (src === dest) {
            throw new Error("Source and destination cannot be the same.");
        }
        const srcStat = await Deno.lstat(src);
        if (srcStat.isDirectory && _util_ts_8.isSubdir(src, dest)) {
            throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
        }
        if (srcStat.isSymlink) {
            await copySymLink(src, dest, options);
        }
        else if (srcStat.isDirectory) {
            await copyDir(src, dest, options);
        }
        else if (srcStat.isFile) {
            await copyFile(src, dest, options);
        }
    }
    exports_30("copy", copy);
    function copySync(src, dest, options = {}) {
        src = path.resolve(src);
        dest = path.resolve(dest);
        if (src === dest) {
            throw new Error("Source and destination cannot be the same.");
        }
        const srcStat = Deno.lstatSync(src);
        if (srcStat.isDirectory && _util_ts_8.isSubdir(src, dest)) {
            throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
        }
        if (srcStat.isSymlink) {
            copySymlinkSync(src, dest, options);
        }
        else if (srcStat.isDirectory) {
            copyDirSync(src, dest, options);
        }
        else if (srcStat.isFile) {
            copyFileSync(src, dest, options);
        }
    }
    exports_30("copySync", copySync);
    return {
        setters: [
            function (path_5) {
                path = path_5;
            },
            function (ensure_dir_ts_4_1) {
                ensure_dir_ts_4 = ensure_dir_ts_4_1;
            },
            function (_util_ts_8_1) {
                _util_ts_8 = _util_ts_8_1;
            },
            function (assert_ts_6_1) {
                assert_ts_6 = assert_ts_6_1;
            }
        ],
        execute: function () {
            isWindows = Deno.build.os === "windows";
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/read_json", [], function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    async function readJson(filePath) {
        const decoder = new TextDecoder("utf-8");
        const content = decoder.decode(await Deno.readFile(filePath));
        try {
            return JSON.parse(content);
        }
        catch (err) {
            err.message = `${filePath}: ${err.message}`;
            throw err;
        }
    }
    exports_31("readJson", readJson);
    function readJsonSync(filePath) {
        const decoder = new TextDecoder("utf-8");
        const content = decoder.decode(Deno.readFileSync(filePath));
        try {
            return JSON.parse(content);
        }
        catch (err) {
            err.message = `${filePath}: ${err.message}`;
            throw err;
        }
    }
    exports_31("readJsonSync", readJsonSync);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/write_json", [], function (exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    function serialize(filePath, object, options) {
        try {
            const jsonString = JSON.stringify(object, options.replacer, options.spaces);
            return `${jsonString}\n`;
        }
        catch (err) {
            err.message = `${filePath}: ${err.message}`;
            throw err;
        }
    }
    async function writeJson(filePath, object, options = {}) {
        const jsonString = serialize(filePath, object, options);
        await Deno.writeTextFile(filePath, jsonString, {
            append: options.append,
            create: options.create,
            mode: options.mode,
        });
    }
    exports_32("writeJson", writeJson);
    function writeJsonSync(filePath, object, options = {}) {
        const jsonString = serialize(filePath, object, options);
        Deno.writeTextFileSync(filePath, jsonString, {
            append: options.append,
            create: options.create,
            mode: options.mode,
        });
    }
    exports_32("writeJsonSync", writeJsonSync);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/eol", [], function (exports_33, context_33) {
    "use strict";
    var EOL, regDetect;
    var __moduleName = context_33 && context_33.id;
    function detect(content) {
        const d = content.match(regDetect);
        if (!d || d.length === 0) {
            return null;
        }
        const crlf = d.filter((x) => x === EOL.CRLF);
        if (crlf.length > 0) {
            return EOL.CRLF;
        }
        else {
            return EOL.LF;
        }
    }
    exports_33("detect", detect);
    function format(content, eol) {
        return content.replace(regDetect, eol);
    }
    exports_33("format", format);
    return {
        setters: [],
        execute: function () {
            (function (EOL) {
                EOL["LF"] = "\n";
                EOL["CRLF"] = "\r\n";
            })(EOL || (EOL = {}));
            exports_33("EOL", EOL);
            regDetect = /(?:\r?\n)/g;
        }
    };
});
System.register("https://deno.land/std@0.65.0/fs/mod", ["https://deno.land/std@0.65.0/fs/empty_dir", "https://deno.land/std@0.65.0/fs/ensure_dir", "https://deno.land/std@0.65.0/fs/ensure_file", "https://deno.land/std@0.65.0/fs/ensure_link", "https://deno.land/std@0.65.0/fs/ensure_symlink", "https://deno.land/std@0.65.0/fs/exists", "https://deno.land/std@0.65.0/fs/expand_glob", "https://deno.land/std@0.65.0/fs/move", "https://deno.land/std@0.65.0/fs/copy", "https://deno.land/std@0.65.0/fs/read_json", "https://deno.land/std@0.65.0/fs/write_json", "https://deno.land/std@0.65.0/fs/walk", "https://deno.land/std@0.65.0/fs/eol"], function (exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    function exportStar_3(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_34(exports);
    }
    return {
        setters: [
            function (empty_dir_ts_1_1) {
                exportStar_3(empty_dir_ts_1_1);
            },
            function (ensure_dir_ts_5_1) {
                exportStar_3(ensure_dir_ts_5_1);
            },
            function (ensure_file_ts_1_1) {
                exportStar_3(ensure_file_ts_1_1);
            },
            function (ensure_link_ts_1_1) {
                exportStar_3(ensure_link_ts_1_1);
            },
            function (ensure_symlink_ts_1_1) {
                exportStar_3(ensure_symlink_ts_1_1);
            },
            function (exists_ts_4_1) {
                exportStar_3(exists_ts_4_1);
            },
            function (expand_glob_ts_1_1) {
                exportStar_3(expand_glob_ts_1_1);
            },
            function (move_ts_1_1) {
                exportStar_3(move_ts_1_1);
            },
            function (copy_ts_1_1) {
                exportStar_3(copy_ts_1_1);
            },
            function (read_json_ts_1_1) {
                exportStar_3(read_json_ts_1_1);
            },
            function (write_json_ts_1_1) {
                exportStar_3(write_json_ts_1_1);
            },
            function (walk_ts_2_1) {
                exportStar_3(walk_ts_2_1);
            },
            function (eol_ts_1_1) {
                exportStar_3(eol_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///Users/krispinschulz/code/my/devon/src/deps", ["https://deno.land/std@0.65.0/io/mod", "https://deno.land/std@0.65.0/fs/exists", "https://deno.land/std@0.65.0/path/mod", "https://deno.land/std@0.65.0/fs/mod"], function (exports_35, context_35) {
    "use strict";
    var mod_ts_6, exists_ts_5, path, fs;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (mod_ts_6_1) {
                mod_ts_6 = mod_ts_6_1;
            },
            function (exists_ts_5_1) {
                exists_ts_5 = exists_ts_5_1;
            },
            function (path_6) {
                path = path_6;
            },
            function (fs_1) {
                fs = fs_1;
            }
        ],
        execute: function () {
            exports_35("BufReader", mod_ts_6.BufReader);
            exports_35("exists", exists_ts_5.exists);
            exports_35("path", path);
            exports_35("fs", fs);
        }
    };
});
System.register("file:///Users/krispinschulz/code/my/devon/src/commands/gemini", ["file:///Users/krispinschulz/code/my/devon/src/deps"], function (exports_36, context_36) {
    "use strict";
    var deps_js_1;
    var __moduleName = context_36 && context_36.id;
    async function default_2(url) {
        if (!url.startsWith("gemini://")) {
            url = `gemini://${url}`;
        }
        url = url.replace("gemini://", "https://");
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        }
        catch (e) {
            console.error(e);
            return;
        }
        if (!parsedUrl.pathname.startsWith("/")) {
            parsedUrl.pathname = "/";
        }
        try {
            const conn = await Deno.connectTls({ hostname: parsedUrl.hostname, port: 1965 });
            const geminiUrl = `gemini://${parsedUrl.hostname}${parsedUrl.pathname}`;
            const reader = new deps_js_1.BufReader(conn);
            await conn.write(new TextEncoder().encode(`${geminiUrl}\r\n`));
            const header = await reader.readString("\n");
            const [status, ...rest] = (header || "4 ").split(/\s/);
            const meta = rest.join(" ");
            const statusCode = Number(status.substr(0, 1));
            let body;
            if (statusCode === 2) {
                const bodyBytes = await Deno.readAll(reader);
                body = new TextDecoder().decode(bodyBytes);
            }
            return `${header}\n${body}`;
        }
        catch (e) {
            console.error(e);
        }
    }
    exports_36("default", default_2);
    return {
        setters: [
            function (deps_js_1_1) {
                deps_js_1 = deps_js_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///Users/krispinschulz/code/my/devon/src/index", ["file:///Users/krispinschulz/code/my/devon/src/deps"], function (exports_37, context_37) {
    "use strict";
    var deps_js_2, __dirname;
    var __moduleName = context_37 && context_37.id;
    async function prompt() {
        const buf = new Uint8Array(1024);
        await Deno.stdout.write(new TextEncoder().encode("> "));
        const command = await Deno.stdin.read(buf);
        return new TextDecoder().decode(buf.subarray(0, command)).trim();
    }
    function writeLine(text) {
        if (typeof text === "undefined")
            return;
        Deno.stdout.write(new TextEncoder().encode(text + "\n"));
    }
    async function parsePrompt(command) {
        const [commandName, ...args] = command.split(" ");
        const commandFile = `${__dirname}/commands/${commandName}.js`;
        const commandExists = await deps_js_2.exists(commandFile);
        if (commandExists) {
            const module = await context_37.import(commandFile);
            const { default: commandFn } = module;
            writeLine(await commandFn.apply(null, args));
        }
        else {
            if (command === "")
                return;
            if (command === "exit")
                return Deno.exit();
            console.error(`Command not found: ${commandName}`);
        }
    }
    return {
        setters: [
            function (deps_js_2_1) {
                deps_js_2 = deps_js_2_1;
            }
        ],
        execute: async function () {
            __dirname = deps_js_2.path.dirname(deps_js_2.path.fromFileUrl(context_37.meta.url));
            while (true) {
                await parsePrompt(await prompt());
            }
        }
    };
});

await __instantiate("file:///Users/krispinschulz/code/my/devon/src/index", true);
