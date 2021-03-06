import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/user/login',
    data,
    method: 'post'
  })
}
export const isLogin=()=>{
  return axios.request({
    url: '/sys/isLogin',
    method: 'get'
  })
}
export const saveUser=(data)=>{
  return axios.request({
    url: '/user/save',
    method: 'post',
    data:data
  })
}
export const currentUser=()=>{
  return axios.request({
    url: '/user/current',
    method: 'get',
  })
}
export const deleteUser=(id)=>{
  return axios.request({
    url: 'user/delete',
    method: 'get',
    params:{id:id}
  })
}
export const isExist=(username)=>{
  return axios.request({
    url: '/sys/checkUsername',
    params:{username:username},
    method: 'get'
  })
}
export const pageUser= query =>{
  return axios.request({
    url: '/user/page',
    data:query,
    method: 'post'
  })
}
export const oneUser= id =>{
  return axios.request({
    url: '/user/one',
    method: 'get',
    params:{id:id}
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/sys/loginUser',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
export const logoutUser = () => {
  return axios.request({
    url: '/sys/user/logout',
    method: 'post',
  })
}
export const getWxInfo = (id) => {
  return axios.request({
    url: '/sys/user/wx',
    method: 'get',
    params:{user_id:id}
  })
}
export const getUserVo = () => {
  return axios.request({
    url: '/user/vo',
    method: 'get',
  })
}

