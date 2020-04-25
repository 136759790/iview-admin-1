import axios from '@/libs/api.request'
export const save=(data)=>{
    return axios.request({
      url: '/mp/shop/save',
      method: 'post',
      data:data
    })
}
export const page=(data)=>{
    return axios.request({
      url: '/mp/shop/page',
      method: 'post',
      data:data
    })
}
export const del=(params)=>{
    return axios.request({
      url: '/mp/shop/del',
      method: 'get',
      params:params
    })
}
export const listByname=(name)=>{
    return axios.request({
      url: '/mp/shop/listByName',
      method: 'get',
      params:{name:name}
    })
}
export const one= id =>{
    return axios.request({
      url: '/mp/shop/one',
      method: 'get',
      params:{"id":id}
    })
}