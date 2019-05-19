import axios from '@/libs/api.request'
export const getFlows=(params)=>{
  return axios.request({
    url: '/oa/flow/flows',
    method: 'get',
    params:params
  })
}
