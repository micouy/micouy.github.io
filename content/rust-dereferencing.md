+++
title = "I do understand the * operator in Rust now (updated)"
date = 2022-03-19
+++

## Update

[See the original post below.](/#original-post)

I've [linked this post on r/rust](https://www.reddit.com/r/rust/comments/thvc2e/i_still_dont_understand_the_operator_in_rust/?utm_source=share&utm_medium=web2x&context=3) and I've got a ton of helpful answers. I'll explain what I've learned.

Before I had a vague idea that dereferencing means "following the pointer (the reference) and trying to **move** the data from that location". That's why `f3` and `g2` confused me. I thought the reference operator surrounding the dereference somehow cancelled the move:

```rust
// Doesn't compile.
fn g1(thing: &Thing) -> &String {
    let tmp = *thing;
//            ┗━ Move data out of `thing`.

    &tmp.field
}

// Compiles.
fn g2(thing: &Thing) -> &String {
    &(*thing).field
//  ┃ ┗━ Move data out of `thing`.
//  ┗━━━ No actually cancel that.
}
```

But [u/kiujhytg2' comment](https://www.reddit.com/r/rust/comments/thvc2e/comment/i1a8zpw/?utm_source=share&utm_medium=web2x&context=3) made me understand that it was not `*` which forced the move. Turns out there was another trickster hiding in plain sight...

The `=` operator! It had not occured to me before but it all makes sense now.

```rust
// Doesn't compile.
fn g1(thing: &Thing) -> &String {
    let tmp = *thing;
//          ┃ ┗━ Point directly to the referenced data.
//          ┗━━━ Try to copy RHS's value, otherwise move it into `tmp`.

    &tmp.field
}

// Compiles.
fn g2(thing: &Thing) -> &String {
    &(*thing).field
//  ┃ ┗━ Point directly to the referenced data.
//  ┗━━━ Create a reference to the expression's value with a matching lifetime.
}
```

I'm still not sure how Rust determines what lifetime the newly created reference should have. It has been pointed out that `*thing` is not exactly just `Thing`. I guess Rust remembers that it's a dereferenced variable and referencing it again restores the original lifetime. Some of the comments pointed me to Rust Reference's [chapter on Place Expressions and Value Expressions](https://doc.rust-lang.org/reference/expressions.html#place-expressions-and-value-expressions). Perhaps it describes it better, I haven't had the time to read it yet.

Thanks to all of the commenters, I appreciate the thorough explanations and a very helpful discussion. If you think I should file a PR somewhere to add this information to Rust's documentation, please let me know in the comments here or on Reddit.


## Original post

I’m trying to explain references to people beginning programming in Rust. Despite using Rust for a couple of years now, I’m unable to answer this question: Why can’t I just deref an immutable reference to access the owned data?

```rust
fn modify(arg: &String) {
    let mut arg: String = *arg;
    arg.push_str("smth");
}
```

I know how stupid this sounds. But I still genuinely don’t know the reason why not. I don’t think there’s a rule that says "You shall not dereference an immutable reference.". What else could the deref operator do?

I’ve tried to answer that last question, but docs on this topic are rather scarce...

Note: The opposite of referencing by using `&` is *dereferencing*, which is accomplished with the dereference operator, `*`.

[Source](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

Whatever "opposite of referencing" means in this sentence, it does not mean "taking a reference and returning the value it points to". Despite `&` and `*` being an obvious reference to pointer operators in C, the deref operator is not analogous at all. It’s simply impossible to dereference a reference in Rust (unless a is `Copy`):

```rust
let a = String::from("hello");
let b = &a;
let c = *b; // Error!
```

I think dereferencing acutally isn’t the opposite of referencing in Rust. The opposite of referencing is dropping a reference, and the deref operator is totally unrelated to the ref operator. It could be implemented as a function in std [1]:

```rust
fn copy<T: Copy>(t: &T) -> T { /* copy bytes and return owned value [2] */ }
```

But it gets even worse.

In Rust the meaning of `&` and `*` **depend on the context**. And I’m not talking about left hand side vs right hand side `*a = *b` or pattern matching `let &c = b;`.*Taking a reference* and *dereferencing* both alter their meaning depending on the surrounding code:

Note that each example is supposed to do the same thing — take a reference to `Thing` and return a reference to its field.

```rust
struct Thing {
    field: String,
}
// Compiles. Straight and simple.
fn f1(thing: &Thing) -> &String {
    &thing.field
}

// Doesn't compile...
fn f2(thing: &Thing) -> &String {
    let tmp = thing.field;

    &tmp
}

// Compiles?!
fn f3(thing: &Thing) -> &String {
    &(thing.field)
}
It’s the same with *:

// Doesn't compile...
fn g1(thing: &Thing) -> &String {
    let tmp = *thing;

    &tmp.field
}

// Compiles?!
fn g2(thing: &Thing) -> &String {
    &(*thing).field
}
```

Seeing `f1` compile and `f2` throw an error confused me. But I explained to myself that it’s just the syntax, that the compiler understands `&thing.field` as one integral thing and it can’t be broken down. But there’s no way to explain why `f3` compiles then.

In `f1` and `f3` the reference operator means "re-reference the field with the same lifetime as `Thing`". But in `f2` the same reference operator means "create a new reference with lifetime limited to the current scope".

And in `g1` the deref operator means copy but in `g2` it gets combined with the reference operator, despite the parentheses, and interpreted as "re-reference" again.

Questions to the audience:

What **exactly** does the deref operator do under the hood?
What rule prohibits me from dereferencing an immutable reference?
Why is the meaning of `&` and `*` context-dependent?
Why do the docs suggest that `*` is the opposite of `&` (with their names, by reference to C’s operators, in the note in the book) when they’re clearly not? Why is there no explanation of what `*` does?

---

[1] Except for the left hand side: `*reference = new_value;`. That’s the only place where `*` seems useful.

[2] There would be some issues with smart pointers implementing `Deref`. Maybe they could implement `get_ref` method instead, like [`BufReader` does](https://doc.rust-lang.org/stable/std/io/struct.BufReader.html#method.get_ref).
