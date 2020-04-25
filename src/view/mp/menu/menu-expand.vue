<template>
  <div class="main_expand">
    <Row>
        <Col span="8">
            <span>ID：</span>
            <span>{{row.id}}</span>
        </Col>
        <Col span="8">
            <span>名称：</span>
            <span>{{row.name}}</span>
        </Col>
        <Col span="8">
            <span>价格：</span>
            <span>￥{{row.price}}</span>
        </Col>
    </Row>
    <Row>
        <Col span="8">
            <span>分组：</span>
            <span>{{row.group_info.name}}</span>
        </Col>
        <Col span="8">
            <span>标签：</span>
            <span>{{row.tag_name}}</span>
        </Col>
        <Col span="8">
            <span>添加人：</span>
            <span>{{row.creator_info.nickname}}</span>
        </Col>
    </Row>
    <Row>
        <Col span="24">
            <span>描述：</span>
            <span>{{row.desc}}</span>
        </Col>
    </Row>
  </div>
</template>

<script>
export default {
    props:{
        row:Object
    },
    data () {
        return {
        }
    },
    methods: {
        
    },
    mounted () {

    }
}
</script>
<style>
    .main_expand{
        font-size: 1.1em;
        font-weight: 500;
    }
</style>