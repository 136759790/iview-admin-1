<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="query.nickname"/>
            <Button @click="handleGetUsers" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNew" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑用户" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="帐号：" prop="account" label-position="left">
                        <Input v-model="form.edit.account" :disabled="disabled" placeholder="请输入帐号" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="密码：" prop="password" label-position="top">
                        <Input v-model="form.edit.password" :disabled="disabled" type="password" placeholder="请输入密码" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="昵称：" prop="nickname" label-position="left">
                        <Input v-model="form.edit.nickname" placeholder="请输入昵称" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="手机号：" prop="phone" label-position="top">
                        <Input   v-model="form.edit.phone" placeholder="请输入手机号" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="邮箱：" prop="email" label-position="top">
                        <Input v-model="form.edit.email" placeholder="请输入email" />
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
import BaseUpload from '@/view/base/base_upload'
import UserDetail from '@/view/backend/user_detail'
import { pageUser,isExist,saveUser,deleteUser,oneUser } from '@/api/user'
export default {
    components: {
        BaseUpload
    },
  data () {
    return {
        disabled:false,
        modal:{
            delete:false
        },
        drawer:{
            edit:false,
        },
        form:{
            edit:{
                account:'',
                password:'',
                nickname:'',
                phone:'',
                email:'',
            },
        },
        rules:{
            edit:{
                account:[
                    {required:true,message:'帐号不能为空',trigger:'blur'}
                    ],
                password:[{required:true,message:'密码不能为空',trigger:'blur'}],
                nickname:[{required:true,message:'昵称不能为空',trigger:'blur'}],
                phone:[{required:true,message:'手机号不能为空',trigger:'blur'}],
                email:[
                    {required:true,message:'邮箱不能为空',trigger:'blur'},
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
                ],
                u_order:[
                    {required:true,message:'顺序不能为空',trigger:'blur'},
                ],
            },
        },
        columns: [
            {type:'expand',width:50,render:(h,params)=>{
                return h(UserDetail,{
                    props:{
                        row:params.row
                    }
                })
            }},
            {title: '#',key: 'id'},
            {title: '昵称',key: 'nickname'},
            {title: '帐号',key: 'account'},
            {title: '创建时间',key: 'ctime'},
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
        page:{
            current:1,
            total:0,
            pageSize:10
        },
      query:{
          nickname:'',
      }

    }
  },
  methods: {
    handleNew(){
        this.drawer.edit = true
        this.disabled=false
    },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetUsers();
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                saveUser(this.form.edit).then(res=>{
                    this.$Message.success('保存成功');
                    this.handleGetUsers();
                    this.$refs[name].resetFields();
                    this.drawer.edit=false
                });
            } else {
                this.$Message.error('请按照格式填写表单!');
            }
        })
    },
    handleGetUsers(){
        pageUser(this.query).then((res)=>{
            this.data = res.data.list;
            this.page.current=res.data.pageNum
            this.page.total=res.data.total
            this.page.pageSize=res.data.pageSize
        });
    },
    handleDelete (params) {
        let config={
            title:'提醒',
            content:'确定要删除昵称为：'+params.row.nickname+"的记录？",
            onOk:()=>{
                let id = params.row.id;
                deleteUser(id).then(res =>{
                    this.handleGetUsers()
                    this.$Message.success(res.msg)
                })
            },
            onCancel:()=>{return false},
        }
        let confirm = this.$Modal.confirm(config);
    },
    handleEdit (params) {
        let id = params.row.id;
        oneUser(id).then(res =>{
            this.form.edit = res.data
            this.disabled=true
            this.drawer.edit = true
        })
    }
  },
  mounted () {
    this.handleGetUsers();
  }
}
</script>

<style>

</style>
