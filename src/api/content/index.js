import Router from 'koa-router';
import * as contentCtrl from './content.ctrl';

const contents = new Router();

contents.get('/count', contentCtrl.count);
contents.post('/check', contentCtrl.getUserById, contentCtrl.check);
contents.post('/register', contentCtrl.getUserById, contentCtrl.write);
contents.post('/read', contentCtrl.getUserById, contentCtrl.read);
contents.post('/find', contentCtrl.find);
contents.patch('/:id', contentCtrl.getUserById, contentCtrl.update);

export default contents;
