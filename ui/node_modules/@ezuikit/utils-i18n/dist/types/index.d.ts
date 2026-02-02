/**
 * 字典
 */
export interface I18nTranslation {
    [key: string]: string | number | I18nTranslation;
}
/**
 * 变量
 */
export interface TranslateVariables {
    defaultvalue?: string | number;
    [key: string]: string | number | undefined;
}
/**
 * I18n 多语言配置
 */
export interface I18nOptions {
    defaultLocale?: string;
    translations?: Record<string, I18nTranslation>;
    customizeMissing?: (scope: string | number, variables?: TranslateVariables) => string;
    onChange?: (i18n: I18n) => void;
}
/**
 * 多语言
 *
 * @class I18n
 *
 * @example
 *
 * ```ts
 * import I18n from '@ezuikit/utils-i18n';
 * import zh from './locales/zh_CN';
 * import en from './locales/en_US';
 * const i18n = new I18n(
 *   {
 *     zh,
 *     en,
 *   },
 *   {
 *     defaultLocale: 'zh',
 *   },
 * );
 * i18n.t("title")
 * ```
 */
declare class I18n {
    /**
     * 版本号
     */
    static VERSION: string;
    _translations: Record<string, I18nTranslation>;
    _locale: string;
    options: Partial<I18nOptions>;
    constructor(translations?: Record<string, I18nTranslation>, options?: Partial<I18nOptions>);
    /**
     * 获取多语言scope值
     * @param scope - 多语言 key
     * @param variables - 变量
     * @returns {string}
     * @since 1.0.0
     * @example
     * ```ts
     * i18n.t("title")
     * // name 是一个占位符
     * i18n.t("name", {name: "ShineShao"}) // {name: "name: {{name}}"} =>  {name: "name: ShineShao"}
     * ```
     */
    t(scope: string | number, variables?: TranslateVariables): string | number;
    /**
     * 获取当前语言
     * @since 1.1.0
     */
    get locale(): string;
    /**
     * 获取多语言字典
     * @since 1.1.0
     */
    get translations(): Record<string, I18nTranslation>;
    /**
     * 追加多语言, 同一种语言深度合并
     * @param {Dict} translations 多语言
     * @returns {void}
     * @since 1.0.0
     * @example
     * ```ts
     * i18n.appendTranslations({
     *    zh: {
     *       title: "标题"
     *    },
     *    en: {
     *      title: "title"
     *    }
     * })
     *
     * i18n.t("title")
     * ```
     */
    appendTranslations(translations: Record<string, I18nTranslation>): void;
    /**
     * 切换语言
     * @param {string} locale 多语言 key
     * @returns {void}
     * @since 1.1.0
     */
    switchLocale(locale: string): void;
    /**
     * 切换语言
     * @param {string} locale 多语言 key
     * @returns {void}
     * @since 1.0.0
     */
    switchTranslation(locale: string): void;
    /**
     * 获取当前 locale
     * @returns {string}
     * @since 1.0.0
     */
    getCurrentLocale(): string;
    /**
     * 获取当前多语言
     * @returns {I18nTranslations}
     * @since 1.0.0
     */
    getCurrentTranslation(): I18nTranslation;
    /**
     * 获取版本
     * @returns {string}
     * @since 1.0.0
     */
    getVersion(): string;
    /**
     * Add a callback that will be executed whenever locale/Translations changes,
     */
    private _onChange;
    /**
     * 获取嵌套键的值
     * @param obj
     * @param path
     * @returns
     */
    private _findChainValue;
}
export default I18n;
