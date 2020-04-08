<template>
    <div>
      <Card>
          <div class="search-con search-con-top">
              <Input  clearable placeholder="输入名称搜索" class="search-input" v-model="params.name"/>
              <Button @click="handlePage" class="search-btn" type="primary">搜索</Button>
              <Button @click="handleNewShop" class="search-btn" type="success">新增</Button>
          </div>
          <Table size="small" stripe  :columns="columns" :data="data"></Table>
          <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
          show-total style="margin: 10px 0" @on-change="handleChangePage" />
      </Card>
      <Drawer title="编辑商店" v-model="drawer.edit" width="720" :mask-closable="true" >
          <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
              <Row :gutter="32">
                  <Col span="24">
                      <FormItem label="商店名称：" prop="name" label-position="left">
                          <Input v-model="form.edit.name" placeholder="请输入商店名称" />
                      </FormItem>
                  </Col>
              </Row>
              <Row :gutter="32">
                  <Col span="24">
                      <FormItem label="店主：" prop="owner" label-position="left">
                          <Select
                            v-model="form.edit.owner"
                            placeholder="请选择店主"
                            filterable
                            remote
                            :remote-method="filterByName"
                            :loading="loading">
                            <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
                        </Select>
                      </FormItem>
                  </Col>
              </Row>
              <Row :gutter="32">
                  <Col span="24">
                      <FormItem label="商店位置：" prop="location" label-position="left">
                          <Input v-model="form.edit.location" placeholder="请输入商店位置" />
                      </FormItem>
                  </Col>
              </Row>
              <Row :gutter="32">
                  <Col span="24">
                      <FormItem label="店内公告：" prop="notice" label-position="left">
                          <Input v-model="form.edit.notice" type="textarea" :rows="4" placeholder="请输入店内公告" />
                      </FormItem>
                  </Col>
              </Row>
          </Form>
          <div style="margin-left:40%;margin-top:10%">
              <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
              <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
          </div>
      </Drawer>
    </div>
  </template>
  
  <script>
  import './index.less'
  import { save,del,page,one } from '@/api/mp/shop'
  import { getAllUser} from '@/api/user'
  import expandRow from './shop-expand.vue';
  export default {
      components: {
          expandRow 
      },
    data () {
      return {
          loading : false,
          options:[],
          modal:{
              delete:false,
          },
          drawer:{
              edit:false,
          },
          form:{
              edit:{
                  code:'',
                  name:'',
                  desc:'',
              },
          },
          rules:{
              edit:{
                  name:[{required:true,message:'名称不能为空',trigger:'blur'}],
              },
          },
          columns: [
              {
                  type: 'expand',
                  width: 50,
                  render: (h, params) => {
                      return h(expandRow, {
                          props: {
                              row: params.row
                          }
                      })
                  }
              },
              {title: 'ID',key: 'id'},
              {title: '商店名称',key: 'name'},
              {title: '店内公告',key: 'notice'},
              {
                  title: '操作',
                  key: 'status',
                  width: 200,
                  align: 'center',
                  render: (h, params) => {
                      return h('div', [
                          h('Button', {
                              props: {
                                  type: 'error',
                                  size: 'small'
                              },
                              style:{
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
                              style:{
                                  marginRight: '5px'
                              },
                              on: {
                                  click: () => {
                                      this.handleEdit(params)
                                  }
                              }
                          }, '编辑')
                      ]);
                  }
              }
          ],
          data: [],
          data_tree: [],
          params:{
              code:'',
              name:''
          },
          page:{
              current:1,
              total:0,
              pageSize:10,
          },
          pageOption:{
              current:1,
              total:0,
              pageSize:10,
          },
          select_id:'',
          select_name:'',
      }
    },
    methods: {
        filterByName(name){
            if(name != ''){
                this.loading = true;
                getAllUser({username:name}).then(res =>{
                    res.data.list.forEach(e => {
                        this.options.push({
                            "label":e.username,
                            "value":e.id
                        })
                    });
                });
                this.loading = false
            }else{
                this.options=[];
            }
        },
        handleNewShop(){
          this.form.edit={};
          this.drawer.edit = true
      },
      handleChangePage(page){
          this.params.page = page;
      },
      handlePage(){
        page(this.params).then(res =>{
            this.data = res.data.list
        })
      },
      handleSubmit (name) {
          let data = this.form.edit
          this.$refs[name].validate((valid) => {
              if (valid) {
                  save(data).then(res=>{
                      this.data = res.data.list
                      this.page.current=res.data.pageNum
                      this.page.total=res.data.total
                      this.page.pageSize=res.data.pageSize
                      this.$Message.success(res.msg);
                      this.$refs[name].resetFields();
                      this.drawer.edit=false
                      this.handlePage()
                  })
              } else {
                  this.$Message.error('请按照格式填写表单!');
              }
          })
      },
      handleDelete (params) {
          let config={
              title:'提醒',
              content:'确定要删除id为：'+params.row.id+"的记录？",
              onOk:()=>{
                  let id = params.row.id;
                  delSelect(id).then(res =>{
                      if(res.data.status == 1){
                          this.$Message.success(res.data.msg)
                      }else{
                          this.$Message.error(res.data.msg)
                      }
                  })
              },
              onCancel:()=>{return false},
          }
          let confirm = this.$Modal.confirm(config);
      },
      handleEdit (params) {
          let id = params.row.id;
          one(id).then(res =>{
              this.form.edit = res.data
              this.drawer.edit = true;
          })
      },
      renderContent (h, { root, node, data }) {
          return h('span', {
              style: {
                  display: 'inline-block',
                  width: '100%'
              }
          }, [
              h('span', [
                  h('Icon', {
                      props: {
                          type: 'ios-paper-outline'
                      },
                      style: {
                          marginRight: '8px'
                      }
                  }),
                  h('span', data.title)
              ]),
              h('span', {
                  style: {
                      display: 'inline-block',
                      float: 'right',
                      marginRight: '200px'
                  }
              }, [
                  h('span', data.attributes?data.attributes.value:'')
              ])
          ]);
      },
    },
    mounted () {
        this.handlePage()
    }
  }
  </script>
  
  <style>
  
  </style>
  