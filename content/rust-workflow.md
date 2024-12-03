+++
title = "My Rust workflow"
date = 2021-04-27
+++

In this post I collected a bunch tools and habits that improved my experience as a Rust programmer.

# Working with terminal

Learn to code in a vim-like editor. You can get quite fast by using only your keyboard. I like [Kakoune](https://github.com/mawww/kakoune) because it treats movement also as a selection. You don't need plugins or an IDE. The compiler and the code editor work much better separately.

Use `tmux` to manage sessions and tabs. Create a new session for each project like this:

```bash
tmux new -s project-name
```

or, if you're already in `tmux`: `Ctrl-b`, then type `:new-session -s project-name`. This way you'll have only one window with a couple of tabs on your screen. Switch between projects with `Ctrl-b`, then `s`.

# cargo watch

Instead of starting the build process manually, launch [cargo watch](https://github.com/passcod/cargo-watch) in a separate tab:

```bash
cargo watch -x build
```

This process will execute a command each time you change and save a file in your project dir. `cargo watch` lets you specify the command it'll execute - `fmt`, `clippy`, etc.

# --out-dir

Dump cargo run and use this command:

```bash
# Make an alias if you don't want to type it each time!

cargo build -Z unstable-options --out-dir $my-bin-folder
```

Pass a literal path in place of `$my-bin-folder` or make it an env variable. Just make sure it's in your `$PATH`.

It's especially useful when testing binaries in various directories. Without it, you'd have to type something like `my-project-path/target/debug/my-app` or move the binary manually. It works great together with cargo watch:

```bash
cargo watch -x 'build -Z unstable-options --out-dir $my-bin-folder'
```

Now you can run your binary from anywhere just like any other command:

```bash
$ my-app
```

# ~~~flow~~~

**Step 1.** Create a messy prototype in `main.rs` on branch `proto/name-of-your-idea`. Have a rule that code in branches `proto/*` does not have to be beautiful or 100% safe. This will free you from worrying about how 'pure' your repo is.

**Step 2.** 'Carve out' a module out of `main.rs`. Add a file `src/module-name/mod.rs`. Move all code related to that module from `main.rs` there. Copy-paste all imports from `main.rs` there as well - you'll delete unnecessary ones later.

Then, add this to your `Cargo.toml`...

```toml
[package]
name = "myapp"
# ...

[[bin]]
name = "myapp"
path = "src/main.rs"

[[bin]]
name = "myapp-mymodule"
path = "src/my-module/mod.rs"
...change the build/check command...
```

```bash
cargo watch -x 'build --bin myapp-mymodule'
```

**...and BOOM! Now you can break your module's API without having to fix errors in the rest of your code!** It's amazing how much flexibility it gives you - the module becomes the root of your project and no code referencing it gets compiled. You don't have to create a separate project or set up a workspace or comment anything out - *It Just Works™*. You can switch between your module and the app just by setting the target binary. (I believe you don't even need to delete `fn main()` and the imports from `mod.rs`.)

```rust
// In src/my-module/mod.rs.

// If you need to import a module that is not inside
// this mod's directory, add a `#[path = ...]` attribute.

#[path = "../custom-print/mod.rs"] // Importing src/custom-print/mod.rs.
mod custom_print;

// `my-module`'s own main... what?!
fn main() {
    custom_print::print("heyyy");
}
```

**Step 3.** Polish the module, cover the edge cases and test it. Only after you're done switch back to your default compilation target and fix all errors you've generated.

Repeat with each module until the prototype becomes somewhat beautiful and safe. Then merge to master and go to step 1.


# Distributing binaries

Turns out it is easier to change an OS to build a binary than to cross-compile. You can build your binaries using [GitHub Actions](https://docs.github.com/en/actions). I don't love programming in YAML or importing workflows, but after I've set it up, it's not painful at all.

Add a branch named `release` and set up your workflow so that compiles the project on each push to that branch:

```yaml
on:
  push:
    branches: [release]

# ...
```

I discovered having this separate branch is much better than only building tags (I don't want to push a tag to add a new target or fix a tiny bug) or building on each push to `master` (I don't want to recompile on each of the 25 consecutive commits that say `Update README.md`). With the help of [black magic](https://github.com/actions/upload-artifact) you will be able to download binaries after each compilation. Put them up in the Releases page of your GitHub repo.

I'm no expert on GitHub Actions but you can check out my setup [here](https://github.com/micouy/kn/blob/341631f9fd7b345e8c2451847f795187b73e9902/.github/workflows/build-binaries.yml). And [here](https://actions-rs.github.io/) you can read more about `actions-rs`, GitHub Actions dedicated for Rust projects.


# Docs

When it comes to documentation, Rust is among the best. Docs of each published crate are available at `docs.rs/crate-name`.

What's cool is that you don't even Internet access to browse the docs of your project's dependencies. Just make sure you've added them to your `Cargo.toml` before going offline. After they're cached on your computer you can open each package's documentation by running the command below in your project's directory.

```bash
cargo doc --package somepackage --offline --no-deps --open
```

It will generate necessary HTML files and open the docs in your browser. `--offline` flag is there to make sure `cargo` won't try to access the docs online. You need to pass `--no-deps` to prevent `cargo` from documenting the chosen package's dependencies.

To browse standard library's docs go to `docs.rs/std` or run:

```bash
rustup doc --std
```

# `NOTEPAD.md`

Create a file called `NOTEPAD.md`. Add it to your `.gitignore`. Make it your scratchpad - write in a mix of English and your native language, curse, save useful links related to your project or think by typing. By all means ignore the rules of Markdown formatting.

# Journal

Keep a journal with important notes about all your projects, especially:

- Errors that took you long to solve and their solutions (i.e. links to StackOverflow threads).
- Places you hit a wall in your projects, so that you can glance at them from time to time and come back if you have nothing better to do or have a new idea.
- Manual installations and errors while installing. In your journal you can track apps that need to be updated or uninstalled manually. You can also put links to GitHub issues or threads on StackOverflow in case there's a fix.

Leave a comment if you have other suggestions!
