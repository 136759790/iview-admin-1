<template>
    <div>
        {{username}}
        <Button type="primary" @click="handleQueryUser" slot="append" icon="ios-search">选择人员</Button>
        <Modal v-model="show" width="1200px" title="请选择人员">
            <Card>
                <div class="search-con search-con-top">
                    <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="query.nickname" />
                    <Button @click="handleGetUsers" class="search-btn" type="primary">
                        <Icon type="search" />搜索</Button>
                </div>
                <Table size="small" :columns="columns" :data="data"></Table>
                <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" show-total
                    style="margin: 10px 0" @on-change="handleChangePage" />
            </Card>
        </Modal>
    </div>
</template>

<script>
    import { pageUser,oneUser} from '@/api/user'
    export default {
        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            id:{
                type:Number
            }
        },
        data() {
            return {
                username:'',
                show: false,
                columns: [
                    { title: '昵称', key: 'nickname' },
                    { title: '帐号', key: 'account' },
                    { title: '创建时间', key: 'ctime' },
                    {
                        title: '操作',
                        key: 'status',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleChooseUser(params)
                                        }
                                    }
                                }, '选择'),
                            ]);
                        }
                    }
                ],
                data: [],
                page: {
                    current: 1,
                    total: 0,
                    pageSize: 10
                },
                query: {
                    nickname: '',
                }
            }
        },
        computed: {
        },
        methods: {
            handleQueryUser() {
                this.show = true
            },
            handleGetUsers(){
                pageUser(this.query).then((res)=>{
                    this.data = res.data.list;
                    this.page.current=res.data.pageNum
                    this.page.total=res.data.total
                    this.page.pageSize=res.data.pageSize
                });
            },
            handleChooseUser(params){
                this.username = params.row.nickname
                this.$emit("on-ok", params.row)
                this.show=false
                this.query={}
            },
            handleChangePage(page){
                this.query.page = page;
                this.handleGetUsers();
            },
            handleShowUser(id){
                oneUser(id).then(res=>{
                    this.username = res.data.nickname
                })
            }
        },
        watch: {
        },
        mounted() {
            this.handleGetUsers()
            if(id){
                this.handleShowUser(id)
            }
        }
    }
</script>
<style>
</style>