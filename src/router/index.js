/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

// icon在以下地址找.
// https://vue-admin-beautiful.com/vue-admin-beautiful-element/#/vab/icon/awesomeIcon
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: ' 项目中心',
          icon: 'chart-bar',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/personal-center',
    component: Layout,
    redirect: 'noRedirect',
    name: 'personalCenter',
    alwaysShow: true,
    meta: { title: ' 个人中心', icon: 'user-cog' },
    children: [
      {
        path: 'account-info',
        name: 'accountInfo',
        component: () => import('@/views/personal/account'),
        meta: {
          title: ' 账号信息',
        },
      },
      {
        path: 'change-password',
        name: 'changePassword',
        component: () => import('@/views/personal/change-password'),
        meta: {
          title: ' 修改密码',
        },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'system',
    meta: {
      title: ' 系统配置',
      icon: 'users-cog',
      permissions: ['admin'],
      affix: true,
    },
    children: [
      {
        path: 'white-list',
        name: 'whitelist',
        component: () => import('@/views/system/white-list/index'),
        meta: { title: '项目白名单', permissions: ['admin'] },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/system/users/index'),
        meta: { title: '成员管理', permissions: ['admin'] },
      },
    ],
  },
  // {
  //   path: '/vab',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Vab',
  //   alwaysShow: true,
  //   meta: { title: ' 组件', icon: 'box-open' },
  //   children: [
  //     {
  //       path: 'permissions',
  //       name: 'Permission',
  //       component: () => import('@/views/vab/permissions/index'),
  //       meta: {
  //         title: '角色权限',
  //         permissions: ['admin', 'editor'],
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/personnelManagement',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'PersonnelManagement',
  //   meta: { title: '配置', icon: 'users-cog', permissions: ['admin'] },
  //   children: [
  //     {
  //       path: 'userManagement',
  //       name: 'UserManagement',
  //       component: () =>
  //         import('@/views/personnelManagement/userManagement/index'),
  //       meta: { title: '用户管理' },
  //     },
  //     {
  //       path: 'roleManagement',
  //       name: 'RoleManagement',
  //       component: () =>
  //         import('@/views/personnelManagement/roleManagement/index'),
  //       meta: { title: '角色管理' },
  //     },
  //     {
  //       path: 'menuManagement',
  //       name: 'MenuManagement',
  //       component: () =>
  //         import('@/views/personnelManagement/menuManagement/index'),
  //       meta: { title: '菜单管理', badge: 'New' },
  //     },
  //   ],
  // },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
