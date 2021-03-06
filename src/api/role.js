import axios from '@/libs/api.request'

export const listRole=(params)=>{
  //role_code,id,role_name,role_remark,role_enable,user_id,res_id
  return axios.request({
    url: '/sys/roles',
    method: 'get',
    params:params
  })
}
export const deleteRole=(id)=>{
  return axios.request({
    url: '/sys/role/delete/'+id,
    method: 'get'
  })
}
export const updateRole=(vo)=>{
  return axios.request({
    url: '/sys/role/add/',
    method: 'post',
    data:vo
  })
}
export const getRole=(id)=>{
  return axios.request({
    url: '/sys/role/'+id,
    method: 'get'
  })
}
export const isCodeExsits=(code)=>{
  return axios.request({
    url: '/sys/role/code/exists',
    method: 'get',
    params:{role_code:code}
  })
}
export const getResTree=(role_id)=>{
  return axios.request({
    url: 'res/tree',
    method: 'get',
    params:{role_id:role_id}
  })
}


export const addRoleUser=(role_id,user_id)=>{
  return axios.request({
    url: '/sys/role/user',
    method: 'post',
    data:{role_id:role_id,user_id:user_id}
  })
}
export const delRoleUser=(role_id,user_id)=>{
  return axios.request({
    url: '/sys/role/user/delete',
    method: 'post',
    data:{role_id:role_id,user_id:user_id}
  })
}

