import Teacher from '../../models/teacher';
import mongoose from 'mongoose';
import Joi from '@hapi/joi';

const { ObjectId } = mongoose.Types;

export const getTeacherById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const teacher = await Teacher.findById(id);
    // 선생이 존재하지 않을 때
    if (!teacher) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.teacher = teacher;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/teacher/count  
 */
export const count = async (ctx) => {
  try {
    const teacher = await Teacher.count({});
    ctx.body = teacher;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/teacher/register
  {
      "id" : "kim",
      "password" : "kim123",
      "name" : "김교사",
      "hp" : "01011112222",
      "email" : "kim@gg.kr",
      "schoolName" : "면목초등학교",
      "schoolCode" : "S000000",
      "type" : "초등학교 교사"
  }
*/
export const register = async (ctx) => {
  // Request Body 검증하기
  const schema = Joi.object().keys({
    id: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    hp: Joi.string().required(),
    email: Joi.string().allow(''),
    schoolName: Joi.string().required(),
    schoolCode: Joi.string().allow(''),
    type: Joi.string().required(),
    publishedDate: Joi.date().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.result = 400;
    ctx.body = result.error;
    return;
  }

  const {
    id,
    password,
    name,
    hp,
    email,
    schoolName,
    schoolCode,
    type,
    publishedDate,
  } = ctx.request.body;
  try {
    // id이 이미 존재하는지 확인
    const exists = await Teacher.findByid(id);
    if (exists) {
      ctx.status = 409; // Confict
      return;
    }

    const teacher = new Teacher({
      id,
      password,
      name,
      hp,
      email,
      schoolName,
      schoolCode,
      type,
      publishedDate,
    });
    await teacher.setPassword(password); // 비밀번호 설정
    await teacher.save(); // 데이터베이스에 저장

    // 응답할 데이터에서 hashedPassword 필드 제거

    ctx.body = teacher.serialize();

    const token = teacher.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    POST /api/teacher/login
    {
        "id" : "sangbin",
        "password" : "mypass123"
    }
*/
export const login = async (ctx) => {
  const { id, password } = ctx.request.body;
  // id, password가 없으면 에러 처리
  if (!id || !password) {
    
    ctx.status = 401; // Unteacherorized
    return;
  }

  try {
    const teacher = await Teacher.findByid(id);
    // 계정이 존재하지 않으면 에러 처리
    if (!teacher) {
      ctx.status = 401;
      return;
    }
    const valid = await teacher.checkPassword(password);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = teacher.serialize();
    const token = teacher.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/teacher/check
*/
export const check = async (ctx) => {
  const { teacher } = ctx.state;
  if (!teacher) {
    // 로그인 중 아님
    ctx.status = 401; // Unteacherorized
    return;
  }
  ctx.body = teacher;
};

/*
    POST /api/teacher/logout
*/
export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204; // No Content
};

/*
  GET /api/teacher?page=
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
    const teachers = await Teacher.find({})
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const teacherCount = await Teacher.countDocuments({}).exec();
    ctx.set('Last-Page', Math.ceil(teacherCount / 10));
    ctx.body = teachers
      .map((teacher) => teacher.toJSON())
      .map((teacher) => new Teacher(teacher).serialize());
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/teacher/find?page=
  {
    "name" : "관리"
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
    const teachers = await Teacher.find(body)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const teacherCount = await Teacher.countDocuments(body).exec();
    ctx.set('Last-Page', Math.ceil(teacherCount / 10));
    ctx.body = teachers
      .map((teacher) => teacher.toJSON())
      .map((teacher) => new Teacher(teacher).serialize());
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  GET /api/teacher/:id
*/
export const read = async (ctx) => {
  ctx.body = ctx.state.teacher.serialize();
};

/*
  DELETE /api/teacher/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Teacher.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  PATCH /api/teacher/:id
  {
    "password" : "수정비밀번호",
    "name" : "수정이름",
    "hp" : "수정핸드폰번호",
    "email" : "수정이메일",
    "schoolName" : "수정학교이름",
    "schoolCode" : "수정학교코드",
    "type" : "수정타입"
  }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;

  // write에서 사용한 schema와 비슷한데, required()가 없습니다.
  const schema = Joi.object().keys({
    password: Joi.string(),
    name: Joi.string(),
    hp: Joi.string(),
    email: Joi.string(),
    schoolName: Joi.string(),
    schoolCode: Joi.string(),
    type: Joi.string(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { password } = ctx.request.body;

  try {
    const teacher = new Teacher({
      password,
    });

    const nextData = { ...ctx.request.body }; // 객체를 복사하고 body 값이 주어졌으면 HTML 필터링
    if (nextData.password) {
      nextData.hashedPassword = await teacher.setPassword(password);
      delete nextData.password;
    }

    const updateTeacher = await Teacher.findByIdAndUpdate(id, nextData, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 때는 업데이트되기 전의 데이터를 반환합니다.
    }).exec();
    if (!updateTeacher) {
      ctx.status = 404;
      return;
    }
    ctx.body = updateTeacher.serialize();
  } catch (error) {
    ctx.throw(500, error);
  }
};
