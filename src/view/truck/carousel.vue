<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入标题搜索" class="search-input" v-model="query.title"/>
            <Button @click="handleGetCarousels" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNewCarousel" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑信息" v-model="drawer.edit" width="720" :mask-closable="false" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="标题：" prop="title" label-position="left">
                        <Input v-model="form.edit.title" placeholder="请输入轮播名称" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="是否使用：" prop="valid" label-position="top">
                        <Select v-model="form.edit.valid" class="search-col">
                            <Option v-for="item in select.valid" :value="item.value" :key="item.value">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="链接：" prop="url" label-position="top">
                        <Input  v-model="form.edit.url"  placeholder="请输入链接" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="顺序：" prop="order" label-position="top">
                        <Input  v-model="form.edit.order"  placeholder="请输入顺序" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="轮播图片：" prop="pic" label-position="top">
                       <BaseUpload multiple refType="3" :upid="form.edit.up_id" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="轮播描述：" prop="description" label-position="top">
                        <Input v-model="form.edit.description" type="textarea" :rows="4" placeholder="请输入轮播描述。" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>   
    <Modal v-model="modal.view" title="预览图片">
        <img :src="url.view" style="width:300px;height:200px;">
    </Modal> 
  </div>
</template>

<script>
import './index.less'
import { getCarousels,getCarousel,saveCarousel,delCarousel } from '@/api/truck/carousel'
import { getUpload,getUploadIdsByRef,getRefId} from '@/api/base/upload'
import BaseUpload from '@/view/base/base_upload'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
  components: {
    BaseUpload
  },
  data () {
    return {
        url:{
            view:'',
        },
        modal:{
            delete:false,
            view:false,
        },
        drawer:{
            edit:false,
        },
        form:{
            edit:{
                title:'',
                url:'',
                description:'',
                valid:1,
                order:1,
            },
        },
        rules:{
            edit:{
                title:[{required:true,message:'标题不能为空',trigger:'blur'}],
                valid:[{required:true,message:'请选择是否使用',trigger:'change'}],
                url:[{required:true,message:'链接不能为空',trigger:'blur'}],
            },
        },
        select:{
            valid:[
                {title:'有效' ,value:'1' },
                {title:'无效' ,value:'0'},
            ],
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '标题',key: 'title'},
            {title: '跳转地址',key: 'url'},
            {title: '描述',key: 'description'},
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
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.handleView(params)
                                }
                            }
                        }, '预览'),
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
          page:1
      }

    }
  },
  methods: {
    handleChangePage(page){
        this.query.page = page;
        this.handleGetCarousels();
    },
    handleNewCarousel(){
        getRefId(3).then(res => {
            if(res.data.status == 1){
                this.drawer.edit = true
                this.form.edit={
                    title:'',
                    url:'',
                    description:'',
                    valid:'1',
                    order:1,
                    up_id:res.data.data.id
                }
            }
        })
    },
    handleSubmit (name) {
        console.log(this.form.edit)
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(!this.form.edit.up_id){
                    this.$Message.error('请上传图片')
                    return
                }
                saveCarousel(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetCarousels();
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
    handleGetCarousels(){
        getCarousels(this.query).then((res)=>{
            this.data = res.data.data.rows;
            this.page.current=res.data.data.pageNum
            this.page.total=res.data.data.total
            this.page.pageSize=res.data.data.pageSize
        });
    },
    handleDelete (params) {
        let config={
            title:'提醒',
            content:'确定要删除记录？',
            onOk:()=>{
                let id = params.row.id;
                delCarousel(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetCarousels()
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
        getCarousel(id).then(res =>{
            if(res.data.status == 1){
                console.log(res);
                this.form.edit = res.data.data
                this.drawer.edit = true;
                this.form.edit.valid = res.data.data.valid+""
            }
        })
    },
    handleView (params) {
        this.url.view = baseUrl+"/upload/file/"+params.row.pic_id;
        this.modal.view =true
    }
  },
  mounted () {
    this.handleGetCarousels();
  }
}
</script>

<style>

</style>
