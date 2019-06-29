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
