<template>
    <div>
        <Card>
            <div class="search-con search-con-top">
                <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="query.keyword" />
                <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
                <Button @click="handleNew" class="search-btn" type="success">新增</Button>
            </div>
            <Table size="small" stripe :columns="columns" :data="data"></Table>
            <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" show-total
                style="margin: 10px 0" @on-change="handlePage" />
        </Card>
        <Drawer title="编辑租户" v-model="drawer.edit" width="720" :mask-closable="false">
            <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input v-model="form.edit.name" placeholder="请输入名称" />
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="管理员：" prop="admin_id" label-position="left">
                        <ChooseUser @on-ok="handleChooseUser"></ChooseUser>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div style="margin-left:40%;margin-top:10%">
                <Button style="margin-right: 8px" @click="drawer.edit = false">取消</Button>
                <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import './index.less'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import Treeselect from '@riophae/vue-treeselect'
    import ChooseUser from '@/view/base/choose_user'
    import { tenantSave, tenantOne, tenantPage, tenantDel } from '@/api/backend/tenant'
    export default {
        components: {
            Treeselect,ChooseUser
        },
        data() {
            return {
                query: {},
                columns: [
                    { title: '#', key: 'id' },
                    { title: '租户名称', key: 'name' },
                    { title: '创建时间', key: 'ctime' },
                    {
                        title: '操作',
                        key: 'status',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: { marginRight: '5px' },
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
                                    style: { marginRight: '5px' },
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
                page: {},
                form: {
                    edit: {}
                },
                nickname:'',
                drawer: {
                    edit:false
                },
                rules: {
                    edit: {
                        name: [{ required: true, message: '租户名称不能为空', trigger: 'blur' }],
                    },
                },
            }
        },
        methods: {
            handleChooseUser(row){
                this.form.edit.admin_id = row.id
                this.nickname = row.nickname
            },
            handleSearch() {
                tenantPage(this.query).then(res => {
                    this.data = res.data.list
                    this.page.current = res.data.pageNum
                    this.page.total = res.data.total
                    this.page.pageSize = res.data.pageSize
                })
            },
            handleNew() {
                this.nickname=''
                this.form.edit = {}
                this.drawer.edit = true
            },
            handleSubmit(name) {
                let data = this.form.edit
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        tenantSave(data).then(res => {
                            this.$Message.success(res.msg);
                            this.$refs[name].resetFields();
                            this.drawer.edit = false
                            this.handleSearch()
                        })
                    } else {
                        this.$Message.error('请按照格式填写表单!');
                    }
                })
            },
            handleEdit(params){
                let id = params.row.id
                tenantOne(id).then(res=>{
                    this.form.edit=res.data
                    this.nickname = res.data.nickname
                    this.drawer.edit = true
                })
            },
            handleDelete(params){
                let id = params.row.id
                tenantDel(id).then(res=>{
                    this.handleSearch()
                })
            },
            handlePage() {

            }
        },
        mounted() {
            this.handleSearch()
        }
    }
</script>

<style>

</style>