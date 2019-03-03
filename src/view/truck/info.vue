<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入搜索" class="search-input" v-model="query.name"/>
            <Button @click="handleGetTrucks" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNewTruck" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑卡车信息" v-model="drawer.edit" width="70%" :mask-closable="false" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="名称：" prop="title" label-position="left">
                        <Input   v-model="form.edit.title" placeholder="请输入卡车出售简介" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="价格：" prop="price" label-position="top">
                        <Input   v-model="form.edit.price" placeholder="请输入卡车价格单位万元" />
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="品牌：" prop="brand" label-position="left">
                        <BaseSelect code="truck_brand" :value.sync="form.edit.brand" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="里程数：" prop="mileage" label-position="top">
                        <Input   v-model="form.edit.mileage" placeholder="请输入里程数" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="联系方式：" prop="phone" label-position="top">
                        <Input   v-model="form.edit.phone" placeholder="请输入联系方式，不填默认登录绑定手机" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="出售状态：" prop="status" label-position="top">
                        <BaseSelect code="truck_sell_status" :value.sync="form.edit.status" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="生产日期：" prop="create_time" label-position="top">
                        <br/>
                        <DatePicker type="month" format="yyyy-MM" @on-change="handleCreateTime"  v-model="form.edit.create_time" placeholder="选择生产日期" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="出厂日期：" prop="product_time" label-position="left">
                        <br/>
                        <DatePicker format="yyyy-MM" @on-change="handleProductTime"  v-model="form.edit.product_time"  type="month" placeholder="选择出厂日期" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                
            </Row>
             <Row :gutter="32">
                <Col span="12">
                    <FormItem label="上传卡车图：" prop="pic" label-position="left">
                       <BaseUpload multiple :refType="refType" :upid="form.edit.pic_id" />
                    </FormItem>
                </Col>
            </Row>
             <Row :gutter="32">
                <Col span="24">
                    <FormItem label="看车位置：" prop="coordinate" label-position="top">
                        <Select v-model="form.edit.position_id" @on-change="handleCoorChange" style="width:200px" placeholer="常用看车位置">
                            <Option v-for="item in select.coordinates" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        &nbsp;
                        <Button type="primary" @click="drawer.map=true">地图选址</Button>
                         <Tag>经度{{form.edit.lng}}</Tag> <Tag>纬度{{form.edit.lat}}</Tag>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="简介：" prop="description" label-position="top">
                        <Input v-model="form.edit.description" type="textarea" :rows="4" placeholder="请输入卡车简介。" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:3%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer> 
    <Drawer v-model="drawer.map" title="地图选址"  width="100%" :mask-closable="false">
        <BaseMap :lat="position.lat" :lng="position.lng" @onchange="positionChange"/>
        <div style="margin-left:40%;margin-top:5%">
            <Checkbox v-model="saveAsCommon">同时保存为常用地点</Checkbox>&nbsp;
            <Input style="width:200px;" v-model="position_name" v-if="saveAsCommon" placeholder="请输入名称"/>
            <br/><br/>
            <Button style="margin-right: 8px" @click="drawer.map = false">取消</Button>
            <Button type="primary" @click="handleOkPostion">确定</Button>
        </div>
    </Drawer>  
  </div>
</template>

<script>
import './index.less'
import moment from "moment"
import BaseSelect from '@/view/base/base_select'
import BaseUpload from '@/view/base/base_upload'
import BaseMap from '@/view/base/base_map'
import { getTrucks,saveTruck,getTruck,delTruck } from '@/api/truck/info'
import { getOptions } from '@/api/base/select'
import { getUpload,getUploadIdsByRef,getRefId} from '@/api/base/upload'
import { getMyParks,saveCoordinate} from '@/api/truck/coordinate'
export default {
    components: {
        BaseSelect,BaseUpload,BaseMap
    },
    data () {
    return {
        position_name:'',
        position:{},
        refType:2,
        saveAsCommon:false,
        modal:{
            delete:false
        },
        drawer:{
            edit:false,
            map:false
        },
        options: [],
        form:{
            edit:{},
        },
        rules:{
            edit:{
                // res_code:[{required:true,message:'资源代码不能为空',trigger:'blur'}],
                // res_name:[{validator:validatorUsername,trigger:'blur'}],
            },
        },
        select:{
            status:[
                {key : 'Y', title:'有效' ,value:'Y' },
                {key : 'N', title:'无效' ,value:'N' },
            ],
            coordinates:[]
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '简介',key: 'title'},
            {title: '品牌',key: 'brand_name'},
            {title: '里程数',key: 'mileage'},
            {title: '价格',key: 'price'},
            {title: '出厂日期',key: 'product_time'},
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
          name:'',
          page:1
      }

    }
  },
  methods: {
      handleCoorChange(value){
          this.select.coordinates.forEach(element =>{
              if(element.id == value){
                  this.form.edit.lat = element.position[0]+""
                  this.form.edit.lng = element.position[1]+""
              }
          });
      },
      handleOkPostion(){
          if(this.saveAsCommon){
              if(!this.position_name){
                  this.$Message.error('请填写名称。');
                  return
              }
              let data={
                  title:this.position_name,
                  lng:this.form.edit.lng,
                  lat:this.form.edit.lat
              }
              saveCoordinate(data).then(res=>{
                  if(res.data.status == 1){
                      this.$Message.success('常用地址保存成功。');
                      this.handleGetParks()
                  }
              })
          }
          this.drawer.map = false;
      },
      positionChange(position){//子组件回调
          console.log(position);
          this.form.edit.lat = position[0]
          this.form.edit.lng = position[1]

      },
      handleGetParks(){
          getMyParks().then(res =>{
              if(res.data.status ==1){
                  this.select.coordinates =[];
                  let data = res.data.data;
                  data.forEach(element => {
                      this.select.coordinates.push({
                          id:element.id,
                          position:[element.lat,element.lng],
                          value:element.id,
                          label:element.title
                      });
                      if(this.form.edit.lat && this.form.edit.lng){
                          if(element.lat == this.form.edit.lat && element.lng == this.form.edit.lng){
                              this.form.edit.position_id = element.id
                          }
                      }
                  });
              }
          })
      },
      handleCreateTime(time,date){
          console.log(date)
          this.form.edit.create_time = time
      },
      handleProductTime(time,date){
          this.form.edit.product_time = time
      },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetTrucks();
    },
    handleNewTruck(){
        this.handleGetParks();
        this.handleGetRefId()
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.form.edit.create_time = moment(this.form.edit.create_time).format("YYYY-MM-DD HH:mm:ss");
                this.form.edit.product_time = moment(this.form.edit.product_time).format("YYYY-MM-DD HH:mm:ss");
                console.log(this.form);
                saveTruck(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetTrucks();
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
    handleGetTrucks(){
        getTrucks(this.query).then((res)=>{
            this.data = res.data.data.rows;
            this.page.current=res.data.data.pageNum
            this.page.total=res.data.data.total
            this.page.pageSize=res.data.data.pageSize
        });
    },
    handleDelete (params) {
        let config={
            title:'提醒',
            content:'确定要删除id为：'+params.row.id+"的记录？",
            onOk:()=>{
                let id = params.row.id;
                delTruck(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetTrucks()
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
        getTruck(id).then(res =>{
            if(res.data.status == 1){
                this.form.edit = res.data.data
                if(this.form.edit.lat && this.form.edit.lng){//如果存在默认勾上看车位置
                    this.select.coordinates.forEach(e=>{
                        if(this.form.edit.lat == e.lat && this.form.edit.lng == e.lng){
                            this.form.edit.position_id = e.id
                        }
                    })
                }
                this.drawer.edit = true;
            }
        })
        this.handleGetParks()
    },
    handleGetBrand(){
        getOptions({code:"truck_brand"}).then(res=>{
            if(res.data.status == 1){
            }
        })
    },
    handleGetRefId(){//获取上传文件refid
        getRefId(2).then(res => {
            if(res.data.status == 1){
                this.form.edit={}
                this.form.edit.pic_id = res.data.data.id
                this.drawer.edit = true
            }
        })
    },
  },
  mounted () {
    this.handleGetTrucks();
    // this.handleGetBrand();
  }
}
</script>

<style>
    .amap {
      height: 300px;
      width: 300;
    }
</style>
