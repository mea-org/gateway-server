import * as Koa from 'koa';

export interface MiddlewareConfig {
  priority: number;
  name: string;
  description?: string;
  handler: (ctx: Koa.Context, next?: () => Promise<any>) => Promise<any>;
}
