import request from '@/utils/request'

export function getErrorList(params) {
  return request({
    url: '/analyse/error-list',
    params,
  })
}

export function getErrorDetail(error_id) {
  return request({
    url: `/analyse/error/${error_id}`,
  })
}

export function getLineChartErrorList(params) {
  return request({
    url: '/analyse/line-chart-error-list',
    params,
  })
}
