import { type Response } from './fetch';
/**
 * https://open.ys7.com/help/1491
 */
export interface VideoByTimeBody {
    accessToken: string;
    /** 回放源，0-系统自动选择，1-云存储，2-本地录像。非必选，默认为0 */
    recType?: 0 | 1 | 2;
    deviceSerial: string;
    channelNo: string;
    startTime: number;
    endTime: number;
    version?: string;
}
export interface VideoFragmentFile {
    channelNo: number;
    channelType: string;
    cloudType: number;
    coverPic: string;
    createTime: number;
    crypt: number;
    deviceSerial: string;
    downloadPath: string;
    endTime: number;
    fileId: string;
    fileIndex: string;
    fileName: string;
    fileSize: number;
    fileType: number;
    iStorageVersion: number;
    id: number;
    keyChecksum: string;
    localType: string;
    locked: number;
    ownerId: string;
    recType: number;
    startTime: number;
    type: number;
    videoLong: number;
    videoType: number;
}
/**
 * @description 根据时间获取存储文件信息 (本地存储和云存储)
 *
 * 根据时间获取存储文件信息: https://open.ys7.com/help/1491
 *
 *
 * @param {VideoByTimeBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<VideoFragmentFile[]>}
 */
declare function getVideoByTime(body: VideoByTimeBody, domain?: string): Promise<Response<VideoFragmentFile[]>>;
export default getVideoByTime;
