/**
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { getUserInfo, login } from '@/api/user'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'
import defaultAvatar from '@/assets/avatar/default_avatar.jpeg'

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  nickname: (state) => state.nickname,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  getUserInfo: (state) => state,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar || defaultAvatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  setEmail(state, email) {
    state.email = email
  },
  setNickname(state, nickname) {
    state.nickname = nickname
  },
  setUserInfo(state, payload) {
    state = Object.assign(state, ...payload)
  },
}
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const { data } = await login({
      username: username.trim(),
      password: password,
    })
    const accessToken = data.token
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(`登录接口异常，未正确返回${tokenName}...`, 'error')
    }
  },
  async getUserInfo({ commit }) {
    const { data } = await getUserInfo()
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let { permissions = ['admin'], username, avatar, nickname, email } = data
    if (permissions && username && Array.isArray(permissions)) {
      commit('setPermissions', permissions)
      commit('setUsername', username)
      commit('setAvatar', avatar)
      commit('setEmail', email)
      commit('setNickname', nickname)
      return permissions
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      return false
    }
  },
  async logout({ dispatch }) {
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
