import User from '../../models/user';
import Content from '../../models/content';
import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import moment from 'moment';

const { ObjectId } = mongoose.Types;

export const getUserById = async (ctx, next) => {
  const { userId } = ctx.request.body;
  if (!ObjectId.isValid(userId)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const user = await User.findById(userId);
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
  GET /api/content/count  
 */
export const count = async (ctx) => {
  try {
    const content = await Content.count({});
    ctx.body = content;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/content/check
  {
    "contentId" : "MER_01_01",
    "userId" : "62f25a12dec82fee9bd441c5",
  }
 */
export const check = async (ctx) => {
  const { contentId, userId } = ctx.request.body;

  // contentId, userId 없으면 에러 처리
  if (!contentId || !userId) {
    ctx.status = 401; // Unteacherorized
    return;
  }

  try {
    const content = await Content.find()
      .where('contentId')
      .equals(contentId)
      .where('userId')
      .equals(userId);
    // 콘텐츠가 존재하지 않으면 Not Found 처리
    if (!content || content.length === 0) {
      ctx.status = 404;
      return;
    }
    ctx.body = content;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/content/read
  {
    "userId" : "62f25a12dec82fee9bd441c5",
  }
 */
export const read = async (ctx) => {
  const { userId } = ctx.request.body;

  // userId가 없으면 에러 처리
  if (!userId) {
    ctx.status = 401; // Unteacherorized
    return;
  }

  try {
    const content = await Content.find().where('userId').equals(userId);
    // 콘텐츠가 존재하지 않으면 에러 처리
    if (!content) {
      ctx.status = 401;
      return;
    }
    ctx.body = content;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/content/
  {
    "contentId" : "MER_01_02",
    "userId" : "62f25a12dec82fee9bd441c5",
    "sex" : "남",
    "age" : 11,
    "address" : "서울 강동",
    "type" : "초등학교",
    "data" : { "C1" : 2, "C2" : 3 }
  }
 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    contentId: Joi.string().required(), // required()가 있으면 필수 항목
    userId: Joi.string().required(),
    sex: Joi.string().required(),
    age: Joi.number().required(),
    address: Joi.string().required(),
    type: Joi.string().required(),
    data: Joi.object().required(),
    publishedDate: Joi.date().required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const { contentId, userId, sex, age, address, type, data, publishedDate } =
    ctx.request.body;
  const content = new Content({
    contentId,
    userId,
    sex,
    age,
    address,
    type,
    data,
    publishedDate,
  });

  try {
    await content.save();
    ctx.body = content;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  PATCH /api/content/:id
  { 
    "userId" : "62f25a12dec82fee9bd441c5",
    "data" : { C1 : 1, C2 : 0 },
  }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;

  // write에서 사용한 schema와 비슷한데, required()가 없습니다.
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    data: Joi.object().required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const nextData = { ...ctx.request.body };

    const updateContent = await Content.findByIdAndUpdate(id, nextData, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 때는 업데이트되기 전의 데이터를 반환합니다.
    }).exec();
    if (!updateContent) {
      ctx.status = 404;
      return;
    }
    ctx.body = updateContent;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/content/find
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-11",
    "filter" : {
      "contentId" : "MER_01_01",
    },
  }
*/
export const find = async (ctx) => {
  const body = ctx.request.body || {};

  const findData = {};

  if (body.dateGte && body.dateLt) {
    findData['publishedDate'] = {
      $gte: moment(body.dateGte).startOf('day').format(),
      $lt: moment(body.dateLt).endOf('day').format(),
    };
  }

  try {
    let content;
    if (body.filter) {
      const key = Object.keys(body.filter)[0];
      content = await Content.find(findData)
        .where(key)
        .equals(body.filter[key])
        .exec();
    } else {
      content = await Content.find(findData).exec();
    }
    ctx.body = content;
  } catch (error) {
    ctx.throw(500, error);
  }
};
