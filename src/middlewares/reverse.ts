import * as request from 'request';
import { config } from '../config';
import * as zlib from 'zlib';

import { MiddlewareConfig } from '../entity-types/MiddlewareConfig';

export default <MiddlewareConfig>{
  priority: 25,
  name: 'reverse',
  description: 'Reverse request to real address.',
  handler: async (ctx, next) => {
    const forwardInfo = ctx.state.$$gateway.forwardInfo || {
      host: 'www.baidu.com',
      path: '/'
    };
    const realUri = `http://${forwardInfo.host}${forwardInfo.path}`;

    return new Promise((resolve, reject) => {
      // 手动处理请求
      ctx.respond = false;
      // Pipe request
      const requestOpt = {
        method: ctx.method,
        url: realUri,
        timeout: config.reverseTimeout
      };
      const req = ctx.req.pipe(
        request(requestOpt),
        { end: true }
      );
      req.pipe(ctx.res);
      // Record response
      let resBuffer = Buffer.from([]);
      // let responseBufferArr = [];
      req
        .on('response', (res: any) => {
          ctx.state.$$gateway.resStatusCode = res.statusCode;
          ctx.state.$$gateway.resHeaders = res.headers;
        })
        .on('data', (data: Buffer) => {
          resBuffer = Buffer.concat([resBuffer, data]);
        })
        .on('end', () => {
          const encoding = ctx.state.$$gateway.resHeaders['content-encoding'] || '';
          // 解压
          if (encoding === 'gzip') {
            resBuffer = zlib.unzipSync(resBuffer);
          }
          resolve();
        })
        .on('error', (err: any) => {
          reject(err);
        });
    });
  }
};
