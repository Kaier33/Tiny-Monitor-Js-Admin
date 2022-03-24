const { mock } = require('mockjs')

module.exports = [
  {
    url: '/personalCenter/getList',
    type: 'post',
    response(config) {
      return {
        code: 200,
        message: 'success',
        totalCount: 999,
        data: mock({
          'data|10': [
            {
              id: '@id',
            },
          ],
        }).data,
      }
    },
  },
  {
    url: '/personalCenter/doEdit',
    type: 'post',
    response() {
      return {
        code: 200,
        message: '模拟保存成功',
      }
    },
  },
  {
    url: '/personalCenter/doDelete',
    type: 'post',
    response() {
      return {
        code: 200,
        message: '模拟删除成功',
      }
    },
  },
]
