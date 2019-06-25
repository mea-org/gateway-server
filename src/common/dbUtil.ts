import { MongoClient, FilterQuery, FindOneOptions } from 'mongodb';
import { config } from '../config';

class DbUtil {
  client: MongoClient;

  constructor() {}

  getClient() {
    if (this.client && this.client.isConnected()) {
      return Promise.resolve(this.client);
    }
    return MongoClient.connect(config.dbUrl, { useNewUrlParser: true })
      .then((client: MongoClient) => {
        this.client = client;
        return client;
      })
      .catch(err => {
        console.error(err);
      });
  }

  collection(colName: string) {
    return this.getClient().then(() => {
      return this.client.db(config.dbName).collection(colName);
    });
  }

  /**
   * 计算数量
   * @param colName
   * @param query
   */
  countDocuments<TSchema>(colName: string, query: FilterQuery<TSchema>) {
    return this.collection(colName).then(col => {
      return col.countDocuments(query);
    });
  }

  /**
   * 插入一个
   * @param colName
   * @param doc
   */
  insertOne(colName: string, doc: any) {
    return this.collection(colName).then(col => {
      return col.insertOne(doc);
    });
  }

  /**
   * 查询单个
   * @param colName
   * @param filter
   */
  findOne(colName: string, filter: FilterQuery<any>, options?: FindOneOptions) {
    return this.collection(colName).then(col => {
      return col.findOne(filter, options);
    });
  }

  /**
   * 查询列表
   * @param colName
   * @param filter
   * @param options
   */
  find(colName: string, filter: FilterQuery<any>, options?: FindOneOptions) {
    return this.collection(colName).then(col => {
      return col.find(filter, options);
    });
  }
}

export const dbUtil = new DbUtil();
