
<template>
  <div>
    <div class="demo-upload-list" :key="item" v-for="item in fileList">
        <template>
            <img :src="item.path">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
    </div>
    <Upload 
        :action="url.upload" 
        :headers="headers" 
        :with-credentials="withCredentials" 
        name = "file"
        :data="uploadData"
        :multiple="multiple"
        :show-upload-list="showList"
        :on-success="handleOkUpload"
        >
        <Button icon="ios-cloud-upload-outline">选择上传文件</Button>
    </Upload>
  </div>
</template>

<script>
import config from '@/config' 
import { getUpload,getUploadIdsByRef,getRefId,delUpload} from '@/api/base/upload'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
    props:{
        upid:Number,
        multiple:Boolean,
        refType:Number,//上传文件所属类型
    },
  data () {
    return {
        showList:false,
        url:{
            upload:baseUrl+"/upload/file"
        },
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        withCredentials:true,
        fileList:[],
        uploadData:{
            refType:this.refType,
            upid:this.upid,
        },
    }
  },
  methods: {
    handleRemove(item){
        if(item.id){
            delUpload(item.id).then(res => {
                if(res.data.status ==1){
                    this.$Message.success("删除成功");
                    this.handleGetFile(this.upid)
                }
            });
        }else{
            this.$Message.success("获取不到该图片，请检查");
        }
    },
    handleOkUpload(res,file,fileList){
        let id=res.data.id
        let url_path = baseUrl+"/upload/file/"+id
        this.fileList.push({path:url_path})
    },
    handleGetFile(upid){
        if(upid){
           getUploadIdsByRef(upid).then(ress =>{
                if(ress.data.status == 1){
                    let arr = ress.data.data;
                    this.fileList=[];
                    arr.forEach(element => {
                        let url_path = baseUrl+"/upload/file/"+element
                        this.fileList.push({path:url_path,id:element})
                    });
                }
            })
        }else{
            this.fileList = []
        }
    },
    // handleGetRefId(){//上传文件的时候判断是否是修改，修改直接沿用原来的refid
    //     if(this.upid){
    //         this.fileList = []
    //         this.handleGetFile(this.upid)
    //     }if(this.uploadData.upid){
    //         return
    //     }else{
    //         let type = this.refType?this.refType:1
    //         getRefId(type).then(res => {
    //             if(res.data.status == 1){
    //                 this.uploadData.upid = res.data.data.id
    //                 this.$emit('update:upid',res.data.data.id)
    //             }
    //         })
    //     }
    // }
  },
  watch:{
      upid(newValue){
            console.log(newValue,"222");
            // this.handleGetFile(newValue)
            this.uploadData.upid = newValue
            this.handleGetFile(this.uploadData.upid)
      }
  },
  mounted () {
      this.handleGetFile(this.upid)
  }
}
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>