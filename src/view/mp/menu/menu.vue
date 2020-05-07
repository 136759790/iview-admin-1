<template>
    <div>
        <Tabs>
            <TabPane label="菜品管理">
                <Card>
                    <div class="search-con search-con-top">
                        <Input clearable placeholder="输入名称搜索" class="search-input" v-model="params.name" />
                        <Select class="search-col" v-model="params.valid" placeholder="请选择菜品状态">
                            <Option v-for="(option, index) in options" :value="option.value" :key="index">
                                {{option.label}}</Option>
                        </Select>
                        <Button @click="handlePage" class="search-btn" type="primary">搜索</Button>
                        <Button @click="handleNew" class="search-btn" type="success">新增</Button>
                    </div>
                    <Table size="small" draggable @on-drag-drop="handleDirection" stripe :columns="columns" :data="data"></Table>
                    <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" show-total
                        style="margin: 10px 0" @on-change="handleChangePage" />
                </Card>
                <Drawer title="菜品编辑" v-model="drawer.edit" width="720" :mask-closable="true">
                    <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
                        <Row :gutter="32">
                            <Col span="24">
                            <FormItem label="菜品名称：" prop="name" label-position="left">
                                <Input v-model="form.edit.name" placeholder="请输入菜品名称" />
                            </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                            <FormItem label="菜品价格：" prop="price" label-position="left">
                                <Input v-model="form.edit.price" type="number" placeholder="请输入菜品名称" />
                            </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                            <FormItem label="菜品图片：" prop="attach_id" label-position="left">
                                <Attach v-if="this.drawer.edit" :module_id="form.edit.id" module_type="0" @on-success="handleSuccess" />
                            </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                            <FormItem label="标签：" prop="tag_id" label-position="left">
                                <Select clearable class="search-col" v-model="form.edit.tag_id" placeholder="请选择标签">
                                    <Option v-for="(option, index) in options_tag" :value="option.value" :key="index">
                                        {{option.label}}
                                    </Option>
                                </Select>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                            <FormItem label="菜品分组：" prop="group_id" label-position="left">
                                <Select filterable clearable class="search-col" v-model="form.edit.group_id"
                                    placeholder="请选择分组">
                                    <Option v-for="(option, index) in options_group" :value="option.id" :key="index">
                                        {{option.name}}
                                    </Option>
                                </Select>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                            <FormItem label="菜品描述：" prop="desc" label-position="left">
                                <Input v-model="form.edit.desc" type="textarea" :rows="4" placeholder="菜品描述" />
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div style="margin-left:40%;margin-top:10%">
                        <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
                        <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
                    </div>
                </Drawer>
            </TabPane>
            <TabPane label="菜品分组">
                <Card>
                    <div class="search-con search-con-top">
                        <Input clearable placeholder="输入名称搜索" v-model="params_group.name" class="search-input" />
                        <Button @click="searchGroup" class="search-btn" type="primary">搜索</Button>
                        <Button @click="newGroup" class="search-btn" type="success">新增</Button>
                    </div>
                    <Table size="small" stripe :columns="columns_group" :data="data_group"></Table>
                    <Page :total="page_group.total" :current="page_group.current" :page-size="page_group.pageSize"
                        size="small" show-total style="margin: 10px 0" @on-change="handleChangeGroupPage" />
                </Card>
                <Drawer title="分组编辑" v-model="drawer.group" width="720" :mask-closable="true">
                    <Form ref="form.group" :model="form.group" :rules="rules.group" :label-width="100">
                        <FormItem label="分组名称：" prop="name">
                            <Input v-model="form.group.name" placeholder="请输入分组名称" />
                        </FormItem>
                        <FormItem label="选择项目：" prop="project_id">
                            <Select disabled class="search-col" v-model="form.group.project_id" placeholder="选择项目">
                                <Option v-for="(option, index) in options_project" :value="option.value" :key="index">
                                    {{option.label}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <div style="margin-left:40%;margin-top:10%">
                        <Button style="margin-right: 8px" @click="drawer.group=false">取消</Button>
                        <Button type="primary" @click="submit('form.group')">提交</Button>
                    </div>
                </Drawer>
            </TabPane>
            <Button @click="handleChangeProject" type="primary" slot="extra">切换商店</Button>
        </Tabs>
        <!-- 首屏弹窗 -->
        <Modal v-model="modal_project" :closable="false" :mask-closable="false">
            <Select clearable class="search-col" v-model="current_project" placeholder="选择商店">
                <Option v-for="(option, index) in options_project" :value="option.value" :key="index">
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
    import { mapState } from 'vuex'
    import { save, del, page, one,direction, saveGroup, pageGroup, delGroup, oneGroup, listGroup } from '@/api/mp/menu'
    import { projectSave, projectOne, projectPage, projectDel } from '@/api/backend/project'
    import { getAllUser } from '@/api/user'
    import GroupExpand from './group-expand.vue';
    import MenuExpand from './menu-expand.vue';
    import Attach from '@/view/base/attach.vue';
    export default {
        components: {
            GroupExpand, Attach, MenuExpand
        },
        data() {
            return {
                current_project: '',
                options_project: [],
                options: [
                    { label: "在售", value: 1 },
                    { label: "下架", value: 0 }
                ],
                options_tag: [
                    { label: "热卖", value: 0 },
                    { label: "新品", value: 1 },
                    { label: "普通", value: 2 }
                ],
                options_group: [],
                params: {
                    valid: 1,
                },
                params_group: {
                    valid: 1,
                },
                modal: {
                    delete: false,
                },
                drawer: {
                    edit: false,
                    group: false
                },
                form: {
                    edit: {
                        price:'',
                        code: '',
                        name: '',
                        desc: '',
                    },
                    group: {
                        code: '',
                        name: '',
                        desc: '',
                    },
                },
                rules: {
                    edit: {
                        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                        price: [{ required: true, message: '价格不能为空', trigger: 'blur',type:'number' }],
                        tag_id: [{ required: true, message: '标签不能为空', trigger: 'change',type:'number' }],
                        group_id: [{ required: true, message: '分组不能为空', trigger: 'change',type:'number' }],
                        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
                    },
                    group:{
                        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                    }
                },
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(MenuExpand, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    { title: '菜品名称', key: 'name' },
                    { title: '菜品价格', key: 'price' },
                    { title: '标签', key: 'tag_name' },
                    {
                        title: '分组',
                        key: 'group_info',
                        render: (h, params) => {
                            return h('span', params.row.group_info.name);
                        }
                    },
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
                                    style: {
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
                columns_group: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(GroupExpand, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    { title: 'ID', key: 'id' },
                    { title: '分组名称', key: 'name' },
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
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleDeleteGroup(params)
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEditGroup(params)
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                data_group: [],
                page: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                },
                page_group: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                },
                pageOption: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                },
            }
        },
        computed: {
            modal_project() {
                return this.$store.state.project.id ? false : true
            }
        },
        methods: {
            handleDirection(id1,id2){
                const origin_id = this.data[id1].id
                const target_id = this.data[id2].id
                direction(origin_id,target_id).then(res=>{
                    this.handlePage()
                })
            },
            handleSuccess(data) {
                this.form.edit.attach_id = data.id
            },
            handleChangeProject() {
                this.$store.commit("setProjectId", null)
            },
            handleChangeGroupPage() {

            },
            searchGroup() {
                pageGroup(this.params_group).then(res => {
                    this.data_group = res.data.list
                    this.page_group.current = res.data.pageNum
                    this.page_group.total = res.data.total
                    this.page_group.pageSize = res.data.pageSize
                })
            },
            handleInitProject() {
                projectPage({}).then(res => {
                    res.data.list.forEach(e => {
                        this.options_project.push({
                            value: e.id,
                            label: e.name
                        })
                    })
                })
            },
            newGroup() {
                this.drawer.group = true
                this.form.group.project_id = this.$store.state.project.id
            },
            addGroup(name) {

            },
            filterByName(name) {
                if (name != '') {
                    this.loading = true;
                    getAllUser({ username: name }).then(res => {
                        res.data.list.forEach(e => {
                            this.options = []
                            this.options.push({
                                "label": e.username,
                                "value": e.id
                            })
                        });
                        this.searchGroup()
                    });
                    this.loading = false
                } else {
                    this.options = [];
                }
            },
            handleNew() {
                listGroup().then(res => {
                    this.options_group = res.data
                })
                this.form.edit = {};
                this.drawer.edit = true
            },
            handleChangePage(page) {
                this.params.page = page;
            },
            handlePage() {
                this.params.project_id = this.$store.state.project.id
                page(this.params).then(res => {
                    this.data = res.data.list
                    this.page.current = res.data.pageNum
                    this.page.total = res.data.total
                    this.page.pageSize = res.data.pageSize
                })
            },
            handleSubmit(name) {
                let data = this.form.edit
                data.project_id = this.$store.state.project.id
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(!data.id){//新增
                            if(!data.attach_id){//没有附件
                                this.$Message.error('请先上传菜品图片。');
                                return
                            }
                        }
                        save(data).then(res => {
                            this.$Message.success(res.msg);
                            this.$refs[name].resetFields();
                            this.drawer.edit = false
                            this.handlePage()
                        })
                    } else {
                        this.$Message.error('请按照格式填写表单!');
                    }
                })
            },
            submit(name) {
                let data = this.form.group
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        saveGroup(data).then(res => {
                            this.$Message.success(res.msg);
                            this.$refs[name].resetFields();
                            this.drawer.group = false
                            this.searchGroup()
                        })
                    } else {
                        this.$Message.error('请按照格式填写表单!');
                    }
                })
            },
            handleDelete(params) {
                let config = {
                    title: '提醒',
                    content: '确定要删除名称为：' + params.row.name + "的记录？",
                    onOk: () => {
                        let id = params.row.id;
                        del({ id: id }).then(res => {
                            this.$Message.success(res.msg)
                            this.handlePage()
                        })
                    },
                    onCancel: () => { return false },
                }
                let confirm = this.$Modal.confirm(config);
            },
            handleDeleteGroup(params) {
                let config = {
                    title: '提醒',
                    content: '确定要删除名称为：' + params.row.name + "的分组？",
                    onOk: () => {
                        let id = params.row.id;
                        delGroup({ id: id }).then(res => {
                            this.$Message.success(res.msg)
                        })
                        this.searchGroup()
                    },
                    onCancel: () => { return false },
                }
                let confirm = this.$Modal.confirm(config);
            },
            handleEditGroup(params) {
                let id = params.row.id;
                oneGroup(id).then(res => {
                    this.form.group = res.data
                    this.drawer.group = true;
                })
            },
            handleEdit(params) {
                listGroup().then(res => {
                    this.options_group = res.data
                })
                let id = params.row.id;
                one(id).then(res => {
                    this.form.edit = res.data
                    this.drawer.edit = true;
                })
            },
            renderContent(h, { root, node, data }) {
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
                        h('span', data.attributes ? data.attributes.value : '')
                    ])
                ]);
            },
            goBack() {
                this.$router.go(-1)
            },
        },
        mounted() {
            if (!this.modal_project) {
                this.handlePage()
                this.searchGroup()
            }
            this.handleInitProject()
        },
        watch: {
            current_project(val, oldVal) {
                if (val) {
                    this.$store.commit("setProjectId", val)
                    this.handlePage()
                    this.searchGroup()
                }
            },
        },
    }
</script>

<style>

</style>