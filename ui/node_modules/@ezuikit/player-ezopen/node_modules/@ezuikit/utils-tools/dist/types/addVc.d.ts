/**
 * 获取SDK支持的视频编码
 * @example
 * ```
 * getVC() // 1
 * ```
 */
export declare const getQueryVC: (CODECS: string[]) => number;
/**
 * 接受一个URL和一个可选的“vc”参数，并返回带有“vc”的URL` 添加或更新了参数。
 * @param {string} url url 地址
 * @param {string[]} codecs 支持的编码格式
 * @returns {string}
 *
 * @example
 * ```ts
 * addVc("https://open.y7.com/xxxxxx.m3u8?a=111", ["h264", "h265"])  // https://open.y7.com/xxxxxx.m3u8?a=111&vc=3
 * ```
 */
export declare function addVc(url: string, codecs?: string[]): string;
