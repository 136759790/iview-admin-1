import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'view-design'
import { isLogin } from '@/api/user'
import config from '@/config'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})

const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  next();
  // if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  // else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  // let ress = router.app.$store.state.user.access;
  // if(ress && ress !='' && ress.indexOf(to.name) == -1 && to.name != LOGIN_PAGE_NAME && to.name != 'home'){
  //   router.app.$Message.error('你没有访问'+to.meta.title+'的权限。');
  //   return
  // }

  iView.LoadingBar.start()
  if(to.name === LOGIN_PAGE_NAME){//登录页面不拦截
    isLogin().then(res=>{
      if(res.data === true){
        next({
          name: 'home' // 跳转到登录页
        })
      }else{
        next()
      }
    }).catch(e=>{
      next()
    });
    next()
  }else{
    isLogin().then(res=>{
      if(res.data === true){
        next()
      }else{
        next({
          name: LOGIN_PAGE_NAME // 跳转到登录页
        })
      }
    }).catch(e=>{
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    });
  }
  // next()
  // const token = true
  // if (!token && to.name !== LOGIN_PAGE_NAME) {
  //   // 未登录且要跳转的页面不是登录页
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到登录页
  //   })
  // } else if (!token && to.name === LOGIN_PAGE_NAME) {
  //   // 未登陆且要跳转的页面是登录页
  //   next() // 跳转
  // } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   // 已登录且要跳转的页面是登录页
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到homeName页
  //   })
  // } else {
  //   if (store.state.user.hasGetInfo) {
  //     turnTo(to, store.state.user.access, next)
  //   } else {
  //     store.dispatch('getUserInfo').then(user => {
  //       // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
  //       turnTo(to, user, next)
  //     }).catch(() => {
  //       setToken('')
  //       next({
  //         name: 'login'
  //       })
  //     })
  //   }
  // }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
