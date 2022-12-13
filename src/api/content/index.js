import Router from 'koa-router';
import * as contentCtrl from './content.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const contents = new Router();

contents.post('/', contentCtrl.write);
contents.get('/', contentCtrl.read);
contents.patch('/:_id', checkLoggedIn, contentCtrl.update);

export default contents;
