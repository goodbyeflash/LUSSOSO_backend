import Router from 'koa-router';
import * as statisticsCtrl from './statistics.ctrl';

const statistics = new Router();

statistics.post('/totalUserCount', statisticsCtrl.totalUserCount);
statistics.post('/env', statisticsCtrl.env);
statistics.post('/char', statisticsCtrl.char);
statistics.post('/sex', statisticsCtrl.sex);
statistics.post('/age', statisticsCtrl.age);
statistics.post('/address', statisticsCtrl.address);
statistics.post('/type', statisticsCtrl.type);
statistics.post('/addressAll', statisticsCtrl.addressAll);

export default statistics;
