/**
 * PixelWhale 宿主半区。
 *
 * 纯客户端外观插件：宿主侧只负责让包以 cordis bundle 行挂载（loader entry），
 * 从而被 client-modules 扫描到 exports["./client"]，把浏览器半区打进 Web 清单。
 * 与 @dsh-plugin/dsh-thought-buddy 的宿主半区同构。
 */
export const name = 'dsh-pixelwhale';

export function apply(ctx) {
	ctx.logger?.debug?.('[dsh-pixelwhale] host half loaded (client-only cosmetics)');
}
