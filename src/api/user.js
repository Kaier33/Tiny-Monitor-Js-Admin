import request from '@/utils/request'
import { tokenName } from '@/config'

export async function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
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

export function register(userInfo) {
  const { username, password } = userInfo
  return request({
    url: '/auth/register',
    method: 'post',
    data: { user_name: username.trim(), password },
  })
}
