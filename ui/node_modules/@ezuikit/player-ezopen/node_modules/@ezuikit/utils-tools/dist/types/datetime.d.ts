export type DateLike = Date | number | string;
declare class DateTime {
    /**
     * 数字格式化 十位补0
     * @param {number | string} num - 要格式化的数字
     * @returns {string} 返回的数字格式化后的字符串
     *
     * @example
     * ```js
     * fillZero(0) // "00"
     * fillZero(9) // "09"
     * fillZero(23) // "23"
     * ```
     */
    static fillZero(num: number, len?: number): string;
    /**
     * 日期时间格式化库
     * 支持常用模式：yyyy-MM-dd HH:mm:ss，MM/dd/yyyy，yyyy年MM月dd日 等
     * 支持自定义格式
     * @param input - 输入的日期，可以是 Date 对象、时间戳（毫秒）或 ISO 格式字符串
     * @param format - 输出的日期格式字符串，支持 yyyy, MM, dd, HH, mm, ss 等占位符
     * @returns 格式化后的日期字符串
     * @throws 如果输入的日期格式不正确或无法解析，将抛出错误
     * @example
     * DateTime.format(new Date(), "yyyy-MM-dd HH:mm:ss") // "2023-10-01 12:00:00"
     * DateTime.format("2023-10-01T12:00:00Z", "MM/dd/yyyy") // "10/01/2023"
     * DateTime.format("2023-10-01", "MM/dd/yyyy") // "10/01/2023"
     * DateTime.format("2023/10/01", "MM/dd/yyyy") // "10/01/2023"
     * DateTime.format("2023/10/01T01:01:01", "MM/dd/yyyy") // "10/01/2023"
     * DateTime.format(1709452800000, "yyyy年MM月dd日") // "2024年01月01日"
     */
    static format(input: DateLike, format: string): string;
    /**
     * 解析日期字符串为 Date 对象
     * 支持 ISO 格式、常见日期格式等
     * @param str - 日期字符串
     * @returns 解析后的 Date 对象
     * @throws 如果日期字符串格式不正确，将抛出错误
     * @example
     * DateTime.Date("2023") // new Date("2023-10-01T00:00:00")
     * DateTime.Date("2023-01") // new Date("2023-10-01T00:00:00")
     * DateTime.Date("2023-10-01") // new Date("2023-10-01T00:00:00")
     * DateTime.Date("2023/10/01") // new Date("2023-10-01T00:00:00")
     * DateTime.Date("2023.10.01") // new Date("2023-10-01T00:00:00")
     * DateTime.Date("20241001010101") // new Date("2024-10-01T01:01:01")
     * DateTime.Date("1709452800000") // new Date("2024-03-03T16:00:00") // 毫秒
     * DateTime.Date("1709452800") // new Date("2024-03-03T16:00:00") // 秒
     */
    static toDate(str: DateLike): Date;
    /**
     * 对比时间差
     * @param date1 - 第一个日期
     * @param date2 - 第二个日期
     * @param type - 时间单位
     * @returns 时间差
     * @example
     * ```ts
     * DateTime.diff('2023-10-01', '2023-10-02') // 86400
     * DateTime.diff('2023-10-01', '2023-10-02', 'minute') // 1440
     * DateTime.diff('2023-10-01', '2023-10-02', 'hour') // 24
     * DateTime.diff('2023-10-01', '2023-10-02', 'day') // 1
     * DateTime.diff('2023-10-01', '2023-10-02', 'month') // 0.041666666666666664
     * ```
     */
    static diff(date1: DateLike, date2: DateLike, type?: string): number;
}
export default DateTime;
