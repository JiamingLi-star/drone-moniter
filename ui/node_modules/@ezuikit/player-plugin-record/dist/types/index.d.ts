import EventEmitter from 'eventemitter3';

interface IResult<T> {
    data?: T;
    code?: number;
    msg?: string;
}
/**
 * 播放器标准接口
 */
interface PlayerInterface extends EventEmitter {
    playing: boolean;
    volume: number;
    playbackRate: number;
    deviceCapacity: Record<string, any>;
    i18n: any;
    logger: any;
    /**
     * 播放
     * @param options
     * @returns {Promise}
     */
    play: (options?: any) => Promise<unknown>;
    /**
     * 暂停播放
     * @returns
     */
    pause: (bool?: boolean) => Promise<unknown>;
    /**
     * 销毁并断流
     * @returns
     */
    destroy: () => Promise<unknown>;
    /**
     * 截图
     * @param {string} name 文件名 默认时间戳（new Date().getTime()）
     * @param {"png" | "jpeg"} fmt 图片格式
     * @param {"base64"} type 文件格式 默认base64
     * @param {boolean} download 是否直接下载 默认不直接下载
     * @returns 返回base64字符
     */
    snapshot: (name?: string, fmt?: 'jpeg', type?: 'base64', download?: boolean) => Promise<IResult<{
        fileName?: string;
        base64?: string;
    } | null>>;
    /**
     * 开始录制视频
     * @param {string} name 文件名 默认时间戳（new Date().getTime()）
     * @param {"mp4"} fmt 图片格式 默认mp4
     * @returns
     */
    startRecord?: (name?: string, fmt?: 'mp4') => Promise<any>;
    /**
     * 停止录制
     * @returns
     */
    stopRecord?: () => Promise<any>;
    /**
     * 全屏
     * @returns
     */
    fullScreen: () => Promise<void>;
    /**
     * 退出全屏
     * @returns
     */
    exitScreen: () => Promise<void>;
    /**
     * 设置画布/视频的尺寸  不设置 默认使用容器的高宽（充满容器）
     * @param {number=} width 画布的宽度
     * @param {number=} height 画布的高度
     * @returns
     */
    resize: (width?: number, height?: number) => Promise<{
        width: number;
        height: number;
    }>;
    /**
     * 设置音量
     * @param volume 音量 [0-1]， 0：表示静音
     * @returns {void}
     */
    setVolume: (volume: number) => void;
    /**
     * 设置封面
     * @param url
     * @returns
     */
    setPoster?: (postUrl: string) => void;
    /**
     * 设置播放速度
     * @param rate
     * @returns
     */
    setPlaybackRate?: (rate: number) => void;
    /**
     * 当前版本号
     * @returns
     */
    getVersion: () => object;
    /**
     * 设置日志打印的级别 INFO | LOG | WARN | ERROR
     *
     *
     * @param {string} level 日志级别 一次从大到小 3 -> 0 (为了更好的扩展)
     * @returns
     */
    setDebug?: (level: 'INFO' | 'LOG' | 'WARN' | 'ERROR') => void;
}

interface PlayerPlugin {
    name: string;
    init?: (player?: PlayerInterface) => void;
    beforeExec?: (player?: PlayerInterface) => boolean | Promise<boolean>;
    exec: (player?: PlayerInterface) => void;
    afterExec?: (player?: PlayerInterface) => void;
    destroy?: (player?: PlayerInterface) => void;
}

interface PlayerPluginRecordProps {
    /**
     * @description 是否下载录制文件
     * @default true
     */
    downloadRecord?: boolean;
}
type PlayerRecordInputDataFn = (data?: {
    data: Uint8Array;
}) => void;
/**
 * @description ezopne 录制视频 仅支持chrome
 * @example
 * ```ts
 * import EZopenPlayer from '@ezuikit/player-ezopen';
 * import PlayerPluginRecord from '@ezuikit/player-plugin-record';
 * // 播放地址 url 和 accessToken 从下面地址获取
 * // https://open.ys7.com/console/device.html
 * const player = new EZopenPlayer({
 *  id: "app",
 *  url: "ezopne player url",
 *  accessToken: "accessToken"
 * })
 * const recordPlugin = new PlayerPluginRecord(); // 录制插件
 * player.use(recordPlugin)
 * recordPlugin.startRecord()
 * ```
 */
declare class PlayerPluginRecord implements PlayerPlugin {
    _player: PlayerInterface;
    readonly name: string;
    private _record;
    recording: boolean;
    _recordInputDataFn: PlayerRecordInputDataFn;
    constructor(props?: PlayerPluginRecordProps);
    /**
     * @description 执行插件
     * @param {PlayerInterface} player
     */
    exec(player: PlayerInterface): void;
    /**
     * @description 开始录制
     * @param {string} fileName 视频文件名
     * @param {number=} port
     * @returns {Promise<string>}
     */
    startRecord(fileName?: string, stopCallBack?: any, secretKey?: string): Promise<void>;
    /**
     * @description 停止录制
     * @returns {Promise<string>}
     */
    stopRecord(): Promise<unknown>;
    /**
     * @description 销毁
     */
    destroy(): void;
}

export { type PlayerPluginRecordProps, type PlayerRecordInputDataFn, PlayerPluginRecord as default };
