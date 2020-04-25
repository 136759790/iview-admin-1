import axios from '@/libs/api.request'
export const save=(data)=>{
    return axios.request({
      url: '/mp/menu/save',
      method: 'post',
      data:data
    })
}
export const page=(data)=>{
    return axios.request({
      url: '/mp/menu/page',
      method: 'post',
      data:data
    })
}
export const del=(params)=>{
    return axios.request({
      url: '/mp/menu/del',
      method: 'get',
      params:params
    })
}
export const one= id =>{
    return axios.request({
      url: '/mp/menu/one',
      method: 'get',
      params:{"id":id}
    })
}
export const direction= (id1,id2) =>{
    return axios.request({
      url: '/mp/menu/direction',
      method: 'get',
      params:{"origin_id":id1,"target_id":id2}
    })
}
export const saveGroup=(data)=>{
  return axios.request({
    url: '/mp/menu/saveGroup',
    method: 'post',
    data:data
  })
}
export const pageGroup=(data)=>{
  return axios.request({
    url: '/mp/menu/pageGroup',
    method: 'get',
    params:data
  })
}
export const delGroup=(params)=>{
  return axios.request({
    url: '/mp/menu/delGroup',
    method: 'get',
    params:params
  })
}
export const oneGroup= id =>{
  return axios.request({
    url: '/mp/menu/oneGroup',
    method: 'get',
    params:{"id":id}
  })
}
export const listGroup=(data)=>{
  return axios.request({
    url: '/mp/menu/listGroup',
    method: 'get',
    params:data
  })
}