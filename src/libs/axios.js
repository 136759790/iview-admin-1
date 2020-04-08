import axios from 'axios'
import { Message } from 'iview'
import store from '@/store'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  console.log(errorInfo);
  // const { statusText, status, request: { responseURL } } = errorInfo
  // let info = {
  //   type: 'ajax',
  //   code: status,
  //   mes: statusText,
  //   url: responseURL
  // }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      },
      withCredentials: true
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {

      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if(res.data.status == 1){
        // Message.success(res.data.msg);
      }else if(res.data.status == 2){
        //静默成功
      }else{
        Message.error('系统繁忙请联系管理员!');
      }
      return res.data
    }, error => {
      this.destroy(url)
      Message.error('系统繁忙请联系管理员!');
      addErrorLog(error.response)
      return Promise.reject(error)
    })
  }
  request (options) {
    axios.defaults.withCredentials=true;
    const instance = axios.create({withCredentials: true})
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
