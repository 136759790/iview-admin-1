
<template>
<span>{{translaction}}</span>
</template>

<script>
import { getLabel} from '@/api/base/select'
export default {
    props:{
        code:String,
        value:String,
    },
  data () {
    return {
        translaction : "",
    }
  },
  methods: {
      handleGetLabel(code,value){
          getLabel(code,value).then(res => {
              this.translaction = res.data
          });
      }
  },
  mounted () {
      this.handleGetLabel(this.code,this.value)
  }
}
</script>