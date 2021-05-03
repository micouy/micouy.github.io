+++
title = "Mutable arguments considered harmful"
date = 2021-05-03
draft = false

[extra]
comments = true
+++


# Principle of single mutable access

Rust's borrow checker makes reasoning about mutation easy. It guarantees that at any given
moment there exists at most one mutable access to each piece of data. You can track the access
as it is passed around in the code. With this principle, your search is reduced to a single path
that does not branch out.

The said principle is very powerful even outside of programming. You can see it in action on
[aggie.io](https://aggie.io/). It is a platform where you can draw with your friends. Each layer
in the drawing has at most one owner and only the owner can draw on their layers. Despite (or
rather because of) its simplicity, this algorithm prevents any conflicting edits.

Unfortunately, this principle does not prevent the programmer from making other kinds of mistakes.


# Incoherent state

Consider an example of a bag of nuts:

```rust
enum Nut {
    Peanut,
    Hazelnut,
    Cashew,
}

struct Bag {
    contents: Vec<Nut>,
}
```

In your program you often need to get the number of peanuts in the bag. You can compute it each
time, or cache it in a second field, like this:

```rust
struct Bag {
    contents: Vec<Nut>,
    peanut_count: usize,
}
```

Unfortunately, in such situations it's easy to introduce incoherent state:

```rust
fn add_peanut(bag: &mut Bag) {
    bag.contents.push(Nut::Peanut);
    
    // Oops, forgot to increment peanut count.
}
```

In this example you can spot the bug right away. But what if a function mutates multiple
fields and there are more complex relations between them? Or what if multiple functions
mutate fields independently? At this point it becomes harder to reason about the state.

```rust
fn add_peanut(bag: &mut Bag) {
    add_nut(bag, Nut::Peanut);

    // What if I added another function call between these two?
    // Can I make any assumptions about the state of `bag`?

    increment_peanut_count(bag);
}
```

In the example above, between the first and second function call, the bag is in a incoherent
state. It's okay because the program cannot access the bag while the function has the mutable
reference. And after the function is done, `bag` is again in a valid state.

However, this approach is quite error prone. And it's not just about bad function design. Notice that
whenever a function mutates a state that has interrelated components, it must do it **sequentially**:

```rust
struct State {
    x: i32,
    double_ix: i32,
}

impl State {
    fn well_designed_method(&mut self) {
        self.x += 1;
        
        // Incoherent state here.
        
        self.double_x = self.x * 2;
    }
}
```

Even if you hide the internal representation and only mutate the state through methods,
it is possible to introduce bugs in the methods themselves (a trivial observation, but bear with me).

The other problem with methods is that taking mutable reference to `self` is implicit.
Checkout this code form `ripgrep`:

```rust
if subject.is_stdin() {
    self.search_reader(path, io::stdin().lock())   // Takes &mut self.
} else if self.should_preprocess(path) {           // Takes &self.
    self.search_preprocessor(path)                 // Takes &mut self.
} else if self.should_decompress(path) {           // Takes &self.
    self.search_decompress(path)                   // Takes &mut self.
} else {
    self.search_path(path)                         // Takes &mut self.
}
```

It's BurntSushi's code, so of course it makes sense - evaluating conditions doesn't require
mutable access, doing things with the state does. The point is that you can't
be sure what the code does just from reading it.


# Functional approach

As an alternative I propose pure functions. Instead of mutating the input state,
a pure function unpacks the input state, constructs a new state and returns it. Of course
it's nothing new but it's so rarely used in Rust code that I think it's worth talking about.

There are three big advantages:
- **Not** mutating a field is as explicit as mutating it.
- There is no line in which data is in incoherent state.
- There are no implicit mutable references to `self`, so no implicit mutation can sneak in.

```rust
fn add_peanut_on_condition(bag: Bag) -> Bag {
    let Bag {
        content: old_content,
        peanut_count: old_peanut_count,
    } = bag;

    // `bag` cannot be in incoherent state, since there's no `bag`
    // at this point.

    if some_condition {
        let new_content = add_nut(old_content, Nut::Peanut);
        let new_peanut_count = increment_peanut_count(old_peanut_count);

        // The new `Bag` is constructed from coherent data.
        let new_bag = Bag {
            content: new_content,
            peanut_count: new_peanut_count,
        };

        return new_bag;
    } else {
        // **Not** mutating a field is explicit.
        let new_bag = Bag {
            content: old_content,
            peanut_count: old_peanut_count,
        };

        return new_bag;
    }
}
```


# Structs are not collections of variables

Notice that in the code above **variables** `content` and `peanut_count` are mutated independently anyways:

```rust
fn add_nut(mut content: Vec<Nut>, nut: Nut) -> Vec<Nut> {
  // Warning: `content` is mutated here independently from `peanut_count`!

  // It's okay, because `Vec<Nut>` by itself makes no guarantees
  // about `peanut_count`.

  content.push(nut);

  content
}
```

But there's a real difference between mutating independent variables and fields of a struct:
Structs are not just collections of variables. They are collections of variables **plus guarantees
about them**. Whenever you violate such guarantee, you make it easier to introduce bugs, whether
you expose this violation or not.
