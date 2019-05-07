<template>
  <div>
    <Card>
        <p slot="title">详细信息</p>
        <Row>
            <Col span="8">
                <span>ID：</span>
                <span>{{row.id}}</span>
            </Col>
            <Col span="8">
                <span>开始时间：</span>
                <span>{{row.stime}}  <transelect code="ampm" v-model="row.sampm"/></span>
            </Col>
            <Col span="8">
                <span>结束时间：</span>
                <span>{{row.etime}}  <transelect code="ampm" v-model="row.eampm"/></span>
            </Col>
        </Row>
        <br>
        <Row>
            <Col span="8">
                <span>假期类型：</span>
                <span><transelect code="leave_type" v-model="row.type"/></span>
            </Col>
            <Col span="16">
                <span>原因：</span>
                <span>{{row.description}}</span>
            </Col>
        </Row>
    </Card>
    <br/>
    <Card>
        <p slot="title">流程信息</p>
        <Row>
            <Col span="8">
                <span>当前状态：</span>
                <span><transelect code="leave_status" v-model="row.status"/></span>
            </Col>
            <Col span="8">
                <Button type="primary" @click="handleSubmit">提交</Button>
            </Col>
        </Row>
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
  methods:{
      handleSubmit(){
          
      }
  }
}
</script>