<template>
  <div>
    <Card>
        <p slot="title">
            所有键值
        </p>
        <p slot="extra">
            <Button @click="handleNewOption" class="search-btn" type="success">新增</Button>
        </p>
        <Table size="small" stripe  :columns="columns_option" :data="data_option"></Table>
    </Card>
    <Modal v-model="modal.edit" title="编辑键值" @on-ok="handleSubmit('form.edit')">
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="值：" prop="value" label-position="left">
                        <Input v-model="form.edit.value" placeholder="请输入值" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="显示名称：" prop="name" label-position="left">
                        <Input v-model="form.edit.name" placeholder="请输入名称" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="父级键值：" prop="pid" label-position="left">
                        <treeselect v-model="form.edit.pid" placeholder="请选择父级，不选默认平级"  :options="options" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </Modal>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
import { getOptionsMobile,getOptions,getOption,delOption,saveOption,getOptionTreeSelect,sortOption } from '@/api/base/select'
export default {
    props:{
        row:Object
    },
    components: {
        Treeselect  
    },
  data () {
    return {
        modal:{
            edit:false
        },
        options: [],
        form:{
            edit:{
                value:'',
                name:'',
                pid:'',
            },
        },
        rules:{
            edit:{
                value:[{required:true,message:'值不能为空',trigger:'blur'}],
                name:[{required:true,message:'名称不能为空',trigger:'blur'}],
            },
        },
        columns_option: [
            {title: 'ID',key: 'id'},
            {title: '父ID',key: 'pid'},
            {title: '值',key: 'value'},
            {title: '显示',key: 'name'},
            {title: '所属字典',key: 'select_code'},
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
                        }, '编辑'),
                        h('ButtonGroup', [
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small',
                                    icon:"md-arrow-up"
                                },
                                on: {
                                    click: () => {
                                        this.handleOrder(params,0)
                                    }
                                }
                            },),//<Icon type="md-arrow-down" />
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small',
                                    icon:"md-arrow-down"
                                },
                                on: {
                                    click: () => {
                                       this.handleOrder(params,1)
                                    }
                                }
                            }),
                        ]),
                    ]);
                }
            }
        ],
        data_option: [],
        query:{
            org_name:'',
            page:1
        },
        pageOption:{
            current:1,
            total:0,
            pageSize:10,
        },
    }
  },
  methods: {
    handleOrder(params,type){//0上，1下
        let data={
            arrow:type,
            id:params.row.id,
            code:params.row.select_code
        }
        sortOption(data).then(res => {
            this.handleGetOptions(params.row.select_code)
        })
    },
    handleNewOption(){
        this.form.edit={};
        this.modal.edit = true
    },
    handleGetOptionTree(code){
        getOptionsMobile(code).then(res => {
            if(res.status == 1){
                this.options = res.data
            }
        });
    },
    handleSubmit (name) {
        let rowCode = this.row.code;
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.form.edit.select_code = this.row.code
                saveOption(this.form.edit).then(res=>{
                    if(res.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetOptions(rowCode);
                        this.$refs[name].resetFields();
                        this.drawer.edit=false
                    }
                }).catch(e=>{
                    console.log(e);
                });
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
                let code = params.row.select_code;
                delOption(id).then(res =>{
                    if(res.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetOptions(code)
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
        getOption(id).then(res =>{
            if(res.status == 1){
                this.form.edit = res.data
                this.modal.edit = true
            }
        })
    },
    handleGetOptions(code){
        let param={code:code}
        getOptions(param).then(res =>{
            if(res.status == 1){
                this.data_option = res.data
            }
        });
    },
  },
  mounted () {
      this.handleGetOptions(this.row.code)
      this.handleGetOptionTree(this.row.code);
  }
}
</script>

<style>

</style>
