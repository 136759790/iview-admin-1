import axios from '@/libs/api.request'

export const page = (param) => {
  return axios.request({
    url: '/apply/page',
    method: 'post',
    data: param
  })
}
export const auditing = (param) => {
  return axios.request({
    url: '/apply/auditing',
    method: 'get',
    params: param
  })
}

