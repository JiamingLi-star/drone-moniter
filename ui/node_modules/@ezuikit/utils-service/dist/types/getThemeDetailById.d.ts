export interface ThemeDetailByIdBody {
    accessToken: string;
    id: string;
}
export interface ThemeBtn<T> {
    iconId: T;
    part: 'left' | 'right';
    defaultActive: 0 | 1;
    /** 是否展示 0 不展示  1 展示 */
    isrender: 1 | 0;
    btnKey: string;
}
export interface ThemeHeader {
    backgroundColor: string;
    color: string;
    activeColor: string;
    btnList: Array<ThemeBtn<'deviceID' | 'deviceName' | 'cloudRec' | 'rec'>>;
}
export interface ThemeFooter {
    backgroundColor: string;
    color: string;
    activeColor: string;
    btnList: Array<ThemeBtn<'play' | 'capturePicture' | 'sound' | 'pantile' | 'recordvideo' | 'zoom' | 'speed' | 'hd' | 'webExpend' | 'expend'>>;
}
export interface ThemeDetailRes {
    userId: string;
    id: string;
    themeId: string;
    themeIntro: '';
    themeName: string;
    autoFocus: string;
    poster: string;
    themeType: string;
    /** 是官方主题 */
    isOfficial: number;
    isSingle: number;
    customConfig: null;
    header: ThemeHeader;
    footer: ThemeFooter;
}
/**
 * @description 根据ID 获取模版主题数据
 *
 *
 * @param {ThemeDetailByIdBody} body 请求体
 * @param {string} domain 请求域名
 *
 * @returns {Promise<ThemeDetailRes>}
 */
declare function getThemeDetailById(body: ThemeDetailByIdBody, domain?: string): Promise<import("./fetch").Response<ThemeDetailRes, undefined>>;
export default getThemeDetailById;
