<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="query.nickname"/>
            <Button @click="handlePage" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
        </div>
        <Table size="small" :columns="columns" :data="data"></Table>
        <Page :total="query.total" :current="query.page" :page-size="query.rows" size="small" 
        show-total style="margin: 10px 0" @on-change="handlePage" />
    </Card>
  </div>
</template>

<script>
import './index.less'
import { page,auditing } from '@/api/backend/apply'
export default {
  data () {
    return {
        query:{
            total:0,
            page:1,
            rows:10,
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
            {title: '#',key: 'id'},
            {title: '申请人姓名',key: 'applicant_name'},
            {title: '手机号',key: 'applicant_phone'},
            {title: '申请时间',key: 'ctime'},
            {   
                title: '申请类型',
                key: 'type',
                render:(h,params) =>{
                    const map={
                        0:'申请成为卡车中介'
                    }
                    return h('span',map[params.row.type])
                }
            },
            {   
                title: '状态',
                key: 'status',
                render:(h,params) =>{
                    const map={
                        0:'待审批',
                        1:'已同意',
                        2:'已拒绝',
                    }
                    return h('span',map[params.row.status])
                }
            },
            {
                title: '操作',
                key: 'status',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    if(params.row.status == 0){
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
                                        this.handleReject(params)
                                    }
                                }
                            }, '驳回'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.handleAgree(params)
                                    }
                                }
                            }, '同意')
                        ]);
                    }
                }
            }
        ],
        data: [],
    }
  },
  methods: {
    handleReject(params){
        auditing({id:params.row.id,status:2}).then(res=>{
            this.handlePage()
        })
    },
    handleAgree(params){
        auditing({id:params.row.id,status:1}).then(res=>{
            this.handlePage()
        })
    },
    handlePage(){
        page(this.query).then(res=>{
            const list = res.data.list
            this.data = list
            this.query.total = res.data.total
            this.query.page = res.data.pageNum
        })
    },
  },
  mounted () {
    this.handlePage();
  }
}
</script>

<style>

</style>
