# PixelWhale 🐋

深度求索时，派一只像素蓝鲸为你喷水摆尾。

A DSH (DeepSeek Harness) web UI plugin: while the model is thinking, the native
「深度求索中…」/ "Deep diving…" status row becomes a **pixel-art DeepSeek blue whale**
spouting and wagging its tail, next to the same status text rendered in a **pixel
font** with a glyph-level shimmer.

## Features

- 🐋 **Animated pixel whale** — the hand-drawn DeepSeek blue-whale art (40×25 grid,
  6-tone palette), expanded into an 84-frame spout + tail-wag loop, downsampled to
  27×18 and painted as a CSS sprite sheet (`steps()` animation).
- 🔤 **Real pixel font** — [Fusion Pixel 12px](https://github.com/TakWolf/fusion-pixel-font),
  subsetted to exactly the characters the status row uses (ASCII + the Chinese
  glyphs + a narrowed middle dot), embedded as WOFF2 so it works offline.
- ✨ **Glyph-level shimmer** — the moving highlight is clipped to the text glyphs
  (`background-clip: text`), so it travels across the strokes instead of the row.
- 📐 **Sits on the text baseline** — `align-items: baseline` on the status row puts
  the bottom of the whale on the same line as the bottom of the glyphs, hugging the
  text on its left.
- 🎯 **Non-invasive** — the native text node, language, timer and update logic are
  untouched; only CSS is applied to the thinking row.
- 🪶 **Zero runtime overhead** — no `MutationObserver`, no polling, no timers, no
  DOM writes after setup. The client half injects a single `<style>` element and
  nothing else runs, so there is no per-frame work and no memory growth while
  streaming.

## Install

From the DSH plugin market, or:

```bash
dsh plugin --profile desktop add https://github.com/Lkrain821/dsh-pixelwhale
```

Then restart DSH.

## How it works

- The host half (`lib/index.js`) is a client-only cosmetics entry — it just mounts
  the bundle and exposes the browser half via `exports["./client"]`.
- The client half (`lib/client.js`) injects one `<style>` element containing:
  - `@font-face` rules for the subsetted pixel font, scoped with `unicode-range`;
  - a sprite-sheet `background-image` + `@keyframes` on the native whale icon
    (`[data-chat-running="true"] [class*="runningIcon"]`), which replaces the
    shipped whale drawing without inserting any node;
  - `background-clip: text` shimmer and the pixel font on the status text;
  - `align-items: baseline` on `runningContent` so the whale bottom lines up with
    the text baseline;
  - a `prefers-reduced-motion: reduce` fallback that pins the first frame and drops
    the shimmer.

Everything is keyed on the `[data-chat-running="true"]` attribute DSH puts on the
thinking row, so the whole effect appears and disappears with that row.

Verified against DSH 2.0.20-next. Selectors are attribute/substring based
(`data-chat-running`, `runningIcon`, `runningContent`, `runningText`) rather than
hashed CSS-module names, so they tolerate ordinary client rebuilds.

## Font license

The embedded pixel font is [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font),
licensed under **SIL Open Font License 1.1 (OFL-1.1)**. See `FONT-LICENSE-OFL.txt`.
Font copyright belongs to TakWolf (https://takwolf.com) and upstream font authors.

The whale frames are derived from the DeepSeek blue-whale art used by
[dsh-TUI / dsh-ui-whale](https://github.com/ccch1mneyyy/dsh-TUI), courtesy of @lhh010.

## License

MIT (see `package.json`). The bundled font carries its own OFL-1.1 license.
