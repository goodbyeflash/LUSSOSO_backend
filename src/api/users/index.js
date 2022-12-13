import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const users = new Router();

users.post('/', usersCtrl.write);
users.get('/', checkLoggedIn, usersCtrl.list);
users.get('/:_id', checkLoggedIn, usersCtrl.read);
users.get('/count', checkLoggedIn, usersCtrl.count);
users.post('/find', checkLoggedIn, usersCtrl.find);
users.patch('/:_id', checkLoggedIn, usersCtrl.update);
users.delete('/:_id', checkLoggedIn, usersCtrl.remove);

export default users;
