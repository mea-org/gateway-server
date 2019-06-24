export const util = {
  /**
   * Is function.
   * @param {*} fn
   */
  isFunction(fn: any) {
    return typeof fn === 'function';
  },

  /**
   * 是否是NaN
   * @param n 数字
   */
  isNaN(n: number) {
    return n !== n;
  },

  /**
   * Ensure return an valid number.
   * @param {*} n
   * @param {number} defaultValue
   */
  ensureNumber(n: any, defaultValue: number = 0) {
    n = +n;
    return util.isNaN(n) ? defaultValue : n;
  }
};
