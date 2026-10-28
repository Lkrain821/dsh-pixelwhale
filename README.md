# PixelWhale 🐋

深度求索时，派一只像素蓝鲸为你喷水摆尾。

A DSH (DeepSeek Harness) web UI plugin: while the model is thinking, the native
「深度求索中...」/ "Deep diving..." row gets a **pixel font** and a **pixel-art
DeepSeek blue whale** that spouts water and wags its tail, plus a highlight that
sweeps across the whole row.

## Features

- 🐋 **Animated pixel whale** — official DeepSeek blue-whale frames (40×25, 6-tone
  palette), serialized into a single sprite sheet and played with a CSS `steps()`
  animation: `standard → spout1-20 → tail1-32 → standard` (84 frames, 5.46s loop).
- ✨ **Sweeping highlight** — a soft light band travels across the thinking row.
- 🔤 **Real pixel font** — [Fusion Pixel 12px](https://github.com/TakWolf/fusion-pixel-font)
  for the status text, subsetted and embedded as WOFF2 (works offline).
- 🎯 **Non-invasive** — only decorates the native thinking row
  (`[data-chat-running="true"]`); language, content, timer and update logic are
  untouched, and the text size follows your theme font size.
- 🪶 **Zero idle cost** — the client half injects one `<style>` element and does
  nothing else: no `MutationObserver`, no timers, no DOM writes, no per-frame JS.

## Install

```bash
dsh plugin --profile desktop add https://github.com/Lkrain821/dsh-pixelwhale
```

Then restart DSH.

## How it works

- The host half (`lib/index.js`) is a client-only cosmetics entry — it mounts the
  bundle and exposes the browser half via `exports["./client"]`.
- The client half (`lib/client.js`) appends a single `<style>` tag on mount. Every
  visual effect is pure CSS keyed off the native row attribute
  `[data-chat-running="true"]`:
  - the whale takes over the native icon's background (`background-image` +
    `background-position` driven by `steps(84)`), so React re-rendering the timer
    text cannot reset or wipe it;
  - the status text is switched to the embedded pixel font through
    `@font-face` + `unicode-range`;
  - the highlight is a `::after` gradient sweep.
- Because nothing is observed and nothing is written after mount, the plugin adds
  no ongoing work to the renderer — an earlier Canvas-injecting design that polled
  the DOM was removed for exactly this reason.

## Font license

The embedded pixel font is [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font),
licensed under **SIL Open Font License 1.1 (OFL-1.1)**. See `FONT-LICENSE-OFL.txt`.
Font copyright belongs to TakWolf (https://takwolf.com) and upstream font authors.

The whale sprite frames are derived from
[dsh-TUI / dsh-ui-whale](https://github.com/ccch1mneyyy/dsh-TUI), courtesy of @lhh010.

## License

MIT (see `package.json`). The bundled font carries its own OFL-1.1 license.
