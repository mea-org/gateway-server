import { AppEntity } from './AppEntity';

export interface GatewayData {
  startUptime: number;
  endUptime?: number;
  appInfo?: AppEntity;
  reverseUrl?: string;
  // REQ
  reqHeaders?: { [key: string]: string | string[] };
  reqBody?: string;
  // RES
  resStatusCode?: number;
  resHeaders?: { [key: string]: string | string[] };
  resBody?: string;
}
