# FFI bindings for p2panda

Experimental FFI bindings of p2panda's [Node API](https://crates.io/crates/p2panda) for Python, Go
and Node.js.

Next to these bindings you'll find GObject bindings (GLib/GObject introspection) for p2panda in
[`p2panda-gobject`](https://github.com/p2panda/p2panda-gobject).

> 🚧 This library is under active development and the APIs are not yet considered stable for
> production use. Core data types and user-facing APIs may still undergo breaking changes. Stability
> guarantees will improve with the release of v1.0.0.

## Good to know

- We're using [UniFFI](https://mozilla.github.io/uniffi-rs/latest/index.html). UniFFI is a tool that
  automatically generates foreign-language bindings targeting Rust libraries.
- Make sure you have [Rust](https://rust-lang.org/learn/get-started/) ready on your machine. We've
  tested this with `v1.95.0`.
- We're using [proc
  macros](https://mozilla.github.io/uniffi-rs/latest/tutorial/Rust_scaffolding.html) to "scaffold"
  everything for UniFFI from Rust, so there's no need to create an additional UDL file.
- `uniffi-bindgen` is the UniFFI CLI tool we need to generate p2panda FFI bindings for various
  languages. This tool can be compiled from this project.

## Usage

```bash
# First compile `uniffi-bindgen` and the p2panda library. The binary and library lands in the `target`
# folder. Don't forget to repeat this step whenever you change the Rust code.
make build

# From now on we can use the tool `uniffi-bindgen`.
cargo run --bin uniffi-bindgen --release

# The p2panda library is compiled as well and ready to be used for FFI into other languages (Python,
# Go, etc.). Follow the next steps below for generating FFI bindings for specific languages.
#
# Make sure the library is available by linking it into the right path:
ln -s ./target/release/libp2panda_ffi.so ./python/p2panda_ffi
```

### Python

```bash
# Generate FFI bindings for Python
make ffi-python

# Run example
python ./python/example.py
```

### Go

`libp2panda` is currently built for the `x86_64-unknown-linux-musl` target. Other targets can be
added on request.

Make sure you have [uniffi-bindgen-go](https://github.com/NordSecurity/uniffi-bindgen-go) installed
in your Rust toolbelt.

See the examples in [`./examples/go`](./examples/go).

```bash
# Generate FFI bindings for Go
make ffi-go

# Run test bindings
./scripts/test-go-uniffi.sh
```

### Node.js

Make sure you have [uniffi-bindgen-node-js](https://github.com/criccomini/uniffi-bindgen-node-js)
installed in your Rust toolbelt.

```bash
# Generate FFI bindings for Node.js
make ffi-nodejs

# Re-build wrapper package if any changes done there
cd nodejs
npm run build

# Run example
node nodejs/example.js
```
