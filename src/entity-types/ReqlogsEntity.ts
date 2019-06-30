export interface ReqlogsEntity {
  responseTime: number; // 响应时间
  statusCode: number; // 响应状态码
  requestId: string; // 请求ID
  requestSpanId: string; // 请求的 Span ID
  requestParentSpanId: string; // 调用者的 Span ID
  reqHeaders: { [key: string]: string | string[] };
  reqBody: string; // 请求体
  resHeaders: { [key: string]: string | string[] };
  resBody: string; // 响应体
  reverseUrl: string; // 目标URL
}
