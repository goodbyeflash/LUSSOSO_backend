import Content from '../../models/content';
import moment from 'moment';

/*
  POST /api/statistics/totalUserCount
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "userIds" : []
  }
*/
export const totalUserCount = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $group: {
          _id: '$userId',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $count: 'totalCount',
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/env
  {
    "contentId" : "MER_01_01",
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "userIds" : []
  }
*/
export const env = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    contentId: body.contentId,
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $project: {
          arrayofkeyvalue: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $project: {
          dataValues: '$arrayofkeyvalue.v',
        },
      },
      {
        $group: {
          _id: 1,
          datas: {
            $push: '$dataValues',
          },
        },
      },
      {
        $unwind: '$datas',
      },
      {
        $unwind: '$datas',
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/char
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "dataKey" : "C5",
    "userIds" : []
  }
*/
export const char = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          data_key_value_list: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $unwind: '$data_key_value_list',
      },
      {
        $match: {
          'data_key_value_list.k': {
            $eq: body.dataKey,
          },
        },
      },
      {
        $group: {
          _id: '$contentId',
          data_key_value_list: {
            $push: '$data_key_value_list',
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/sex
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "dataKey" : "C5",
    "sex" : "남",
    "userIds" : []
  }
*/
export const sex = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
    sex: body.sex,
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          data_key_value_list: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $unwind: '$data_key_value_list',
      },
      {
        $match: {
          'data_key_value_list.k': {
            $eq: body.dataKey,
          },
        },
      },
      {
        $group: {
          _id: '$contentId',
          data_key_value_list: {
            $push: '$data_key_value_list',
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/age
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "dataKey" : "C5",
    "ageGte" : 7,
    "ageLte" : 9,
    "userIds" : []
  }
*/
export const age = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
    age: {
      $gte: body.ageGte,
      $lte: body.ageLte,
    },
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          data_key_value_list: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $unwind: '$data_key_value_list',
      },
      {
        $match: {
          'data_key_value_list.k': {
            $eq: body.dataKey,
          },
        },
      },
      {
        $group: {
          _id: '$contentId',
          data_key_value_list: {
            $push: '$data_key_value_list',
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/address
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "dataKey" : "C5",
    "address" : "서울 강남구",
    "userIds" : []
  }
*/
export const address = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
    address: body.address,
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          data_key_value_list: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $unwind: '$data_key_value_list',
      },
      {
        $match: {
          'data_key_value_list.k': {
            $eq: body.dataKey,
          },
        },
      },
      {
        $group: {
          _id: '$contentId',
          data_key_value_list: {
            $push: '$data_key_value_list',
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/type
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "dataKey" : "C5",
    "type" : "고등학교",
    "userIds" : []
  }
*/
export const type = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
    type: body.type,
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          data_key_value_list: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $unwind: '$data_key_value_list',
      },
      {
        $match: {
          'data_key_value_list.k': {
            $eq: body.dataKey,
          },
        },
      },
      {
        $group: {
          _id: '$contentId',
          data_key_value_list: {
            $push: '$data_key_value_list',
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/statistics/addressAll
  {
    "dateGte" : "2022-08-11",
    "dateLt" : "2022-08-14",
    "userIds" : []
  }
*/
export const addressAll = async (ctx) => {
  const body = ctx.request.body || {};

  const matchQuery = {
    publishedDate: {
      $gte: new Date(moment(body.dateGte).startOf('day').format()),
      $lt: new Date(moment(body.dateLt).endOf('day').format()),
    },
  };

  if (body.userIds) {
    matchQuery['userId'] = {
      $in: body.userIds,
    };
  }

  try {
    const aggregate = await Content.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          data_key_value_list: {
            $objectToArray: '$$ROOT.data',
          },
        },
      },
      {
        $unwind: '$data_key_value_list',
      },
      {
        $group: {
          _id: '$address',
          data_key_value_list: {
            $push: '$data_key_value_list',
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};
