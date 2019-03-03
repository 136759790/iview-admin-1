import axios from '@/libs/api.request'


export const getParks=()=>{
  return axios.request({
    url: '/coordinate/parks',
    method: 'get',
  })
}
export const getCoordinate=(id)=>{
  return axios.request({
    url: '/coordinate/'+id,
    method: 'get',
  })
}
export const getCoordinates=(params)=>{
  return axios.request({
    url: '/coordinate/'+id,
    method: 'get',
    params:params
  })
}
export const getMyParks=(params)=>{
  return axios.request({
    url: '/coordinate/myparks',
    method: 'get',
  })
}
export const saveCoordinate=(data)=>{
  return axios.request({
    url: '/coordinate/add',
    method: 'post',
    data:data
  })
}



