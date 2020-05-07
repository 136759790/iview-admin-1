import axios from '@/libs/api.request'

export const projectSave = (data) => {
  return axios.request({
    url: '/project/save',
    method: 'post',
    data: data
  })
}
export const projectOne = (id) => {
  return axios.request({
    url: '/project/one',
    method: 'get',
    params: {id:id}
  })
}
export const projectPage = (data) => {
  return axios.request({
    url: '/project/page',
    method: 'post',
    data: data
  })
}
export const projectDel = (id) => {
  return axios.request({
    url: '/project/delete',
    method: 'get',
    params: {id:id}
  })
}

