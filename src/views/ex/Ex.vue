<template>
    <div id="wrapper" >
        <div id="info-panel" v-show="visible">
            <div class="info-panel__wrapper" >
                <div class="info-panel__header">
                    <svg viewBox="0 0 64 64" width="15px" height="15px" class="data-ex-icons-layers " style="fill: currentcolor; padding: 0 5px 0 0"><path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path></svg>
                    <span class="info-name">{{header}}</span>
                </div>
                <table class="info-panel__table">
                    <tbody>
                        <tr class="row"
                            v-for="(value,name) in infoPanelDataSources.data"
                            :key="name">
                            <td class="row__name">{{ name }}</td>
                            <td class="row__value">{{ value }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="imgDom">
                <img class="img" src="http://10.75.68.56:70/test4.jpg">
                <div class="clear" style="clear:both"></div>
            </div>
        </div>
    </div>
</template>

<script>
import mapboxgl from "mapbox-gl"
export default ({
    data () {
        return{
            header: '江北污染数据库',
            infoPanelDataSources:{
                data:{
                    '质量':1,
                    '姓名':'wwq',
                    '电话':18868115977
                }
            },
            visible:true,
        }
    },
    mounted() {
        // this.initmap();
    },
    methods:{
        initmap(){
            mapboxgl.accessToken = "pk.eyJ1Ijoid2Vpd2VpeHgiLCJhIjoiY2t5anJpaXFuMnBneTJ3bzh5b3p6YXFlOSJ9.ozG2l7uHdIpAueCrq-JYng"
            var map = new mapboxgl.Map({
                container:"map-container",
                style: 'mapbox://styles/weiweixx/cl8736szu000a14qdt6oapzcm',
                center: [121.44603, 29.974815],
                zoom: 11.5,
                customAttribution: ["© 2021 浙江大学遥感与信息技术应用研究所"],
            })
            map.on('load',function(){
                console.log("loading")
            })
        }
    }
})
</script>

<style lang="stylus" scoped>
#wrapper{
    height:100%;
    width:100%;
    #info-panel{
        height:60%;
        width:60%;
        margin:20px 20px 20px 20px;
        border:1px solid;
        display:flex;
        .info-panel__wrapper{
            height:100%;
            border:1px solid;
            width:100%;
            .info-panel__header{
                width:100%;
                padding:0 14px;
                margin-top 12px
                // position relative
                // display flex
                // align-items center
            }
            .info-panel__table{
                flex:1;
                width:100%;
                padding:12px;
                // position relative;
            }
        
        }
        .imgDom{
            flex:1;
            border:1px solid;
            display flex;
            justify-content:center;
            align-items: center;
            .img{
                width:70%;
                height:40%;
                
            }
        }
        
        
    }
}
</style>
