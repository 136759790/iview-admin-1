<template>
  <div>
    <Row>
        <Col span="8">
            <span>ID：</span>
            <span>{{row.id}}</span>
        </Col>
        <Col span="8">
            <span>商店名称：</span>
            <span>{{row.name}}</span>
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
