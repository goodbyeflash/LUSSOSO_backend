import Content from '../../models/content';
import Joi from '@hapi/joi';

/*
  POST /api/content
  {
    "imageUrlPc" : "",
    "imageUrlMo" : "",
    "text" : "",
    "publishedDate" : new Date()
  }
 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    imageUrlPc: Joi.string().required().allow(null, ''), // required()가 있으면 필수 항목
    imageUrlMo: Joi.string().required().allow(null, ''), // required()가 있으면 필수 항목
    text: Joi.string().required().allow(null, ''),
    publishedDate: Joi.date().required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const { imageUrl, text, publishedDate } = ctx.request.body;

  const content = new Content({
    imageUrl,
    text,
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
  GET /api/content
*/
export const read = async (ctx) => {
  try {
    const content = await Content.find({}).limit(1).exec();
    ctx.body = content;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  PATCH /api/content/:_id
  { 
    "imageUrlPc" : "",
    "imageUrlMo" : "",
    "text" : "",
    "publishedDate" : new Date()
  }
*/
export const update = async (ctx) => {
  const { _id } = ctx.params;

  const schema = Joi.object().keys({
    imageUrlPc: Joi.string(),
    imageUrlMo: Joi.string(),
    text: Joi.string(),
    publishedDate: Joi.date().required(),
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

    const updateContent = await Content.findByIdAndUpdate(_id, nextData, {
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
