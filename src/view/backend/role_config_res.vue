<template>
    <div>
        <Row>
            <Col span="11">
                <Card >
                    <p slot="title">全部资源</p>
                    <p>
                        <Tree :data="dataAllRes" :render="renderAllContent" ></Tree>
                    </p>
                </Card>
            </Col>
            <Col span="11" offset="1">
                <Card >
                    <p slot="title">{{role.role_name}}资源</p>
                    <p>
                        <Tree :data="dataMyRes" :render="renderMyContent" ></Tree>
                    </p>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { getRess,getResTree } from '@/api/res'
import { addRoleRes,deleteRoleRes } from '@/api/ref'
export default {
  props: {
    role_id: {
      type: Number,
      default: () => {
        return {}
      }
    },
    role:{
        type:Object
    }
  },
  watch:{
      role_id(newValue,oldValue){
          this.handleInitRes(newValue)
      },
      role(newValue,oldValue){
          console.log(newValue)
      }
  },
  data () {
    return {
        dataMyRes: [],
        dataAllRes: [],
        page:{
            all:{
                total:0,
                current:1,
                pageSize:10,
            },
            my:{
                total:0,
                current:1,
                pageSize:10,
            },
        },
    }
  },
  methods: {
      handleInitRes(role_id){
            getResTree(role_id).then(res => {
                this.dataMyRes = res.data;
            });
            getResTree().then(res => {
                this.dataAllRes = res.data;
            });
      },
      handleGetRess(type){
            if(type == 'my'){
                this.queryParams[type].role_id = this.role_id;
            }
            this.queryParams[type].current=this.page[type].current
            this.queryParams[type].total=this.page[type].total
            this.queryParams[type].rows=this.page[type].pageSize
            getRess(this.queryParams[type]).then((res)=>{
                this.data[type] = res.data.data.rows;
                this.page[type].current=res.data.data.pageNum
                this.page[type].total=res.data.data.total
                this.page[type].pageSize=res.data.data.pageSize
            }).catch(e=>{
            });
            this.query={}
        },
        renderAllContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'md-add-circle',size:'small',type:'primary'
                            }),
                            on: {
                                click: () => { 
                                    // console.log(root,"1111",node,"1111",data);
                                    let res_id = node.node.id;
                                    let data={
                                        role_id:this.role_id,
                                        res_id:res_id
                                    }
                                    addRoleRes(data).then(res => {
                                        if(res.data.status == 1){
                                             this.$Message.success(res.data.msg)
                                             this.handleInitRes(this.role_id)
                                        }else{
                                             this.$Message.error(res.data.msg)
                                        }
                                    }).catch(e =>{
                                        console.log(e);
                                        this.$Message.error("操作失败，请联系管理员。")
                                    });
                                 }
                            }
                        })
                    ])
                ]);
            },
    renderMyContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-trash',size:'small',type:'error'
                            }),
                            on: {
                                click: () => {
                                    let res_id = node.node.id;
                                    let data = {
                                        res_id:res_id,
                                        role_id:this.role_id
                                    }
                                    deleteRoleRes(data).then(res => {
                                        if(res.data.status == 1){
                                             this.$Message.success(res.data.msg)
                                             this.handleInitRes(this.role_id)
                                        }else{
                                             this.$Message.error(res.data.msg)
                                        }
                                    }).catch(e =>{
                                        console.log(e);
                                        this.$Message.error("操作失败，请联系管理员。")
                                    })
                                }
                            }
                        })
                    ])
                ]);
            },
  },
  mounted(){
      this.handleInitRes(this.role_id)
  }
}
</script>
