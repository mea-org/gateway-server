import { SetpEntity } from '../entity-types';

export default <SetpEntity>{
  priority: 5,
  name: 'error-handler',
  description: '处理转发异常',
  handler: async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.error('error', err);
    }
  }
};
