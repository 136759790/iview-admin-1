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
        <Drawer title="编辑项目" v-model="drawer.edit" width="720" :mask-closable="false">
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
                    <FormItem label="appkey：" prop="mp_appkey" label-position="left">
                        <Input v-model="form.edit.mp_appkey" placeholder="请输入appkey" />
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="secret" prop="mp_secret" label-position="left">
                        <Input v-model="form.edit.mp_secret" placeholder="请输入secret" />
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div style="margin-left:40%;margin-top:10%">
                <Button style="margin-right: 8px" @click="drawer.edit = false">取消</Button>
                <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
            </div>
        </Drawer>
        <!-- 首屏弹窗 -->
        <Modal v-model="modal_tenant" :closable="false" :mask-closable="false">
            <Select clearable class="search-col" v-model="current_tenant" placeholder="选择租户">
                <Option v-for="(option, index) in options_tenant" :value="option.value" :key="index">
                    {{option.label}}
                </Option>
            </Select>
            <div slot="footer">
                <Button type="primary" @click="goBack">返回</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import './index.less'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import Treeselect from '@riophae/vue-treeselect'
    import ChooseUser from '@/view/base/choose_user'
    import { projectSave, projectOne, projectPage, projectDel } from '@/api/backend/project'
    import {tenantPage} from '@/api/backend/tenant'
    export default {
        components: {
            Treeselect,ChooseUser
        },
        data() {
            return {
                current_tenant:'',
                options_tenant:[],
                query: {},
                columns: [
                    { title: '#', key: 'id' },
                    { title: '项目名称', key: 'name' },
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
                        mp_appkey: [{ required: true, message: 'appkey不能为空', trigger: 'blur' }],
                        mp_secret: [{ required: true, message: 'secret不能为空', trigger: 'blur' }],
                    },
                },
            }
        },
        computed: {
            modal_tenant() {
                return this.$store.state.tenant.tenant_id ? false : true
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            handleSearch() {
                projectPage(this.query).then(res => {
                    this.data = res.data.list
                    this.page.current = res.data.pageNum
                    this.page.total = res.data.total
                    this.page.pageSize = res.data.pageSize
                })
            },
            handleNew() {
                this.form.edit = {}
                this.drawer.edit = true
            },
            handleSubmit(name) {
                let data = this.form.edit
                data.tenant_id = this.$store.state.tenant.tenant_id
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        projectSave(data).then(res => {
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
                projectOne(id).then(res=>{
                    this.form.edit=res.data
                    this.drawer.edit = true
                })
            },
            handleDelete(params){
                let id = params.row.id
                projectDel(id).then(res=>{
                    this.handleSearch()
                })
            },
            handlePage() {

            },
            handleInitTenant(){
                tenantPage({}).then(res=>{
                    let data = res.data.list
                    data.forEach(e => {
                        this.options_tenant.push({
                            label:e.name,
                            value:e.id
                        })
                    });
                })
            }
        },
        mounted() {
            this.handleSearch()
            if (!this.modal_shop) {
                this.handleSearch()
            }
            this.handleInitTenant()
        },
        watch: {
            current_tenant(val, oldVal) {
                if (val) {
                    this.$store.commit("setTenantId", val)
                    this.handleSearch()
                }
            },
        },
    }
</script>

<style>

</style>