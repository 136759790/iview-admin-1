<template>
  <div>
        <Card>
            <p slot="title">
                详细信息
            </p>
            <Row>
                <Col span="8">
                    <span>ID：</span>
                    <span>{{row.id}}</span>
                </Col>
                <Col span="8">
                    <span>账号：</span>
                    <span>{{row.account}}</span>
                </Col>
                <Col span="8">
                    <span>昵称：</span>
                    <span>{{row.nickname}}</span>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="8">
                    <span>手机：</span>
                    <span>{{row.phone}}</span>
                </Col>
                <Col span="8">
                    <span>email：</span>
                    <span>{{row.email}}</span>
                </Col>
                <Col span="8">
                    <span>创建时间：</span>
                    <span>{{row.ctime}}</span>
                </Col>
            </Row>
        </Card><br>
  </div>
</template>

<script>
import { getWxInfo } from '@/api/user'
export default {
    props:{
        row:Object
    },
    data(){
        return {
            wx:{}
        }
    },
    mounted(){
        getWxInfo(this.row.id).then(res => {
            this.wx = res.data.data
            let sex = res.data.data.sex
            if(sex == 1){
                this.wx.sex = '男'
            }else if(sex == 2){
                this.wx.sex = '女'
            }else{
                this.wx.sex = '其他'
            }
        })
    }
}
</script>
