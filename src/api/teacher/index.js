import Router from 'koa-router';
import * as teacherCtrl from './teacher.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const teachers = new Router();

// Auth
teachers.post('/register', teacherCtrl.register);
teachers.post('/login', teacherCtrl.login);
teachers.get('/check', teacherCtrl.check);
teachers.post('/logout', teacherCtrl.logout);

// Control
teachers.get('/', teacherCtrl.list);
teachers.get('/count', teacherCtrl.count);
teachers.post('/find', teacherCtrl.find);
teachers.get('/:id', teacherCtrl.getTeacherById, teacherCtrl.read);
teachers.patch('/:id', checkLoggedIn, teacherCtrl.update);
teachers.delete('/:id', checkLoggedIn, teacherCtrl.remove);

export default teachers;
