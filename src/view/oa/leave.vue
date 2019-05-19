<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="query.nickname"/>
            <Button @click="handleGetLeaves" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNewLeave" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small"
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="新增请假" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit" :label-width="120">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="假期类型：" prop="type" label-position="left">
                        <BaseSelect code="leave_type" :value.sync="form.edit.type" placeholder="请选择假期类型" style="width:200px"/>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="剩余天数：" prop="restday" label-position="left" style="width:200px">
                        {{30}}天
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="开始日期：" prop="stime" label-position="left">
                        <DatePicker type="date" placeholder="请选择开始时间" v-model="form.edit.stime" ></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="开始时间：" prop="sampm" label-position="left">
                        <BaseSelect code="ampm" :value.sync="form.edit.sampm" placeholder="请选择开始时间" style="width:200px"/>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                  <Col span="12">
                    <FormItem label="结束日期：" prop="etime" label-position="left">
                        <DatePicker type="date" placeholder="请输入结束时间" v-model="form.edit.etime" ></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="结束时间：" prop="eampm" label-position="left">
                        <BaseSelect code="ampm" :value.sync="form.edit.eampm" placeholder="请选择结束时间" style="width:200px"/>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                    <Col span="24">
                        <FormItem label="原因：" prop="description" label-position="left">
                            <Input v-model="form.edit.description" type="textarea" placeholder="请输入请假原因" />
                        </FormItem>
                    </Col>
            </Row>
        </Form>
        <div align="center">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>
  </div>
</template>

<script>
import './index.less'
import BaseSelect from '@/view/base/base_select'
import transelect from '@/view/base/tran_select'
import LeaveExpand from '@/view/oa/leaveExpand'
import { saveLeave,getLeaves,deleteLeave,getLeave,submitLeave } from '@/api/oa/leave'
export default {
  components: {
    BaseSelect,transelect
  },
  data () {
    return {
      modal: {
        delete: false
      },
      drawer: {
        edit: false,
      },
      form: {
        edit: {
          sampm:'0',
          eampm:'1'
        },
      },
      rules: {
        edit: {
          type: [{required: true, message: '假期类型不能为空', trigger: 'blur'}],
          stime: [{required: true, message: '开始时间不能为空', trigger: 'blur',pattern: /.+/}],
          etime: [{required: true, message: '结束时间不能为空', trigger: 'blur',pattern: /.+/}],
          description: [{required: true, message: '请假原因不能为空', trigger: 'blur'}],
        },
      },
      columns: [
        {type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(LeaveExpand, {
              props: {
                row: params.row
              }
            })
          }},
        {title: '#', key: 'id'},
        { 
          title: '假期类型', 
          key: 'type',
          render: (h, params) => {
            return h(transelect, {
              props:{
                code:'leave_type',
                value:params.row.type
              }
            })
          }
        },
        { 
          title: '流程状态', 
          key: 'status',
          render: (h, params) => {
            return h(transelect, {
              props:{
                code:'leave_status',
                value:params.row.status
              }
            })
          }
        },
        {title: '开始时间', key: 'stime'},
        {title: '结束时间', key: 'etime'},
        {
          title: '操作',
          key: 'status',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleDelete(params)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleEdit(params)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      data: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      },
      query: {}

    }
  },
  methods: {
    handleChangePage (page) {
      this.query.page = page
      this.handleGetLeaves()
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          saveLeave(this.form.edit).then(res => {
            if (res.data.status == 1) {
              this.$Message.success('保存成功')
              this.handleGetLeaves()
              this.$refs[name].resetFields()
              this.drawer.edit = false
            }
          })
        } else {
          this.$Message.error('请按照格式填写表单!')
        }
      })
    },
    handleGetLeaves () {
      getLeaves(this.query).then((res) => {
        this.data = res.data.data.rows
        this.page.current = res.data.data.pageNum
        this.page.total = res.data.data.total
        this.page.pageSize = res.data.data.pageSize
      })
    },
    handleDelete (params) {
      let config = {
        title: '提醒',
        content: '确定要删除id为：' + params.row.id + '的记录？',
        onOk: () => {
          let id = params.row.id
          deleteLeave(id).then(res => {
            if (res.data.status == 1) {
              this.$Message.success(res.data.msg)
              this.handleGetLeaves()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        },
        onCancel: () => { return false }
      }
      let confirm = this.$Modal.confirm(config)
    },
    handleEdit (params) {
      this.form.edit = params.row
      this.drawer.edit = true
    },
    handleNewLeave(){
      this.form.edit = {
        type:0,
        sampm:0,
        eampm:1,
      }
      this.drawer.edit = true
    }
  },
  mounted () {
    this.handleGetLeaves()
  }
}
</script>

<style>

</style>
