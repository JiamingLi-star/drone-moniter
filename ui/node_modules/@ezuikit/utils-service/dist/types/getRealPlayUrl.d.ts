export interface PlayRealUrlBody {
    accessToken: string;
    ezopen: string;
}
/**
 * @description 获取ezopen 真实播放地址
 *
 * @param {PlayRealUrlBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<string>}
 */
declare function getRealPlayUrl(body: PlayRealUrlBody, domain?: string): Promise<import("./fetch").Response<string, {
    token: string;
}>>;
export default getRealPlayUrl;
