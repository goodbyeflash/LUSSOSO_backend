import User from '../../models/user';
import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import requsetIp from 'request-ip';

const { ObjectId } = mongoose.Types;

export const getUserById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const user = await User.findById(id);
    // 유저가 존재하지 않을 때
    if (!user) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.user = user;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/users
  {
    "name" : "유저",
    "hp" : "01011114444",
    "branch" : "지점",
    "publishedDate" : new Date()
  }
 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    name: Joi.string().required(), // required()가 있으면 필수 항목
    hp: Joi.string().required(),
    branch: Joi.string().required(),
    publishedDate: Joi.date().required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const { name, hp, branch, publishedDate } = ctx.request.body;

  let ip = requsetIp.getClientIp(ctx.request);

  if (ip.indexOf('::ffff:') > -1) {
    ip = ip.replace('::ffff:', '');
  }

  const user = new User({
    name,
    hp,
    branch,
    ip,
    publishedDate,
  });

  try {
    await user.save();
    ctx.body = user;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  GET /api/users?page=
*/
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  // 값이 주어지지 않았다면 1을 기본으로 사용합니다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const users = await User.find({})
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const userCount = await User.countDocuments({}).exec();
    ctx.set('Last-Page', Math.ceil(userCount / 10));
    ctx.body = users.map((user) => user.toJSON());
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  GET /api/users/:_id
*/
export const read = async (ctx) => {
  const { _id } = ctx.params;

  try {
    const user = await User.findById(_id).exec();
    console.log(User);
    if (!user) {
      ctx.status = 404;
      return;
    }
    ctx.body = user;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  GET /api/user/count  
 */
export const count = async (ctx) => {
  try {
    const user = await User.count({});
    ctx.body = user;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/users/find?page=
  {
    "name" : "김"
  }
*/
export const find = async (ctx) => {
  const body = ctx.request.body || {};
  if (Object.keys(body).length > 0) {
    const key = Object.keys(body)[0];
    body[key] = { $regex: '.*' + body[key] + '.*' };
  }
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const users = await User.find(body)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const userCount = await User.countDocuments(body).exec();
    ctx.set('Last-Page', Math.ceil(userCount / 10));
    ctx.body = users.map((user) => user.toJSON());
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  PATCH /api/user/:_id
  {
    "name" : "",
    "hp" : "",
    "branch" : "",
  }
*/
export const update = async (ctx) => {
  const { _id } = ctx.params;

  // write에서 사용한 schema와 비슷한데, required()가 없습니다.
  const schema = Joi.object().keys({
    name: Joi.string(),
    hp: Joi.string(),
    branch: Joi.string(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const nextData = { ...ctx.request.body }; // 객체를 복사하고 body 값이 주어졌으면 HTML 필터링

    const updateUser = await User.findByIdAndUpdate(_id, nextData, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 때는 업데이트되기 전의 데이터를 반환합니다.
    }).exec();
    if (!updateUser) {
      ctx.status = 404;
      return;
    }
    ctx.body = updateUser;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  DELETE /api/user/:_id
*/
export const remove = async (ctx) => {
  const { _id } = ctx.params;
  try {
    await User.findByIdAndRemove(_id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (error) {
    ctx.throw(500, error);
  }
};
