import { type Response } from './fetch';
/**
 * https://open.ys7.com/help/77?h=%E8%83%BD%E5%8A%9B%E9%9B%86
 */
export interface DeviceCapacityRes {
    support_cloud: string;
    support_intelligent_track: string;
    support_p2p_mode: string;
    support_resolution: string;
    support_talk: string;
    video_quality_capacity: Array<{
        streamType: string;
        videoLevel: string;
        resolution: string;
        videoBitRate: string;
        maxBitRate: string;
    }>;
    support_wifi_userId: string;
    support_remote_auth_randcode: string;
    support_upgrade: string;
    support_smart_wifi: string;
    support_ssl: string;
    support_weixin: string;
    ptz_close_scene: string;
    support_preset_alarm: string;
    support_related_device: string;
    support_message: string;
    ptz_preset: string;
    support_wifi: string;
    support_cloud_version: string;
    ptz_center_mirror: string;
    support_defence: string;
    ptz_top_bottom: string;
    support_fullscreen_ptz: string;
    support_defenceplan: string;
    support_disk: string;
    support_alarm_voice: string;
    ptz_left_right: string;
    support_modify_pwd: string;
    support_capture: string;
    support_privacy: string;
    support_encrypt: string;
    support_auto_offline: string;
}
export interface DeviceCapacityBody {
    accessToken: string;
    deviceSerial: string;
}
/**
 * @description 获取设备能力集
 *
 * 能力集文档： https://open.ys7.com/help/77?h=%E8%83%BD%E5%8A%9B%E9%9B%86
 *
 * 能力集接口：https://open.ys7.com/help/678
 *
 * @param {DeviceCapacityBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<Response<DeviceCapacityRes>>}
 */
declare function getDeviceCapacity(body: DeviceCapacityBody, domain?: string): Promise<Response<DeviceCapacityRes>>;
export default getDeviceCapacity;
