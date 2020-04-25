<template>
    <div>
        <div v-if="show" class="demo-upload-list" v-for="item in fileList">
            <template>
                <img :src="item.preview">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.id)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item.id)"></Icon>
                </div>
            </template>
        </div>
        <Upload :headers="headers" :with-credentials="withCredentials" :action="action" :show-upload-list="false"
            :max-size="2048" :format="['jpg','jpeg','png']" :accept="['jpg','jpeg','png']" :data=data
            :on-success="handleSuccess">
            <Button icon="ios-cloud-upload-outline">选择上传文件</Button>
        </Upload>
    </div>
</template>

<script>
    import config from '@/config'
    import { getAttaches,deleteAttach } from '@/api/base/attach'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    export default {
        props: {
            module_id: {
                type: Number,
                default: 0
            },
            module_type: Number,//上传文件所属类型
            multiple:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                src: "",
                action: baseUrl + "/attach/upload",
                withCredentials: true,
                fileList: [],
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                withCredentials: true,
                data: {
                    module_type: this.module_type,
                    module_id: this.module_id,
                    multiple:this.multiple
                },
            }
        },
        computed: {
            show() {
                return this.fileList && this.fileList.length > 0
            }
        },
        methods: {
            handleSuccess(res, file) {
                if(this.multiple){
                    this.fileList.push(res.data)
                }else{
                    this.fileList=[res.data]
                }
                this.$emit("on-success", res.data)
            },
            handleInitAttach() {
                if(this.module_id){
                    getAttaches(this.module_type, this.module_id).then(res => {
                        this.fileList = res.data
                    })
                }
            }
        },
        watch: {
        },
        mounted() {
            this.handleInitAttach()
        }
    }
</script>
<style>
    .demo-upload-list {
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
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>