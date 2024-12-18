+++
title = "My LÖVR workflow"
date = 2024-12-18
+++

[LÖVR](https://lovr.org/) is a delightful to use VR framework. I find it much easier to start with than the Unity SDK. It is amazing for creating small apps and games very rapidly. In this article I share my setup to make your experience with LÖVR even smoother.

If you don't have a VR headset yet, I suggest getting a [Meta Quest 3S](https://www.meta.com/quest/quest-3s/). However, you don't need a headset to run LÖVR apps – they'll also work on your computer. Although you can't interact with them like you would using a headset, keyboard and mouse could serve as alternative input devices.

The first thing after completing the [Getting Started guide](https://lovr.org/docs/Getting_Started_(Quest)) is setting up a project. None of my projects has gotten very elaborate yet. A bare bones project needs just a `main.lua` file.

## `run.sh`

To simplify reloading code, I also keep a simple script named `run.sh`. It syncs files and restarts the app on the headset:

```bash
for file in *.lua; do
    if [ -f "$file" ]; then
        echo "Pushing $file..."
        adb push --sync "$file" /sdcard/Android/data/org.lovr.app/files/
    fi
done

adb shell am force-stop org.lovr.app
adb shell am start org.lovr.app/org.lovr.app.Activity
```

<small>
You might need to change the file permissions to use it. In your project directory run `chmod +x run.sh`. Then launch by calling `./run.sh`.
</small>

Note that pushing with the `--sync` flag might sometimes omit files, for example if you replace a file with another with the same name but an earlier timestamp. If you run into weird bugs while using this script and you really want to make sure the code running on your headset is up-to-date, call the `push` command without the `--sync` flag.

Make sure to adjust the line `for file in *.lua; do` so that all of your project files are included – fonts, models, textures, etc.


## Going wireless

You can upload new code to your headset over the Wi-Fi instead of via a USB-C cable. To do that, follow [these instructions](https://developers.meta.com/horizon/documentation/native/android/ts-adb/). I find it much more comfortable.

Sometimes you might get an error saying that the device is offline. This might be a result of the headset changing its IP or disabling its TCP/IP interface. To connect again, check your headset's IP either in the headset OS's Wi-Fi menu and run `adb connect <ip>`.

If this doesn't work, try connecting the headset via a cable and enabling the TCP/IP interface again.


## Watching code changes

You can launch the `run.sh` script with [watchdog](https://github.com/gorakhargosh/watchdog/?tab=readme-ov-file#shell-utilities). Watchdog detects when your code changes and runs the specified command.

```bash
watchmedo shell-command -c "./run.sh" -i ".git"
```

<small>Yes, the name of watchdog's command is `watchmedo`.</small>

This way you can keep the headset on your forehead while you edit code and only put it over your eyes after you save. Your app will restart with the newest changes in a couple seconds.

I'm aware of [`lodr`](https://github.com/mcclure/lodr) but it returned some cryptic errors when I tried it 🤷 I think it is not maintained anymore.


## Typing

I personally love typed langugages and typing saves me lots of debugging time. So once my projects get bigger than around 300 LoC, I often want to begin adding type annotations.

Support for type annotations in Lua is surprisingly good for a dynamically typed language. It allows for gradual typing and annotating types defined outside of current project.

The editor I use is [Zed](https://zed.dev/) and I've only got the official Lua extension installed. [Here](https://luals.github.io/wiki/annotations/) you can find the type annotation syntax. Note that unlike a regular comment, they begin with a triple `-`:

```lua
---@param ray { origin: Vec3, direction: Vec3 }
---@param sphere { center: Vec3, radius: number }
---@return number
local function getDistance(ray, sphere)
    -- ...
end

```

Unfortunately I still have not gotten around to figuring out how to import LÖVR type annotations into my projects. I feel like it would be a big improvement. However, using undefined types like `Vec3` in my type annotations is fine with my linter, it only throws a warning.


## Managing packages

I'm relatively new to Lua and I haven't used a package manager yet. Whenever I need an external library like [`json`](https://github.com/rxi/json.lua) or [`fun`](https://github.com/luafun/luafun), I just copy the `.lua` file into my project. I secretly love how outrageous this is 🤷

However, there is an established package manager for Lua – [LuaRocks](https://luarocks.org/). So if you need something more robust, go check it out.

---

That's all for now, I might update this article in the future. Let me know if you have any other tips.

Please also check out my other tutorial [Drag & drop in VR with LÖVR](/drag-and-drop-in-vr-with-lovr/).
