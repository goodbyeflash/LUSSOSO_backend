import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';

const users = new Router();

users.get('/', usersCtrl.list);
users.get('/:id', usersCtrl.getUserById, usersCtrl.read);
users.post('/', usersCtrl.write);
users.post('/find', usersCtrl.find);

export default users;
