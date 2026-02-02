import { type Response } from './fetch';
/**
 */
export interface RecordCloudVideoByTimeBody {
    accessToken: string;
    deviceSerial: string;
    channelNo: number;
    startTime: number;
    endTime: number;
    spaceId?: number;
}
export interface RecordCloudVideoFragmentFile {
    channelNo: number;
    cloudType: number;
    coverPic: string;
    createTime: number;
    crypt: number;
    deviceSerial: string;
    downloadPath: string;
    endTime: number;
    expireTime: string;
    fileId: string;
    fileIndex: string;
    fileSize: number;
    fileType: number;
    iStorageVersion: number;
    id: number;
    keyChecksum: string;
    locked: number;
    ownerId: string;
    sliceLength: number;
    spaceId: number;
    startTime: number;
    totalDays: number;
    type: number;
    videoLong: number;
    videoType: number;
}
/**
 * @description 获取云录制录像信息查询
 *
 * 有些字段做了转换
 *
 * @param {PlayRealUrlBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<RecordCloudVideoFragmentFile[]>}
 */
declare function getRecordCloudVideoByTime(body: RecordCloudVideoByTimeBody, domain?: string): Promise<Response<RecordCloudVideoFragmentFile[]>>;
export default getRecordCloudVideoByTime;
