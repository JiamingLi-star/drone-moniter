export interface VideoByIDBody {
    accessToken: string;
    deviceSerial: string;
    alarmId: string;
    channelNo: string;
}
export interface VideoByIDRes {
    recType: number;
}
/**
 * @description alarmId
 * @deprecated
 *
 * @param {VideoByIDBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<VideoByIDRes>}
 */
declare function getVideoByID(body: VideoByIDBody, domain?: string): Promise<import("./fetch").Response<VideoByIDRes, undefined>>;
export default getVideoByID;
