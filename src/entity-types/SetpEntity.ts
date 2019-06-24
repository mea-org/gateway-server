import * as Koa from 'koa';

export interface SetpEntity {
  priority: number;
  name: string;
  description?: string;
  handler: (ctx: Koa.Context, next?: () => Promise<any>) => Promise<any>;
}
