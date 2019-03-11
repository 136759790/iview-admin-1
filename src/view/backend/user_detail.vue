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
                    <span>{{row.username}}</span>
                </Col>
                <Col span="8">
                    <span>昵称：</span>
                    <span>{{row.nickname}}</span>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="8">
                    <span>年龄：</span>
                    <span>{{row.age}}</span>
                </Col>
                <Col span="8">
                    <span>手机：</span>
                    <span>{{row.phonenumber}}</span>
                </Col>
                <Col span="8">
                    <span>email：</span>
                    <span>{{row.email}}</span>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="8">
                    <span>地址：</span>
                    <span>{{row.address}}</span>
                </Col>
                <Col span="8">
                    <span>创建时间：</span>
                    <span>{{row.create_time}}</span>
                </Col>
                <Col span="8">
                    <span>状态：</span>
                    <span>{{row.status == 1?'有效':'无效'}}</span>
                </Col>
            </Row>
        </Card><br>
        <Card>
            <p slot="title">微信信息</p>
            <Row>
                <Col span="8">
                    <span>昵称：</span>
                    <span>{{wx.nickname}}</span>
                </Col>
                <Col span="8">
                    <span>openid：</span>
                    <span>{{wx.openid}}</span>
                </Col>
                <Col span="8">
                    <span>性别：</span>
                    <span>{{wx.sex}}</span>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="8">
                    <span>国家：</span>
                    <span>{{wx.country}}</span>
                </Col>
                <Col span="8">
                    <span>省份：</span>
                    <span>{{wx.province}}</span>
                </Col>
                <Col span="8">
                    <span>城市：</span>
                    <span>{{wx.city}}</span>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="8">
                    <span>头像：</span>
                    <span><img width="80px"  :src="wx.headimgurl"></span>
                </Col>
            </Row>
        </Card>
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
