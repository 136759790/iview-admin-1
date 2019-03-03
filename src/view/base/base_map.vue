
<template>
  <div style="width:100%;height:500px;align:center;">
      <el-amap vid="map" :zoom="zoom" :center="center" class="amap" :events="events">
        <el-amap-marker v-for="i in markers" :key="i" :vid="i.vid" :title="i.title" :position="i.postion"  />
        <el-amap-marker vid="marker_selected"  :position="position_selected"  />
      </el-amap>
  </div>
</template>

<script>
import { getParks} from '@/api/truck/coordinate'
export default {
    props:{
        height:{
            type:Number,
            default:600
        },
        lng:{
            type:Number,
            default:114.52
        },
        lat:{
            type:Number,
            default:37.75
        },
    },
  data () {
    return {
        position_selected:[this.lng,this.lat],
        markers: [],
        zoom:14,
        center:[114.52,37.75],
        events: {
            init(map) {
            },
             'moveend': () => {
            },
            'zoomchange': () => {
            },
            'click': (e) => {
                let lat = e.lnglat.lat;//经度
              let lng = e.lnglat.lng;//维度
              this.position_selected=[lng,lat]
              this.$emit('onchange',this.position_selected)
            }
        }
    }
  },
  methods: {
      handleGetparks(){
          getParks().then(res=>{
              if(res.data.status == 1){
                  this.parks =[];
                  let data = res.data.data.rows;
                  data.forEach(element => {
                      this.markers.push({
                          vid:element.id,
                          title:element.title,
                          position:[element.lat,element.lng]
                      });
                  });
              }
          })
      }
  },
  watch:{
  },
  mounted () {
      this.handleGetparks();
  }
}
</script>
<style>
</style>