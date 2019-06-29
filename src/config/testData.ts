import { AppEntity } from '../entity-types';

export const testData: AppEntity[] = [
  {
    appName: 'Test',
    apiBase: '',
    appId: '10000',
    loadBalanceMode: 'polling', // iphash, polling
    enableCors: true,
    apiHosts: [
      { protocol: 'http', host: 'www.baidu.com', port: 80 },
      { protocol: 'https', host: 'github.com', port: 443 }
    ]
  }
];
