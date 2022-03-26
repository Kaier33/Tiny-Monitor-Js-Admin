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
