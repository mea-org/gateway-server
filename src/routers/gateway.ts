import * as KoaRouter from 'koa-router';
import { middleware } from '../middlewares';
const router = new KoaRouter({});

router.all('/:appId(\\d{5})/*', middleware.process);

export { router };
