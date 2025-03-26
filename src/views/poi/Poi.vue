<template>
    <div id="poi-module">
        <div id="visualization-module">
            <div id="poi-container">
                <info-table 
                    :visible-layer-infos="visibleLayerInfos"
                    :initial-position="{ x: 300, y: 15 }"
                ></info-table>
            <vector-layer
                v-for="(layerInfo, key) in layerInfos"
                :key="key"
                :layer-configs="layerInfo.layers"
                :visibility="layerInfo.controls.visibility === 'visible'">
            </vector-layer>
            
            <layer-controls class="layer-controls" :layer-infos ="layerInfos" :curLayerInfo="curLayerInfo"></layer-controls>

            <info-table  :visible-layer-infos="visibleLayerInfos"></info-table>

            <home-button></home-button>
            <map-legend :visible-layer-infos= "visibleLayerInfos"></map-legend>
            <zoom></zoom>
            </div>
        </div>
    </div>
</template>

<script>
import TMap from "./utils/tmap2"
import layerInfos from "./components/configscopy"
import VectorLayer from './components/layers/VectorLayer'
import LayerControls from "./components/controls/LayerControls.vue"
import InfoTable from "./components/controls/infoTable"
import Fullscreen from "../../components/map-widgets/Fullscreen"
import Zoom from "./components/controls/Zoom"
import HomeButton from "./components/controls/HomeButton"
import MapLegend from "./components/controls/Legend"
import { StackedDomList } from "../../components/utils/controlutils";
import mapboxgl from "mapbox-gl"
import axios from "axios"


export default {
    components:{
        VectorLayer,
        LayerControls,
        Fullscreen,
        Zoom,
        HomeButton,
        MapLegend,
        InfoTable
    },

    data(){
        return {
            layerInfos:layerInfos,
            curLayerInfo:layerInfos[0],
            emptyLayerInfo: {
                name:'请选择',
                layers:[],
                controls:{},
                tmap:null,
            }
        }
    },
    mounted(){
        const _this = this
        _this.initStackedDomList()
        _this.tmap = TMap.getInstance()
        const map = _this.tmap.map;
        map.loadImage('http://localhost:8083/static/img/triangle-icon.png',(error,image) => {
            if(error) throw error;
            map.addImage('triangle-icon',image,{'sdf':true})
        })
        map.loadImage('http://localhost:8083/static/img/circle-icon.png',(error,image) => {
            if(error) throw error;
            map.addImage('circle-icon',image,{'sdf':true})
        })
        
        const fullscreenControl = new mapboxgl.FullscreenControl()
        setTimeout(() => {
            if (_this.currentTabComponent === 'poi') {

                TMap.getInstance().map.resize()
            }
        }, 300)
        map.addControl(fullscreenControl)
    },
    beforeDestroy(){
        TMap.destroy()
    },
    computed: {
        visibleLayerInfos(){
            const _this = this
            return _this.layerInfos.filter(layerInfo =>{
                return layerInfo.controls.visibility === 'visible'
            })
        }
    },
    methods:{
        initStackedDomList() {
          const domList = document.getElementsByClassName('stacked-dom')
          this.stackedDomList = new StackedDomList(domList, 150, "mousedown")
        },
        changeCurLayerInfo(layerName) {
            const _this = this

            _this.curLayerInfo = _this.emptyLayerInfo
            _this.layerInfos.forEach(layerInfo => {
                if (layerInfo.name === layerName) {
                    _this.curLayerInfo = layerInfo
                }
            })
        },
    }
}
</script>

<style lang="stylus" scoped>
#poi-module {
    height: 100%;
    position: relative;
}

#visualization-module {
    position:relative;
    width:100%;
    height: 100%;
    #poi-container {
        width:100%;
        height:100%;
        background-color:#000;
        position:relative;
        z-index:1;
    }
}
</style>