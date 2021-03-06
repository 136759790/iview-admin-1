import axios from '@/libs/api.request'

export const tenantSave = (data) => {
  return axios.request({
    url: '/tenant/save',
    method: 'post',
    data: data
  })
}
export const tenantOne = (id) => {
  return axios.request({
    url: '/tenant/one',
    method: 'get',
    params: {id:id}
  })
}
export const tenantPage = (data) => {
  return axios.request({
    url: '/tenant/page',
    method: 'post',
    data: data
  })
}
export const tenantDel = (id) => {
  return axios.request({
    url: '/tenant/delete',
    method: 'get',
    params: {id:id}
  })
}

