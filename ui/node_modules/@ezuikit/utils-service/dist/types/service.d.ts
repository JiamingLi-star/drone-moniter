import { type PlayRealUrlBody } from './getRealPlayUrl';
import { type VideoByTimeBody } from './getVideoByTime';
import { type RecordCloudVideoByTimeBody } from './getRecordCloudVideoByTime';
import { type VideoByIDBody } from './getVideoByID';
import { type MirrorFlipBody } from './setPtzMirror';
export interface ServiceOptions {
    domain?: string;
    accessToken: string;
    deviceSerial: string;
    extraParams?: {
        ezopenParams?: Record<string, number | string>;
        wsParams?: string | Record<string, number | string>;
    };
}
/**
 * @classdesc ezopen 协议播放相关接口
 * @class Service
 *
 * @example
 *
 * ```ts
 * const service = new Service({
 *    domain: "https://open.ys7.com",
 *    accessToken: "at.4r4n1p535kz3kdeg56k6h4cdd3z147ba-3uuk044uhl-1ecgni4-dpznmvve8",
 *    deviceSerial: "L16120197"
 * })
 *
 * service.getDeviceInfo() // 获取设备信息
 *
 * ```
 *
 */
declare class Service {
    private readonly _options;
    constructor(options: ServiceOptions);
    /**
     * @description 获取设备能力集
     *
     * 能力集接口：https://open.ys7.com/help/678
     *
     * 能力集文档： https://open.ys7.com/help/77?h=%E8%83%BD%E5%8A%9B%E9%9B%86
     *
     *
     * @param {DeviceCapacityBody} body 请求参数
     * @returns
     */
    getDeviceCapacity(): Promise<import("./fetch").Response<import("./getDeviceCapacity").DeviceCapacityRes, undefined>>;
    /**
     * @description 获取单个设备信息
     *
     * 获取单个设备信息接口：https://open.ys7.com/help/672
     *
     * @param {DeviceCapacityBody} body 请求参数
     * @returns
     */
    getDeviceInfo(): Promise<import("./fetch").Response<import("./getDeviceInfo").DeviceInfoRes, undefined>>;
    /**
     * @description 获取直播地址
     * @param body
     * @returns
     */
    getRealPlayUrl(body: Pick<PlayRealUrlBody, 'ezopen'>): Promise<{
        playUrl: string;
        stream: string;
        realUrl: string;
    }>;
    /**
     * @description 根据时间获取存储文件信息 (本地存储和云存储)
     *
     * 根据时间获取存储文件信息: https://open.ys7.com/help/1491
     *
     * @param {VideoByTimeBody} body
     * @returns
     */
    getVideoByTime(body: Omit<VideoByTimeBody, 'accessToken' | 'deviceSerial'>): Promise<import("./fetch").Response<import("./getVideoByTime").VideoFragmentFile[], undefined>>;
    getRecordCloudVideoByTime(body: Omit<RecordCloudVideoByTimeBody, 'accessToken' | 'deviceSerial'>): Promise<import("./fetch").Response<import("./getRecordCloudVideoByTime").RecordCloudVideoFragmentFile[], undefined>>;
    /**
     * @description 根据ID 获取模版主题数据
     * @since 1.0.0
     * @param {string} id theme id
     * @returns
     */
    getThemeDetailById(id: string): Promise<import("./fetch").Response<import("./getThemeDetailById").ThemeDetailRes, undefined>>;
    /**
     * @description 镜像翻转
     * @link https://open.ys7.com/help/59?h=%E9%95%9C%E5%83%8F%E7%BF%BB%E8%BD%AC#device_ptz-api3
     * @param {Omit<PtzMirrorBody, 'accessToken' | 'deviceSerial'>} body 请求体
     *
     * @returns {Promise<any>}
     */
    setMirrorFlip(body: Omit<MirrorFlipBody, 'accessToken' | 'deviceSerial'>): Promise<import("./fetch").Response<any, undefined>>;
    /**
     * @deprecated
     * @param body
     * @returns
     */
    getVideoByID(body: Omit<VideoByIDBody, 'accessToken' | 'deviceSerial'>): Promise<import("./fetch").Response<import("./getVideoByID").VideoByIDRes, undefined>>;
    version: '__VERSION__';
    getVersion(): "__VERSION__";
}
export default Service;
