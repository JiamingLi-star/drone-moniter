import { type Response } from './fetch';
/**
 * 获取单个设备信息接口：https://open.ys7.com/help/672?h=/api/lapp/device/info
 */
export interface DeviceInfoRes {
    deviceSerial: string;
    deviceName: string;
    localName: string;
    /** 设备型号 */
    model: string;
    /** 在线状态 0-不在线，1-在线 */
    status: 0 | 1;
    defence: number;
    /** 是否加密 有延时 */
    isEncrypt: 0 | 1;
    /** 告警声音模式：0-短叫，1-长叫，2-静音 */
    alarmSoundMode: 0 | 1 | 2;
    /** 设备下线是否通知：0-不通知 1-通知 */
    offlineNotify: 0 | 1;
    category: string;
    parentCategory: string;
    updateTime: string;
    netType: string;
    signal: string;
    /** 设备风险安全等级，0-安全，大于零，有风险，风险越高，值越大 */
    riskLevel: number;
    netAddress: string;
}
export interface DeviceInfoBody {
    accessToken: string;
    deviceSerial: string;
}
/**
 * @description 获取单个设备信息
 *
 * 获取单个设备信息接口：https://open.ys7.com/help/672
 *
 * @param {DeviceInfoBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<Response<DeviceInfoRes>>}
 */
declare function getDeviceInfo(body: DeviceInfoBody, domain?: string): Promise<Response<DeviceInfoRes>>;
export default getDeviceInfo;
