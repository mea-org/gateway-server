import * as fs from 'fs';
import * as path from 'path';
import * as Koa from 'koa';
import * as compose from 'koa-compose';

import { util } from '../utils';
import { SetpEntity } from '../entity-types/SetpEntity';

class StepExecutor {
  middleware: any;
  constructor() {
    this.init();
  }

  _getMiddlewareList() {
    const middlewareNameList: string[] = [];
    fs.readdirSync(path.join(__dirname)).forEach(name => {
      const extName = path.extname(name);
      if (name !== 'index.js' && name !== 'index.ts' && (extName === '.js' || extName === '.ts')) {
        middlewareNameList.push(name);
      }
    });
    return middlewareNameList;
  }

  init() {
    const mList = this._getMiddlewareList();
    // Load middlewares, handler must exists, sort by priority asc.
    const middleWareList: any[] = mList
      .map((name: string) => {
        const mod = require(`./${name}`);
        return mod.default;
      })
      .filter((x: SetpEntity) => util.isFunction(x.handler))
      .sort(
        (x1: SetpEntity, x2: SetpEntity) =>
          util.ensureNumber(x1.priority, 0) - util.ensureNumber(x2.priority, 0)
      );

    const handles: any = middleWareList.map((mid: SetpEntity) => mid.handler);
    // Register middlewares
    this.middleware = compose(handles);
  }

  process = async (ctx: Koa.Context, next: () => Promise<any>) => {
    await this.middleware(ctx, next);
  };
}

export const stepExecutor = new StepExecutor();
