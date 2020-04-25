import axios from '@/libs/api.request'
export const getAttaches=(module_type,module_id)=>{
  return axios.request({
    url: '/attach/list',
    method: 'get',
    params:{
      module_type:module_type,
      module_id:module_id,
    }
  })
}
export const deleteAttach=(module_type,module_id)=>{
  return axios.request({
    url: '/attach/delete',
    method: 'get',
    params:{
      module_type:module_type,
      module_id:module_id,
    }
  })
}



