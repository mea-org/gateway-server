import { AppEntity } from './AppEntity';

export interface GatewayData {
  requestId?: string;
  requestParentSpanId?: string;
  requestSpanId?: string;
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
