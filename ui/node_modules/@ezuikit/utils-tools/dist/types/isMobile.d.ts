/**
 * 判断是不是移动端（包括pad）
 *
 * `__IS_MOBILE_SIMULATOR__` 为了解决在 PC 端模拟移动端时判断为移动端
 *
 * @param {string} agent
 * @returns {boolean}
 */
export declare function isMobile(agent?: string): boolean;
/**
 * 判断是真正的移动端（不包括pad）
 * @returns
 */
export declare const isRealMobile: (agent?: string) => boolean;
