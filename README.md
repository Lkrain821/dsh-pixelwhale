# PixelWhale 🐋

深度求索时，派一只像素蓝鲸为你喷水摆尾。

A DSH (DeepSeek Harness) web UI plugin: when the model is thinking, the native
「深度求索中...」/ "Deep diving..." status turns into a **pixel font** and a
**pixel-art DeepSeek blue whale** appears beside it, spouting and wagging its tail.

## Features

- 🐋 **Animated pixel whale** — official DeepSeek blue-whale sprite (40×25, 6-tone
  palette), looping a spout + tail-wag sequence.
- 🔤 **Real pixel font** — [Fusion Pixel 12px](https://github.com/TakWolf/fusion-pixel-font)
  rendered for the status text, subsetted and embedded as WOFF2 (works offline).
- 🎯 **Non-invasive** — only decorates the `[role="status"]` thinking bar; the
  native language, content, timer and update logic are untouched. The timer span
  keeps its original font.

## Install

```bash
dsh plugin --profile desktop add https://github.com/Lkrain821/pixelwhale
```

Then restart DSH.

## How it works

- The host half (`lib/index.js`) is a client-only cosmetics entry — it just mounts
  the bundle and exposes the browser half via `exports["./client"]`.
- The client half (`lib/client.js`) observes `[role="status"]` for the "深度求索中"
  / "Deep diving" text, injects a Canvas whale, and applies `@font-face` pixel fonts
  scoped with `unicode-range`.

## Font license

The embedded pixel font is [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font),
licensed under **SIL Open Font License 1.1 (OFL-1.1)**. See `FONT-LICENSE-OFL.txt`.
Font copyright belongs to TakWolf (https://takwolf.com) and upstream font authors.

The whale sprite frames are derived from
[dsh-TUI / dsh-ui-whale](https://github.com/ccch1mneyyy/dsh-TUI), courtesy of @lhh010.

## License

MIT (see `package.json`). The bundled font carries its own OFL-1.1 license.
