import Router from 'koa-router';
import users from './users';
import admin from './admin';
import content from './content';
import excel from './excel';

const api = new Router();

api.use('/users', users.routes());
api.use('/admin', admin.routes());
api.use('/content', content.routes());
api.use('/excel', excel.routes());

// 라우터를 내보냅니다.
export default api;
