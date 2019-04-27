import axios from '@/libs/api.request'


export const getRess=(params)=>{
  return axios.request({
    url: '/res/ress',
    method: 'get',
    params:params
  })
}
export const getRes=(id)=>{
  return axios.request({
    url: '/res/'+id,
    method: 'get',
  })
}
export const delRes=(id)=>{
  return axios.request({
    url: '/res/delete/'+id,
    method: 'get',
  })
}
export const addOrUpdateRes=(data)=>{
  return axios.request({
    url: '/res/add',
    method: 'post',
    data:data
  })
}
export const resTree=(params)=>{
  return axios.request({
    url: '/res/tree/iview',
    method: 'get',
    params:params
  })
}
export const getResTree=(role_id)=>{
  return axios.request({
    url: 'res/tree',
    method: 'get',
    params:{role_id:role_id}
  })
}

