import axios from '@/libs/api.request'


export const addRoleRes=(data)=>{
  return axios.request({
    url: '/ref/role/res',
    method: 'post',
    data:data
  })
}
export const deleteRoleRes=(data)=>{
  return axios.request({
    url: '/ref/role/res/delete',
    method: 'post',
    data:data
  })
}
