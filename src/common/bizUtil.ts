import { util } from '../utils';

const ONE_DAY_MS = 1000 * 60 * 60 * 24; // 24小时毫秒数

export const bizUtil = {
  /**
   * 根据 AppID 获取请求日志存储的集合名称
   * @param appId
   */
  getCollectionName(appId: number | string) {
    const collectionName = `reqlogs_${appId}`;
    return collectionName;
  },

  /**
   * 构建通用分页
   * @param query
   * @param maxSize
   */
  buildPagingOptions(query: any, maxSize = 100) {
    let { page, size } = query;
    page = Math.max(1, Math.floor(util.ensureNumber(page, 1)));
    size = Math.max(1, Math.floor(util.ensureNumber(size, 20)));
    if (size > maxSize) {
      size = maxSize;
    }
    return { skip: (page - 1) * size, limit: size };
  },

  /**
   * 获取一天的起始时间戳
   * @param d
   */
  getRangeFromDate(d: number) {
    d = util.ensureNumber(d, Date.now());
    const day = new Date(d);
    const ds = new Date(day.getFullYear(), day.getMonth(), day.getDate()).valueOf();
    return {
      dayStart: ds,
      dayEnd: ds + ONE_DAY_MS
    };
  }
};
