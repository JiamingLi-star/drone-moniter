/** 播放类型 live/rec  */
export type EzopenType = 'live' | 'rec' | string;
/** 现在仅支持 cloud  */
export type EzopenRecType = 'cloud' | string;
/** 直播的清晰度 */
export type EzopenDefinition = 'sd' | 'hd' | string;
/** ezopen 协议地址 解析后的结果 */
export interface EzopenURL {
    protocol: string;
    search?: string;
    searchParams?: Record<string, string | number>;
    pathname: string;
    origin: string;
    href: string;
    hostname: string;
    /** 设备序列号 */
    deviceSerial: string;
    /** 通道号 */
    channelNo: string;
    /** 验证码 */
    validateCode?: string;
    /** 播放类型 直播 | 回放 */
    type: EzopenType;
    /** 回放存储类型 */
    recType?: EzopenRecType;
    /** 清晰度 */
    definition?: EzopenDefinition;
}
/**
 * 解析ezopen 协议 url
 * @param {string} url ezopen url
 * @returns {EzopenURL}
 *
 * ```ts
 * parseEzopenUrl("ezopen://open.ys7.com/C116331000/1.cloud.rec?a=00000&b=23&c=%E4%BD%A0%E5%A5%BD%E5%95%8A")
 * ```
 */
export declare function parseEzopenUrl(url: string): Partial<EzopenURL>;
/**
 * 切换ezopen 地址配置项
 */
export interface SwitchEzpoenOptions {
    deviceSerial?: string;
    channelNo?: string;
    type?: EzopenType;
    /** 仅 rec */
    recType?: EzopenRecType;
    /** 仅 live */
    definition?: EzopenDefinition;
    search?: string;
    validateCode?: string;
}
/**
 * exopen 协议播放地址切换(search 中值为空会覆盖url中的值并移除这个参数)
 * @param {string} url exopen 协议播放地址
 * @param {SwitchEzpoenOptions} options
 * @returns {string}
 *
 * @example
 * ```ts
 *   switchEzopenUrl('ezopen://open.ys7.com/C11633138/1.hd.live?a=1', {type: 'rec',recType: 'cloud',search: 'b=23&c=123423&a=00000&c=你好啊',definition: 'hd'}) // -> ezopen://open.ys7.com/C11633138/1.cloud.rec?a=00000&b=23&c=%E4%BD%A0%E5%A5%BD%E5%95%8A
 *
 *   switchEzopenUrl('ezopen://open.ys7.com/C11633138/1.hd.live', {type: 'live',recType: 'cloud',search: 'b=23&c=123423', definition: 'sd'}) // -> ezopen://open.ys7.com/C11633138/1.live?b=23&c=123423
 * ```
 */
export declare function switchEzopenUrl(url: string, options?: SwitchEzpoenOptions): string;
