+++
title = "Drag & drop in VR with LÖVR"
date = 2024-11-29
+++

LÖVR is a delightful to use VR framework. In this post I'll explain how to implement a simple drag & drog feature in it.

For LÖVR beginners, [here's a guide on how to get started](https://lovr.org/docs/Getting_Started).

Surprisingly you don't need a headset to run LÖVR apps - you can just call `lovr .` in a folder with a `main.lua` file. This will launch an emulator on your computer. For our drag & drop feature however, we will need the headset to get the positions, orientations and gestures of our hands. I'm using a Meta Quest 3. If you don't have a headset yet, I'd recommend checking out [Meta Quest 3S](https://www.meta.com/quest/quest-3s/), because it's so cheap.

## Hello World & Launching the app on your headset

We'll start with a simple hello world app:

```lua
function lovr.draw(pass)
    pass:text("hello world", vec3(0, 1, -1), 0.1, quat())
end
```

<small>

`vec3(0, 1, -1)` the position of the text, where negative Z axis is in the direction the headset is facing.

`0.1` is the scale of the text.

`quat` constructs a default quaternion, a mathematical object storing the information about the orientation in three dimensions.

</small>

That's the whole program. You can save it to a file named `main.lua` in a new project folder. To launch it on your headset, follow [these instructions](https://lovr.org/docs/Getting_Started_(Quest)).


## Hand tracking with LÖVR

LÖVR exposes a very simple API for tracking both hands and controllers. The whole API is documented very well in [the docs](https://lovr.org/docs/Getting_Started), together with examples.

We can start by copying the [Tracked Hands](https://lovr.org/docs/Intro/Tracked_Hands) example:


# TODO: check if getHands() works with controllers

```lua
function lovr.draw(pass)
  for i, hand in ipairs(lovr.headset.getHands()) do
    local x, y, z = lovr.headset.getPosition(hand)
    pass:sphere(x, y, z, .1)
  end
end
```

<small>
If you have trouble with hand tracking, you can switch to controllers without changing the code.
</small>

After launching it on your headset, you'll see two 10 centimeters white spheres following your hands positions.

To study what exactly the code does, you can check out these pages in the docs:

- [`lovr.draw`](https://lovr.org/docs/lovr.draw)
- [`lovr.headset.getHands`](https://lovr.org/docs/lovr.headset.getHands)
- [`lovr.headset.getPosition`](https://lovr.org/docs/lovr.headset.getPosition)
- [`Pass:sphere`](https://lovr.org/docs/Pass:sphere)


## User input

Now we need to detect grab events. We'll use the `trigger` input fired when the controller trigger is pressed or when the user pinches their fingers.

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local x, y, z = lovr.headset.getPosition(hand)

        -- Set white color by default.
        pass:setColor(0xffffff)

        -- Set red color if the user just tried to grab.
        if lovr.headset.wasPressed(hand,'trigger') then
            pass:setColor(0xff0000)
        end

        pass:sphere(x, y, z, .1)
    end
end
```

Now whenever you pinch your fingers, you'll see the spheres flicker red for a single frame.

Let's display something that we can grab.

```lua
local box1 = {
    position = lovr.math.newVec3(0.5, 1, -0.5),
    dimensions = lovr.math.newVec3(0.3, 0.3, 0.3),
}

local box2 = {
    position = lovr.math.newVec3(-0.5, 1, -0.5),
    dimensions = lovr.math.newVec3(0.5, 0.5, 0.5),
}

local boxes = { box1, box2 }

function lovr.draw(pass)
    -- The rest of the owl...

    for _, box in ipairs(boxes) do
        pass:box(box.position, box.dimensions, quat(), 'line')
    end
end
```

See [`Pass:box`](https://lovr.org/docs/Pass:box).

<details>
<summary>
A note on vec3(...) and lovr.math.newVec3(...)
</summary>

You might notice that in the Hello World example I instantiated a vector using [`vec3(...)`](https://lovr.org/docs/lovr.math.vec3) and here I used [`lovr.math.newVec3(...)`](https://lovr.org/docs/lovr.math.newVec3). It's not random.

If the vector is used only within one frame (it isn't assigned to a variable used outside of `lovr.draw` or `lovr.update`), I can construct a temporary vector with `vec3(...)`. If I need a vector to live for longer, I need to use `lovr.math.newVec3(...)`.

If you use a temporary vector during another frame, you'll get an error saying `'Attempt to use a temporary vector from a previous frame'`.
</details>

No we need to detect whether the hand was touching the cube while the grab event fired.

We'll add an `isActive` property to each box...

```lua
local box1 = {
    position = lovr.math.newVec3(0.5, 1.5, -0.5),
    dimensions = lovr.math.newVec3(0.3, 0.3, 0.3),
    isActive = false,
}

local box2 = {
    position = lovr.math.newVec3(-0.5, 1.5, -0.5),
    dimensions = lovr.math.newVec3(0.5, 0.5, 0.5),
    isActive = false,
}
```

...convert the coordinates returned by `getPosition(...)` into a vector and update code which displays the spheres...

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))

        pass:setColor(0xffffff)
        pass:sphere(handPosition, .1)
    end
end
```

...then toggle `isActive` of a box the user grabbed...

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))

        local wasPressed = lovr.headset.wasPressed(hand, 'trigger')

        for _, box in ipairs(boxes) do
            if wasPressed and isPointInsideBox(handPosition, box) then
                box.isActive = not box.isActive
            end
        end

        -- ...
    end
end
```

We'll also change box's color depending on whether it is active:

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        -- ...
    end

    for _, box in ipairs(boxes) do
        if box.isActive then
            pass:setColor(0x00ff00)
        else
            pass:setColor(0xffffff)
        end

        pass:box(box.position, box.dimensions, quat(), 'line')
    end
end
```

And lastly, let's implement the `isPointInsideBox` function:

```lua
function isPointInsideBox(point, box)
    local relativePoint = point - box.position + (box.dimensions / 2)
    local width, height, depth = box.dimensions:unpack()

    return (
        relativePoint.x > 0 and relativePoint.x < width
        and relativePoint.y > 0 and relativePoint.y < height
        and relativePoint.z > 0 and relativePoint.z < depth
    )
end
```

We're adding `box.dimensions / 2` because `box.position` marks the center of the drawn box, not its corner.

<details>
<summary>
Whole code
</summary>

```lua
local box1 = {
    position = lovr.math.newVec3(0.5, 1.5, -0.5),
    dimensions = lovr.math.newVec3(0.3, 0.3, 0.3),
    isActive = false,
}

local box2 = {
    position = lovr.math.newVec3(-0.5, 1.5, -0.5),
    dimensions = lovr.math.newVec3(0.5, 0.5, 0.5),
    isActive = false,
}

local boxes = { box1, box2 }

function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))

        local wasPressed = lovr.headset.wasPressed(hand, 'trigger')

        for _, box in ipairs(boxes) do
            if wasPressed and isPointInsideBox(handPosition, box) then
                box.isActive = not box.isActive
            end
        end

        pass:setColor(0xffffff)
        pass:sphere(handPosition, .1)
    end

    for _, box in ipairs(boxes) do
        if box.isActive then
            pass:setColor(0x00ff00)
        else
            pass:setColor(0xffffff)
        end

        pass:box(box.position, box.dimensions, quat(), 'line')
    end
end

function isPointInsideBox(point, box)
    local relativePoint = point - box.position + (box.dimensions / 2)
    local width, height, depth = box.dimensions:unpack()

    return (
        relativePoint.x > 0 and relativePoint.x < width
        and relativePoint.y > 0 and relativePoint.y < height
        and relativePoint.z > 0 and relativePoint.z < depth
    )
end
```

</details>

If you run your code now, you should see the boxes change its color to green when you pinch them, and then back to white when you do it again.

## Grabbing

Now that we're able to detect whether the user grabbed something, let's make it follow our hand.

We need to keep track of which hand is grabbing which box in order to move the boxes correctly. We'll store which hand is grabbing which box together with the offsets:

```lua
local box1 = {
    -- ...
}

local box2 = {
    -- ...
}

local boxes = { box1, box2 }

local grabbedBoxes = {
    ["hand/left"] = nil,
    ["hand/right"] = nil,
}
```

<small>
"hand/left" and "hand/right" are the hand identifiers used by LÖVR.
</small>

On each trigger event we'll iterate over each box and store it in `grabbedBoxes` if it was grabbed, alongside the offset...

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))

        local wasPressed = lovr.headset.wasPressed(hand, 'trigger')

        if wasPressed then
            for _, box in ipairs(boxes) do
                if isPointInsideBox(handPosition, box) then
                    grabbedBoxes[hand] = {
                        box = box,
                        offset = lovr.math.newVec3(handPosition - box.position),
                    }
                end
            end
        end

        -- ...
    end

    -- ...
end
```

...or remove it from `grabbedBoxes` if it was released...

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        -- ...

        local wasReleased = lovr.headset.wasReleased(hand, 'trigger')

        if wasReleased then
            grabbedBoxes[hand] = nil
        end

        -- ...
    end

    -- ...
end
```

...and lastly move the grabbed box:

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))

        -- ...

        local grabbedBox = grabbedBoxes[hand]

        if grabbedBox ~= nil then
            grabbedBox.box.position:set(handPosition - grabbedBox.offset)
        end

        pass:sphere(handPosition, .1)
    end

    -- ...
end
```

To highlight a grabbed box, we'll change its color:

```lua
function lovr.draw(pass)
    -- ...

    for _, box in ipairs(boxes) do
        local isGrabbed = (
            (grabbedBoxes.left and grabbedBoxes.left.box == box)
            or (grabbedBoxes.right and grabbedBoxes.right.box == box)
        )

        if isGrabbed then
            pass:setColor(0x00ff00)
        else
            pass:setColor(0xffffff)
        end

        pass:box(box.position, box.dimensions, quat(), 'line')
    end
end
```

<details>
<summary>
Whole code
</summary>

```lua
local box1 = {
    position = lovr.math.newVec3(0.5, 1, -0.5),
    dimensions = lovr.math.newVec3(0.3, 0.3, 0.3),
}

local box2 = {
    position = lovr.math.newVec3(-0.5, 1, -0.5),
    dimensions = lovr.math.newVec3(0.5, 0.5, 0.5),
}

local boxes = { box1, box2 }

local grabbedBoxes = {
    ["hand/left"] = nil,
    ["hand/right"] = nil,
}

function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))

        local wasPressed = lovr.headset.wasPressed(hand, 'trigger')

        if wasPressed then
            for _, box in ipairs(boxes) do
                if isPointInsideBox(handPosition, box) then
                    grabbedBoxes[hand] = {
                        box = box,
                        offset = lovr.math.newVec3(handPosition - box.position),
                    }
                end
            end
        end

        local wasReleased = lovr.headset.wasReleased(hand, 'trigger')

        if wasReleased then
            grabbedBoxes[hand] = nil
        end

        local grabbedBox = grabbedBoxes[hand]

        if grabbedBox ~= nil then
            grabbedBox.box.position:set(handPosition - grabbedBox.offset)
        end

        pass:sphere(handPosition, .1)
    end

    for _, box in ipairs(boxes) do
        local isGrabbed = (
            (grabbedBoxes["hand/left"] ~= nil and grabbedBoxes["hand/left"].box == box)
            or (grabbedBoxes["hand/right"] ~= nil and grabbedBoxes["hand/right"].box == box)
        )

        if isGrabbed then
            pass:setColor(0x00ff00)
        else
            pass:setColor(0xffffff)
        end

        pass:box(box.position, box.dimensions, quat(), 'line')
    end
end

function isPointInsideBox(point, box)
    local relativePoint = point - box.position + (box.dimensions / 2)
    local width, height, depth = box.dimensions:unpack()

    return (
        relativePoint.x > 0 and relativePoint.x < width
        and relativePoint.y > 0 and relativePoint.y < height
        and relativePoint.z > 0 and relativePoint.z < depth
    )
end
```

</details>


Now you should have a working drag'n' drop feature. But we can extend it a bit.

## Rotating boxes

Rotation works analogously to translation – we need to store the "offset" of orientations at the moment of grabbing in order to apply it in each frame relative to hands current orientation.

First, store the orientation of each box:

```lua
local box1 = {
    -- ...
    orientation = lovr.math.newQuat(),
}

local box2 = {
    -- ...
    orientation = lovr.math.newQuat(),
}
```

Fetch hand orientation:

```lua
function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))
        local handOrientation = quat(lovr.headset.getOrientation(hand))

        -- ...
    end

    -- ...
end
```

We'll modify entries into `grabbedBoxes`:

```lua
positionOffset = quat(handOrientation):conjugate() * (handPosition - box.position)
orientationOffset = quat(handOrientation):conjugate() * box.orientation

grabbedBoxes[hand] = {
    box = box,
    positionOffset = lovr.math.newVec3(positionOffset),
    orientationOffset = lovr.math.newQuat(orientationOffset),
}
```

When multiplying a quaternion's conjugate by another quaternion (`box.orientation`) or by a vector (`box.position`), you get an offset relative to the first quaternion's frame of reference – in our case, the frame of reference of the hand at the moment of grabbing.

We can then multiply those offsets by the current orientation of the hand:

```lua
if grabbedBox ~= nil then
    local newPosition = handPosition - handOrientation * grabbedBox.positionOffset
    local newOrientation = handOrientation * grabbedBox.orientationOffset

    grabbedBox.box.position:set(newPosition)
    grabbedBox.box.orientation:set(newOrientation)
end
```

Notice how the position and orientation stay the same, if the hand didn't move:

```lua
newPosition = handPosition - handOrientation * grabbedBox.positionOffset
newPosition = handPosition - handOrientation * quat(handOrientation_0):conjugate() * (handPosition_0 - box.position_0)
newPosition = handPosition - identityQuat * (handPosition_0 - box.position_0)
newPosition = handPosition - (handPosition_0 - box.position_0)
newPosition = handPosition - handPosition_0 + box.position_0
newPosition = zeroVector + box.position_0
newPosition = box.position_0
```

```lua
newOrientation = handOrientation * grabbedBox.orientationOffset
newOrientation = handOrientation * quat(handOrientation_0):conjugate() * box.orientation_0
newOrientation = identityQuat * box.orientation_0
newOrientation = box.orientation_0
```

<details>
<summary>
Whole code
</summary>

```lua
local box1 = {
    position = lovr.math.newVec3(0.5, 1, -0.5),
    dimensions = lovr.math.newVec3(0.3, 0.3, 0.3),
    orientation = lovr.math.newQuat(),
}

local box2 = {
    position = lovr.math.newVec3(-0.5, 1, -0.5),
    dimensions = lovr.math.newVec3(0.5, 0.5, 0.5),
    orientation = lovr.math.newQuat(),
}

local boxes = { box1, box2 }

local grabbedBoxes = {
    ["hand/left"] = nil,
    ["hand/right"] = nil,
}

function lovr.draw(pass)
    for i, hand in ipairs(lovr.headset.getHands()) do
        local handPosition = vec3(lovr.headset.getPosition(hand))
        local handOrientation = quat(lovr.headset.getOrientation(hand))

        local wasPressed = lovr.headset.wasPressed(hand, 'trigger')

        if wasPressed then
            for _, box in ipairs(boxes) do
                if isPointInsideBox(handPosition, box) then
                    local positionOffset = quat(handOrientation):conjugate() *
                        (handPosition - box.position)
                    local orientationOffset = quat(handOrientation):conjugate() * box.orientation

                    grabbedBoxes[hand] = {
                        box = box,
                        positionOffset = lovr.math.newVec3(positionOffset),
                        orientationOffset = lovr.math.newQuat(orientationOffset),
                    }
                end
            end
        end

        local wasReleased = lovr.headset.wasReleased(hand, 'trigger')

        if wasReleased then
            grabbedBoxes[hand] = nil
        end

        local grabbedBox = grabbedBoxes[hand]

        if grabbedBox ~= nil then
            local newPosition = handPosition - handOrientation * grabbedBox.positionOffset
            local newOrientation = handOrientation * grabbedBox.orientationOffset

            grabbedBox.box.position:set(newPosition)
            grabbedBox.box.orientation:set(newOrientation)
        end

        pass:sphere(handPosition, .1)
    end

    for _, box in ipairs(boxes) do
        local isGrabbed = (
            (grabbedBoxes["hand/left"] ~= nil and grabbedBoxes["hand/left"].box == box)
            or (grabbedBoxes["hand/right"] ~= nil and grabbedBoxes["hand/right"].box == box)
        )

        if isGrabbed then
            pass:setColor(0x00ff00)
        else
            pass:setColor(0xffffff)
        end

        pass:box(box.position, box.dimensions, box.orientation, 'line')
    end
end

function isPointInsideBox(point, box)
    local relativePoint = point - box.position + (box.dimensions / 2)
    local width, height, depth = box.dimensions:unpack()

    return (
        relativePoint.x > 0 and relativePoint.x < width
        and relativePoint.y > 0 and relativePoint.y < height
        and relativePoint.z > 0 and relativePoint.z < depth
    )
end
```

</details>

Now you should have a working drag and drop with rotation!
