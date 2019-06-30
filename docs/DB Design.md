# DB Degisn

API 的转发数据需要存储，这些数据的特点是量大，相互之间基本无关联性，对读写速度有一定的要求。为此，当前这个版本，为了简单可用，选择 MongoDB 作为数据库。

## MongoDB 集合设计

根据 App 配置：

```ts
export type ApiHost = {
  protocol: 'https' | 'http';
  host: string;
  port: number;
};
export interface AppEntity {
  appName: string;
  apiBase: string;
  appId: string;
  loadBalanceMode: 'polling' | 'iphash'; // iphash, polling
  apiHosts: ApiHost[];
  enableCors: boolean;
}
```

可以发现，每个APP是可以相互独立的。为此，我们可以一个 APP 一个 Collection，集合命名规则: `reqlogs_<appId>`。当前情况下，可以先把请求体和响应体这种线放在一起，当数据量大的时候，还是建议独立存储（如 HBase、Cassandra），MongoDB 存储核心元数据，为了快速搜索还可以增加 ElasticSearch 搜索引擎。
