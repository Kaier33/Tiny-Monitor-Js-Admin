import request from '@/utils/request'

export async function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function register(userInfo) {
  const { username, password } = userInfo
  return request({
    url: '/auth/register',
    method: 'post',
    data: { username: username.trim(), password },
  })
}

export function getUserInfo() {
  return request({
    url: '/user',
    method: 'get',
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user',
    method: 'put',
    data,
  })
}

export function getUserDetail(id) {
  return request({
    url: `/user/${id}`,
    method: 'get',
  })
}

export function getUserList() {
  return request({
    url: '/users',
  })
}

export function changePassword(data) {
  const { oldpass, password } = data
  return request({
    url: '/user/change-password',
    method: 'post',
    data: {
      oldpass,
      password,
    },
  })
}
