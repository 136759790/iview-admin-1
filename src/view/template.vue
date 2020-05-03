<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="query.keyword"/>
            <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
            <Button @click="handleNew" class="search-btn" type="success">新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handlePage" />
    </Card>
    <Drawer title="编辑租户" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input v-model="form.edit.name" placeholder="请输入名称" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>
  </div>
</template>

<script>
import './index.less'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
export default {
    components: {
        Treeselect  
    },
  data () {
    return {
        query:{},
        columns:{},
        data:{},
        page:{},
        form:{
            edit:{}
        },
        drawer:{},
        rules:{}
    }
  },
  methods: {
      handleSearch(){

      },
      handleNew(){

      },
      handleSubmit(){

      },
      handlePage(){

      }
  },
  mounted () {
  }
}
</script>

<style>

</style>
