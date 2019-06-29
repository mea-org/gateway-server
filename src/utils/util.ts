import * as lodash from 'lodash';
import * as uuid from 'uuid';

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
  },

  random(min: number, max: number) {
    return lodash.random(min, max);
  },

  /**
   * 安全的 JSON.parse
   * @param obj
   * @param defaultValue
   */
  safeJSONParse(obj: any, defaultValue: string = '') {
    try {
      return JSON.stringify(obj);
    } catch {
      return defaultValue;
    }
  },
  uuidV4() {
    return uuid.v4();
  }
};
