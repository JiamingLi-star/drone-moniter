/**
 * 采用一个路径和一个可选的基本URL，并返回一个规范化的静态路径URL。
 * @param {string} path path参数是表示静态资源路径的字符串，例如图像、脚本或样式表。
 * @param {string=} base getStaticPath 函数中的base参数是一个字符串表示将用于解析静态路径的基本URL或路径。如果相对路径是在path`参数中提供，base参数将用作要解析的基本URL
 * @return {string} 处理输入path后的最终URL路径
 * @example
 * ```ts
 *
 * // base url is https://www.ezviz.com
 * getStaticPath("./")  // https://www.ezviz.com
 * getStaticPath("http://www.open.com/staitc")  //
 * getStaticPath("http://www.open.com/staitc/")  //
 * getStaticPath("https://www.open.com/static")  //
 * getStaticPath("https://www.open.com/static/")  //
 * getStaticPath("//www.open.com/api")  //
 * getStaticPath("//www.open.com/api/")  //
 * getStaticPath("/static")  // https://www.ezviz.com/static
 * getStaticPath("/static/")  // https://www.ezviz.com/static
 * ```
 */
export declare function getStaticPath(path: string, base?: string): string;
