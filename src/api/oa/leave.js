import axios from '@/libs/api.request'
export const saveLeave=(data)=>{
  return axios.request({
    url: '/oa/leave/save',
    method: 'post',
    data:data
  })
}
export const getLeaves=(params)=>{
  return axios.request({
    url: '/oa/leave/leaves',
    method: 'get',
    params:params
  })
}
export const deleteLeave=(id)=>{
  return axios.request({
    url: '/oa/leave/delete/'+id,
    method: 'get',
  })
}
export const getLeave=(id)=>{
  return axios.request({
    url: '/oa/leave/'+id,
    method: 'get',
  })
}
export const submitLeave=(id)=>{
  return axios.request({
    url: '/oa/leave/submit',
    method: 'post',
    params:{id:id}
  })
}
