import { MongoClient, FilterQuery } from 'mongodb';
import { config } from '../config';

class DbUtil {
  client: MongoClient;

  constructor() {}

  getClient() {
    if (this.client && this.client.isConnected()) {
      return Promise.resolve(this.client);
    }
    return MongoClient.connect(config.dbUrl)
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
   *
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
  findOne(colName: string, filter: FilterQuery<any>) {
    return this.collection(colName).then(col => {
      return col.findOne(filter);
    });
  }
}

export const dbUtil = new DbUtil();
