import request from '@/utils/request'

export function getProjectList() {
  return request({
    url: '/project',
  })
}

export function createProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data,
  })
}

export function deleteProject(p_id) {
  return request({
    url: `/project/${p_id}`,
    method: 'delete',
  })
}

export function getProjectInfo(p_id) {
  return request({
    url: `/project/${p_id}`,
  })
}
