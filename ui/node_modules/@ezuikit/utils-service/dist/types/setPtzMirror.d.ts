export interface MirrorFlipBody {
    accessToken: string;
    deviceSerial: string;
    /** 镜像方向：0-上下, 1-左右, 2-中心 , 和设备报备的能力集有关，即使设备支持，但是没有报备也一样不支持 */
    command: 0 | 1 | 2;
    channelNo: number;
}
/**
 * @description 镜像翻转 (需要设备本身支持， 可以重能力集中获取)
 * @link https://open.ys7.com/help/59?h=%E9%95%9C%E5%83%8F%E7%BF%BB%E8%BD%AC#device_ptz-api3
 * @param {MirrorFlipBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<any>}
 */
declare function setMirrorFlip(body: MirrorFlipBody, domain?: string): Promise<import("./fetch").Response<any, undefined>>;
export default setMirrorFlip;
