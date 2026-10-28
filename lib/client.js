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
		var FONT_ZH_B64 = "d09GMk9UVE8AAASkAAwAAAAACkAAAARWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYpXGyAGYACBFAE2AiQDLAQGBYQUByAXJBggG24JUZQNSgHgL8np1U31A8uFLcFROGQYPa3TQYQhXcEsevQxxV362/RyENF+v1nM9N4iqsksmiezSIdQaT/TyJBINKkqE+NsRgOT1LaGKDkUsS4tCaXs1vD/kf3z8/D+jT/3vVuLW/MIgxZw8xADDgItSTwO6NN3soHl39vbDJXSI5EpaD5o2ieDyHcD/CuBrD5uKP17Em288A0bH6JL44vw4kN48Rbn/337tbp8zCNVLBKalkCKezvzZc/MIyLaeJRKKIRCugjeaJ2EzRGbX73ZtiJQFDixRDgU5M2YYHLUtqIkLpjDofAD4MfJX7//hb5P+OMIR2f/riXiFeIRHJecYeWXVNZ19o9MLhlTXZDZ1zhc0750+NZUaeS5gjwtXMox9dVLuXVau/Qzmnymp65qND+vfqQmV/219dYMf1GtivT5C3Spvt7UAJDY9wR4F4SjACWaLZ3e8MZ14dit7Z31Ngu5G+Fw8Vq4P/0mLYypf/cedhmnhU3bpjNnn+1T799MSpvGLO6HE8UxZ5t3Tvy4rsfv2PLEV7kmYMM0eZXRTELZl7J8Ll6ys20zy9VQYLMGpAbuo+RNVm/X9dypAGo/Wre8+vYI454ZGIcZOCPrRe4YQQN9p1mNQ6dnDiR0WrgIprGGihs3iWKHU86HIHhTlsisaVoyJjXUe0BctAzzqhQtYeOQ3YROsA0SlL5TRtNm4T7LD9iT5nS9Yk+/Shf3ayvkz6RlymCUGiK1HnuqUUmCSFbvT8YEWJZwUtsoYUSUgZVxZtca6DTkbDkAHXs2ATv7z2Jclv2ETVR2yQDmwEctw4CCFjteR85ND4HmBlZNdhAw9IHYMC9J3FQfzBUdkodEXnrzIOT0kzXNd2Bwz/XZADOMcQndGUiDJmUhGIvN2T3uBdhBDHXrKSerDLOciCDIn46Yg3TmudmakFcoZcWEW2hMU0QHPF+7IuQxl7Ljrboog3mHXiK+VnSR8JY2cl8dC5ZnpAFsS2Fb/1W3cAhwEyGKzEtrLwgOgP8AYJ9nMqPhgKyeiBfZDew6TcGHVxRC67Z8A/4+cBxECAjAbq07IIYdWps9D6gaqaMONlqP4MOeB9uSzbdB1O00dMTPqace69y1K/3zk2qsKOlv7n+grjcn4Gos8sl9QTn67Ci3/oAgBNFK+8DmdXAnqPQVUR3OAXfXDQC4b/8f/qWuPoA9u5kYLcxQJjQ2tqR2Hg3Z7Xx859ZpQ/LySzoBvIGzPmCSrsAYgDwlSo1N2fFyOmVvzGHKQWt4TTkKCA93GvupaRpFJW0VaUkpNSwpxvHEUIZSGWL0CstyKspJ6IE+raUlVUrZVLOo1dl0iY0/XiePp15dVVpRAUuntJa4HBaLmtUa0VR8mcuyLiXIwzPmV1nEJdXvh1VWWyjqFnWLlhIdJKo6VYSufFm8pug+PcvfA1h1yzZ2P4o0GJCFV7Ll8EP78ec3G5cCCGKWH2X8XgTOqPoGAAAA";

		// 鲸鱼精灵图：84 帧横向排开。帧序已经按 SEQUENCE 把停留帧展开成重复帧，
		// 因此动画可以用等步长的 steps() 播放，不需要 JS 计时器。
		var WHALE_SPRITE = "data:image/png;base64,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";
		var FRAME_COUNT = 84;
		var DISP_W = 34;
		var DISP_H = 23;
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
			// 注意：这里绝对不能写 !important。CSS 层叠里动画的优先级高于普通作者声明、
			// 但低于带 !important 的作者声明 —— 一旦 background-position 被标成 important，
			// 下面那条 animation 就永远改不动它，鲸鱼会定格在第 0 帧。
			'  background-position: 0 0;',
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

			// ---- 高光：只作用在文字字形上（背景裁切到字形内部），整行和文字块都不受影响 ----
			'[data-chat-running="true"] [class*="_text_"],',
			'[data-chat-running="true"] [class*="runningText"] {',
			'  background-image: linear-gradient(100deg,',
			'    currentColor 0%, currentColor 38%,',
			'    rgba(255,255,255,0.95) 50%,',
			'    currentColor 62%, currentColor 100%);',
			'  background-size: 300% 100%;',
			'  background-repeat: no-repeat;',
			'  -webkit-background-clip: text;',
			'  background-clip: text;',
			'  -webkit-text-fill-color: transparent;',
			'  animation: dsh-pixelwhale-sheen 2.6s linear infinite;',
			'}',
			'@keyframes dsh-pixelwhale-sheen {',
			'  0% { background-position: 100% 0; }',
			'  60% { background-position: 0% 0; }',
			'  100% { background-position: 0% 0; }',
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
			'  [data-chat-running="true"] [class*="_text_"],',
			'  [data-chat-running="true"] [class*="runningText"] {',
			'    animation: none !important;',
			'    background-image: none !important;',
			'    -webkit-text-fill-color: currentColor !important;',
			'  }',
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
			// 临时诊断（验证完删除）：回答两个问题——鲸鱼动画到底有没有在推进？
			// React 每秒重写计时文字时，是否连鲸鱼图标节点一起重建（那样 CSS 动画会每秒归零）。
			// 结果写在 <html data-pw-diag>，每个 500ms 写一次属性，最多 480 次（4 分钟）后自停。
			var diagTicks = 0;
			var diagSeen = 0;
			var diagRowChanges = 0;
			var diagIconChanges = 0;
			var diagPositions = {};
			var diagPrevRow = null;
			var diagPrevIcon = null;
			var diagTimer = setInterval(function () {
				diagTicks++;
				var row = document.querySelector('[data-chat-running="true"]');
				var icon = row ? row.querySelector('[class*="runningIcon"]') : null;
				if (row) {
					diagSeen++;
					if (row !== diagPrevRow) diagRowChanges++;
					if (icon !== diagPrevIcon) diagIconChanges++;
					if (icon) {
						var pos = window.getComputedStyle(icon).backgroundPosition;
						diagPositions[pos] = (diagPositions[pos] || 0) + 1;
					}
				}
				diagPrevRow = row;
				diagPrevIcon = icon;
				var keys = Object.keys(diagPositions);
				document.documentElement.setAttribute('data-pw-diag',
					'seen=' + diagSeen +
					' rowChg=' + diagRowChanges +
					' iconChg=' + diagIconChanges +
					' pos=' + keys.length +
					' last=' + (keys.length ? keys[keys.length - 1] : '-'));
				if (diagTicks >= 480) clearInterval(diagTimer);
			}, 500);

			return function () {
				clearInterval(diagTimer);
				document.documentElement.removeAttribute('data-pw-diag');
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
