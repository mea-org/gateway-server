import { AppEntity } from '../entity-types';

export type Config = {
  reverseTimeout: number; // 转发超时时间（毫秒）
  dbUrl: string; // DB 连接字符串
  dbName: string; // DB名称
  appMetaDatas: any; // App 元数据
  setAppMetaDatas: (appDatas: AppEntity[]) => void;
};

let appMetaDatas = {};

export const config: Config = {
  reverseTimeout: 60 * 1000,
  dbUrl: 'mongodb://humin:humin@127.0.0.1:27017/gateway',
  dbName: 'gateway',
  get appMetaDatas() {
    return appMetaDatas;
  },
  setAppMetaDatas(appDatas: AppEntity[]) {
    appMetaDatas = appDatas.reduce((result: any, app) => {
      result[app.appId] = app;
      return result;
    }, {});
  }
};
