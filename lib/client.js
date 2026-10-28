/**
 * dsh-pixelwhale 客户端半区。
 *
 * 当 DSH 思考中，页面出现 `[data-chat-running="true"]` 状态行（文字「深度求索中…」/「Deep diving…」）时：
 *   1) 用 CSS 精灵图接管原生鲸鱼图标（[class*="runningIcon"]）的背景，循环播放「喷水 + 摆尾」；
 *   2) 用像素字体渲染原生状态文字，保留原生语言/内容/秒数及更新逻辑；
 *   3) 给整行叠加一道从左扫到右的高光。
 *
 * 为什么不用 Canvas 自绘：思考行的文字由 React 每秒重写（计时器），任何插进文本节点里的
 * 子节点都会被 React 的 textContent 更新抹掉，动画因此反复从第 0 帧重启。改成纯 CSS 背景动画后，
 * 不往 React 的树里插任何节点，动画状态由 UA 维护，重渲染不受影响。
 *
 * 来源：
 *   - 状态行：[data-chat-running="true"]（DSH NEXT 的思考行标记属性）。
 *   - 鲸鱼帧：ccch1mneyyy/dsh-TUI（dsh-ui-whale，原作者 @lhh010）手绘 40x25 帧，
 *     保留 standard 原帧、喷水（spout1-20）与摆尾（tail1-32），6 色调色板。
 *   - 像素字体：Fusion Pixel 12px（TakWolf/fusion-pixel-font，SIL OFL-1.1），
 *     子集化 WOFF2：拉丁（ASCII 可打印）+ 简体中文（深度求索中 + 用时/分秒 + …）。
 *
 * 授权：字体 OFL-1.1（见 FONT-LICENSE-OFL.txt）；鲸鱼帧遵循 dsh-TUI/dsh-ui-whale 源仓库许可。
 * 约束：不修改原生文本节点；计时 span（aria-hidden="true"）保持原生字体；不重建状态行。
 */
window.__ModuleLoader__.load({
	id: "dsh-pixelwhale",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;

		var FONT_LATIN_B64 = "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";
		var FONT_ZH_B64 = "d09GMk9UVE8AAASsAAwAAAAACjwAAARgAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYpdGyAGYACBFAE2AiQDIAQGBYQUByAXJBggG2gJEdWaGuCLAxucp5YUwhWLwVPvKAvOKGLTcZhjxAi+xro9/1Hu/XOTFHAqPNXQ1E+O4gRxmDRBaylU4VKy2UnwFi1d6ibd7QuZSWlCR0gkymGRIDGOrhxKjty7zP4Dff2JCSQp4HHnjDs3/gALldoffwh/fLHcCRbivXzn7rvn8KdzW19r4wdrWSB5Ivfv7q+5w7kxTXRt70XhWEY9j9Ix3DMpa2IeQTDQhoTPz3lXUB9943LoEPMzhsehjXbUn3G0eK1IMnl11KoxX04zgzGRoY2bd4AmNCo+Jb+qvmVErU4MU1Sm1yXljrS/BatE81hYSGD4SJA6NXEkOCUweUSiU4cSLSkJvaEhqT1JwYGe5FRNCE9EciAL03cEjqSmqpOAaJ/RbJgwELRgJVq2s274QbX0hXmyd17Jf4sBsd9x9Gv81614EXhICpNtmJ50K8ksuy8fdPTa8Ht015UUiEyUFGODUSfzCZZ0aDJtPR6/WaI/8VZkO4FE9CueZdyAlueXBiDRUG68zcVuCKJjBkN1LKNEAZhzpRtpU7e0VQRYnUze2MXTEtLVCsEFMQiZkdpBMKPEKGFvk5pdAZz0zUmDSdFZkGGTYyOVThoVQYUb98i8HyEuQNaAqSn91W149XstfOwUBOaqGB5AlIOzyUJMmznqTWtRdJHdx7VTMFQrkyWtC3rJLjKNq9NFKJisK5PHAeNXEqnF2INFMQkiHXt7WhACdWnCYKtHCUY1SIGV4ozDAuiUpMzZAFpXqxJY2L42uFzGMSp2DbLaJwVmg89W2gIKp9gwG3yopIosl0hVL5SEoRtEhblI4iY62FfUcJ4aS6NevhBS95NaGtqCwVHaGwclg4QdxJIUSWgapcIYhc9uoi7M2Riqm0nqrFKYpY5IjPRosMFwZ7kXjJP8irlUqJhVqNvIL6NDOV8YI/mxEEKiAIL9jnPJ+JrgvRRvcUVuimaBflbjBLbRUK3/6hoEQB+OnFFyanYxdCEAYHsbAABcnKfj0ILAZ3ZzC0tqCpiuZZ2pPK6v6c1/9IZalltnD/VEOgIgAGDlfDcAiQFLLZdb9kpaewWmXu7IFIchHg1XPU4Pe+21lqXnrWf2vX36dv83zCdYTGvzN29n/vhvfuf7TbrYeMri7XPS/uW3N/L5TwyEj4r2X7l/36oziV68cXEbAP4/+wi6aOucz2yW+e9nAMCl7TN4DIDF0ikpKC4jLaCH9JKf53+GfDABoINKHCT0ADQCP0SI1jjEYIxzQxyNrg8JZGc8pAXLHuXaup/qRZI+/SYM6tCm3TDJRxNfUiC1QIECSMUadCnTp1urHdnDelO/IZFUVIatGsfsSk3D6/TwlWrEkA59ekn5Ooxr0U3SCNRvXKMczMtYaVK7OnlDCOEhhVq0GTnaYDC28YpmRbNiMsVWilUdVUJ7KCWtjFj2T5PfLeS64jTWvxRGjs+c22fQ7HICuNy4evTqt16Wrboby3vgTOsCNkXFcwA=";

		// 鲸鱼精灵图：84 帧横向排开。帧序已经按 SEQUENCE 把停留帧展开成重复帧，
		// 因此动画可以用等步长的 steps() 播放，不需要 JS 计时器。
		var WHALE_SPRITE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACdgAAAAUCAYAAACUR82nAAAEfUlEQVR42u3dAW6bMABAUQ6xM+w4O8NusBv2Lj0JE6tSIYaJbWyD8ftSVCnN8jAB3KxWM02SJElSoeZ5npevH59fX9e97ns95inunrm2a7jvxlPLHNGVJEmSJEmSJEmSJEmShuloAVZLs4V9hRvzvDXskdyjxYRbs+TCs9FcSZIkSZIkSZIkqXg/fv6euVwul8vl9ukuC1RSFgKVcNderF3KXd9auFsr1u7Vdf7Wc1PO09BjueXso8c4nrlcLpfL5Rozt0eX+dzrxUiNeF1mm4eNlek15bo2crlcbgfugv76M89HeI0N43K5XC6X27ebusjNeO1nLreFe3Zh35nxnlnY5/XlcrlcLncc177m1nBHMZeuOm+5z3ZHnBPMhVxzIZPLta+5XC43Aw7hMRvG5XK5XC6Xy+VyuSO7pRb25Yy3xMI+ry+Xy+Vyue1c+5pbwx3FvNK96nrBffZ1mf1lH32f259r/jX/cs0JXC6X+8hr5RpeA8vXdxvF5XK5XC6Xy+Vyudzr3JIL+1LHW2phn9eXy+VyuaO5e/b6/pZj5s5Vf+n99ON5tHN3z4z55Q7XcWU+uo97dAxvba7jyjXLewXzkX3N5XK5h/AL2buPy+VyuVwul8vlcrljuymL+kL/Jne8pRcUen25XC6XO5Ib+k/oK8b8ZNfxPNvHFRf2hY7jFtcLx/Lz9rV5oZ2bYtvPrh3mX/OCfc3lcrkV3b0Hht50pWzAu8FyuVwul8vlcrlcLpfL5XK5XC6Xy+W2dnNMLtd5dB83x+ZynUdcLpfL5XKz3Rg0d+Nz39xwuVwul8vlcrlcLpfL5XK5XC6Xy+U+zU01uX25zqN2bqrN7ct1HnG5XC6Xy72Vm4qm/NBU8k0Kl8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5zdzQ59XnrvLbPtfRCkAul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XLv6k5n0e0qv5Kfg8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XO5V7u5KvNATn131x+VyuVwul8vlPs0tfeM6rrhcLpfL5XK5XC6Xy+VyuVwul8vlcrn3cavCKZ+Hy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlc7p3c3b9IEeodsr1vOojL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+Vyudw7u9P6M2VTisG5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vt1f3GPz7nf7cz+HoQh382j8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK53A7c//DYDQit7otGuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfLvbn7jcdswOt7e59HmztoLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+Vy7+oGV/mFbus/lbd343K5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwut1f3L4OKxfQKiyrjAAAAAElFTkSuQmCC";
		var FRAME_COUNT = 84;
		var DISP_W = 30;
		var DISP_H = 20;
		var CYCLE_MS = 5460;
		var SHEET_W = DISP_W * FRAME_COUNT;

		var css = [
			'@font-face {',
			'  font-family: "PixelWhaleFont";',
			'  src: url(data:font/woff2;base64,' + FONT_LATIN_B64 + ') format("woff2");',
			'  font-weight: 400;',
			'  font-style: normal;',
			'  unicode-range: U+0020-007E;',
			'}',
			'@font-face {',
			'  font-family: "PixelWhaleFont";',
			'  src: url(data:font/woff2;base64,' + FONT_ZH_B64 + ') format("woff2");',
			'  font-weight: 400;',
			'  font-style: normal;',
			'  unicode-range: U+00B7, U+2026, U+2027, U+30FB, U+4E2D, U+5206, U+5EA6, U+65F6, U+6C42, U+6DF1, U+7528, U+79D2, U+7D22, U+FF0C;',
			'}',

			// ---- 鲸鱼：接管原生图标的背景，不插任何 DOM ----
			'[data-chat-running="true"] [class*="runningIcon"] {',
			'  display: inline-block !important;',
			'  width: ' + DISP_W + 'px !important;',
			'  height: ' + DISP_H + 'px !important;',
			'  flex: none !important;',
			'  overflow: visible !important;',
			'  background-image: url("' + WHALE_SPRITE + '") !important;',
			'  background-repeat: no-repeat !important;',
			'  background-size: ' + SHEET_W + 'px ' + DISP_H + 'px !important;',
			'  background-position: 0 0 !important;',
			'  image-rendering: pixelated;',
			'  animation: dsh-pixelwhale-frames ' + CYCLE_MS + 'ms steps(' + FRAME_COUNT + ') infinite !important;',
			'}',
			// 原生图标内部自带的遮罩层 / SVG 全部让位
			'[data-chat-running="true"] [class*="runningWhale"],',
			'[data-chat-running="true"] [class*="_decoration_"] {',
			'  display: none !important;',
			'}',
			'@keyframes dsh-pixelwhale-frames {',
			'  from { background-position: 0 0; }',
			'  to { background-position: -' + SHEET_W + 'px 0; }',
			'}',

			// ---- 高光：一道亮带从左扫到右，扫完停一拍再扫 ----
			'[data-chat-running="true"] { position: relative; }',
			'[data-chat-running="true"]::after {',
			'  content: "";',
			'  position: absolute;',
			'  top: 0;',
			'  bottom: 0;',
			'  left: 0;',
			'  width: 45%;',
			'  pointer-events: none;',
			'  z-index: 3;',
			'  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%);',
			'  animation: dsh-pixelwhale-sheen 2.6s linear infinite;',
			'}',
			'@keyframes dsh-pixelwhale-sheen {',
			'  0% { transform: translateX(-120%); }',
			'  55% { transform: translateX(260%); }',
			'  100% { transform: translateX(260%); }',
			'}',

			// ---- 文字：只换字体，内容、语言、秒数与更新逻辑全交给原生 ----
			// 字号不覆盖（--dsh-content-font-size 随 ui-theme.fontSize 变化，跟原生保持一致）。
			'[data-chat-running="true"] [class*="_content_"] { position: relative; z-index: 2; }',
			'[data-chat-running="true"] [class*="_text_"],',
			'[data-chat-running="true"] [class*="runningText"] {',
			'  font-family: "PixelWhaleFont", monospace !important;',
			'}',

			// ---- 无障碍：系统要求减少动效时回到静态帧 ----
			'@media (prefers-reduced-motion: reduce) {',
			'  [data-chat-running="true"] [class*="runningIcon"] {',
			'    animation: none !important;',
			'    background-position: 0 0 !important;',
			'  }',
			'  [data-chat-running="true"]::after { display: none !important; }',
			'}',
		];

		var styleTag = null;

		// 运行期只做一件事：往 <head> 里塞一个 <style>，然后什么都不做。
		//
		// 这里刻意没有 MutationObserver、没有轮询扫描、没有任何 DOM 写入。
		// 旧版在 observer 回调里改写探针文本，这个写入又被自己的 observer 看到，
		// 于是每帧（60fps）重跑一次 scan：全文 createTreeWalker + getComputedStyle
		// + getBoundingClientRect 的高频原生分配让渲染进程一路涨到 GB 级，最终 OOM。
		// 现在鲸鱼动画、高光、像素字体全部由 CSS 按属性选择器命中（[data-chat-running="true"]），
		// 不依赖任何运行时节点，React 怎么重渲染都不影响，也不产生任何持续性开销。
		function start() {
			if (typeof document === 'undefined') return function () {};
			if (!document.querySelector('style[data-plugin-css="dsh-pixelwhale"]')) {
				styleTag = document.createElement('style');
				styleTag.dataset.pluginCss = 'dsh-pixelwhale';
				styleTag.textContent = css.join('\n');
				document.head.appendChild(styleTag);
			}
			return function () {
				if (styleTag) { styleTag.remove(); styleTag = null; }
				// 兼容旧版遗留的标记类，重载后自然消失
				var px = document.querySelectorAll('.dsh-pixelwhale-pixelized');
				for (var i = 0; i < px.length; i++) px[i].classList.remove('dsh-pixelwhale-pixelized');
			};
		}

		var inject = [];

		function apply(ctx) {
			ctx.effect(function () { return start(); });
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
