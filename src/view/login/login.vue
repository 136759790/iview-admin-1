<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入正确的用户名密码 <a href="#">忘记密码？</a></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { login} from '@/api/user'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      let data = {
        username:userName,
        password:password
      }
      login(data).then(res => {
        if(res.data.status == 0){
          this.$Message.error(res.data.msg);
        }else if(res.data.status == 1){
          this.$router.push({
            name: this.$config.homeName
          })
          console.log(this.$router)
        }
        console.log(res)
      }).catch(e => {
        console.log(e)
      })
      // this.handleLogin({ userName, password }).then(res => {
      //   console.log(1111,res);
      //   this.getUserInfo().then(res => {
      //     this.$router.push({
      //       name: this.$config.homeName
      //     })
      //   })
      // })
    }
  }
}
</script>

<style>

</style>
