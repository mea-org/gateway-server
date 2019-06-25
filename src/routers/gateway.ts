import * as KoaRouter from 'koa-router';
import { stepExecutor } from '../steps';
const router = new KoaRouter({});

router.all('/:appId(\\d{5})/*', stepExecutor.process);

export { router };
