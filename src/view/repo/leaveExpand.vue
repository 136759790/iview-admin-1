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
                    <span>：</span>
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
        </Card>
    
  </div>
</template>

<script>
import './index.less'
import BaseSelect from '@/view/base/base_select'
import transelect from '@/view/base/tran_select'
import { saveLeave,getLeaves,deleteLeave,getLeave } from '@/api/oa/leave'
export default {
  components: {
    BaseSelect,transelect
  },
  props:{
    row:Object
  },
}
</script>