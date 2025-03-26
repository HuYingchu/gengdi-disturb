<template>
    <div id="visualization-module">
        <div id="map-container"></div>

    <time-slider @reload-layer="reloadLayer"></time-slider>

        <vector-layer
            v-for="(layerInfo, key) in layerInfos"
            :key="key"
            :layer-configs="layerInfo.layers"
            :visibility="layerInfo.controls.visibility === 'visible'">
        </vector-layer>
        <info-window
            :visible="infoVisible"
            :position="infoPosition"
            :content="infoContent"
            @update:position="updateInfoPosition"
        ></info-window>

        <layer-controls :layer-infos="layerInfos" :curLayerInfo="curLayerInfo"></layer-controls>
        <info-panel :visible-layer-infos="visibleLayerInfos"></info-panel>

        <home-button></home-button>
        <geocoder></geocoder>
        <zoom></zoom>
        <fullscreen></fullscreen>
        <three-dimension></three-dimension>
        <basemap-gallery :layer-infos="layerInfos"></basemap-gallery>
        <hill-shade></hill-shade>
        <map-legend :visible-layer-infos="visibleLayerInfos"></map-legend>
        <risk-assessment :moduleId="moduleId"></risk-assessment>
        <area-risk-assessment :moduleId="moduleId"></area-risk-assessment>
        <pitcher></pitcher>
    </div>
</template>

<script>
import TMap from "../../components_copy/utils/tmap";
import layerInfos from "@/views/visualization/components/configs/index.js";
import VectorLayer from './components/layers/VectorLayer';
import LayerControls from "./components/controls/LayerControls";
import InfoPanel from "./components/controls/InfoPanel";
import Fullscreen from "../../components_copy/map-widgets/Fullscreen";
import Zoom from "../../components_copy/map-widgets/Zoom";
import HomeButton from "../../components_copy/map-widgets/HomeButton";
import BasemapGallery from "./components/controls/BasemapGallery";
import Pitcher from "../../components_copy/map-widgets/Pitcher";
import Geocoder from "../../components_copy/map-widgets/Geocoder";
import HillShade from "../../components_copy/map-widgets/HillShade";
import MapLegend from "./components/controls/Legend";
import ThreeDimension from "../../components_copy/map-widgets/ThreeDimension";
import { StackedDomList } from "../../components_copy/utils/controlutils";
import RiskAssessment from './RiskAssessment.vue';
import AreaRiskAssessment from './AreaRiskAssessment.vue';
import mapboxgl from 'mapbox-gl';
import InfoWindow from './components/controls/InfoWindow.vue'; // 引入 InfoWindow 组件
import TimeSlider from './components/controls/TimeSlider.vue'; // 导入时间轴组件


export default {
  components: {
      VectorLayer,
      InfoPanel,
      LayerControls,
      Fullscreen,
      Zoom,
      HomeButton,
    //   BasemapGallery,
      Pitcher,
      Geocoder,
      HillShade,
    //   MapLegend,
      ThreeDimension,
      RiskAssessment,
      AreaRiskAssessment,
      InfoWindow,
    //   TimeSlider
  },
  data() {
    return {
        attr: {},
        layerInfos: layerInfos,
        curLayerInfo: layerInfos[0],
        emptyLayerInfo: {
            name: '请选择',
            layers: [],
            controls: {}
        },
        tmap: null,
        moduleId: "visualization-module-copy",
        infoVisible: false, // 控制信息窗口的显示
        infoPosition: { x:300, y: 15 }, // 窗口初始位置
        infoContent: { lng: 0, lat: 0 } ,// 存储经纬度
        currentMarker: null, // 用于存储靶心标记
        coordinates: null, // 存储经纬度
    };
  },
  mounted() {
      const _this = this;
      _this.initStackedDomList();
      _this.tmap = TMap.getInstance();

      this.tmap.map.getCanvas().style.cursor = 'default';

      // 添加地图点击事件
      _this.tmap.map.on("click", this.onMapClick);
      this.tmap.map.on("mousemove", (e) => {
    this.coordinates = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
    };
});
    // 添加缩放事件
    _this.tmap.map.on("zoom", () => {
        const zoom = _this.tmap.map.getZoom();
    });
      setTimeout(() => {
          if (_this.currentTabComponent === 'visualization') {
              TMap.getInstance().map.resize();
          }
      }, 300);
  },
  beforeDestroy() {
      // 移除点击事件监听器
      if (this.tmap && this.tmap.map) {
          this.tmap.map.off("click", this.onMapClick);
      }
      TMap.destroy();
  },
  computed: {
      visibleLayerInfos() {
          const _this = this;
          return _this.layerInfos.filter(layerInfo => {
              return layerInfo.controls.visibility === "visible";
          });
      }
  },
  methods: {
    initStackedDomList() {
        const domList = document.getElementsByClassName('stacked-dom');
        this.stackedDomList = new StackedDomList(domList, 150, "mousedown");

    },
    reloadLayer() {
      if (!this.tmap || !this.tmap.map) return;
      
      // 移除原有图层
      const map = this.tmap.map;
      if (map.getLayer('construction')) {
        map.removeLayer('construction');
      }
    //   if (map.getSource('construction')) {
    //     map.removeSource('construction');
    //   }

      // 重新添加图层
      const constructionConfig = this.layerInfos.find(info => info.name === 'construction');
      if (constructionConfig && constructionConfig.layers && constructionConfig.layers[0]) {
        const layerConfig = constructionConfig.layers[0];
        
        // 添加数据源
        // map.addSource('construction', layerConfig.source);
        
        // 添加图层
        map.addLayer(layerConfig.layer);
        
        // 设置可见性和透明度
        map.setLayoutProperty('construction', 'visibility', constructionConfig.controls.visibility);
        map.setPaintProperty('construction', 'raster-opacity', constructionConfig.controls.opacity);
      }
    },
    updateInfoPosition(newPosition) {
        this.infoPosition = newPosition; // 更新信息窗口的位置
    },
    onMapClick(event) {
    const lngLat = event.lngLat; // 获取点击的经纬度

    // 如果已有靶心图标，先移除
    if (this.currentMarker) {
        this.currentMarker.remove();
    }

    // 创建 SVG 图标的 DOM 元素
    const targetIcon = document.createElement("div");
    targetIcon.style.cursor = "default"; // 设置光标样式为默认
    targetIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="48" height="48">
                <path d="M511.1808 921.9072c-55.1936 0-108.7488-10.752-159.1296-32.1536-48.64-20.5824-92.3648-50.0736-129.9456-87.552s-66.9696-81.2032-87.552-129.9456C113.2544 621.8752 102.4 568.4224 102.4 513.2288c0-55.1936 10.8544-108.7488 32.1536-159.1296 20.5824-48.64 50.0736-92.3648 87.552-129.9456 37.5808-37.5808 81.2032-66.9696 129.9456-87.552C402.432 115.3024 455.9872 104.448 511.1808 104.448s108.7488 10.8544 159.1296 32.1536c48.64 20.5824 92.3648 50.0736 129.9456 87.552 37.5808 37.5808 66.9696 81.2032 87.552 129.9456 21.2992 50.3808 32.1536 103.936 32.1536 159.1296 0 87.9616-27.9552 172.1344-80.7936 243.2l-4.7104 6.3488-21.8112-28.4672 2.56-3.584c45.8752-64 70.0416-139.1616 70.0416-217.4976 0-206.336-167.8336-374.1696-374.1696-374.1696-206.336 0-374.1696 167.8336-374.1696 374.1696 0 206.336 167.8336 374.0672 374.1696 374.0672 68.4032 0 135.7824-19.0464 194.8672-55.1936l4.608-2.7648 21.2992 27.4432-5.632 3.4816c-64.9216 40.3456-139.264 61.6448-215.04 61.6448z" fill="#ffffff"></path>
                <path d="M718.7456 861.5936c-4.608 0-9.0112-1.8432-12.288-5.12-3.2768-3.2768-5.12-7.68-5.12-12.288s1.8432-9.0112 5.12-12.288c3.1744 3.1744 7.68 5.12 12.288 5.12s9.0112 1.8432 12.288 5.12c3.2768 3.2768 5.12 7.68 5.12 12.288s-1.8432 9.0112-5.12 12.288c-3.2768 3.2768-7.7824 5.12-12.288 5.12zM822.9888 766.2592c-4.7104 0-9.216-1.8432-12.5952-5.2224-3.2768-3.2768-5.2224-7.8848-5.2224-12.5952 0-4.7104 1.9456-9.216 5.2224-12.5952 3.2768-3.2768 7.8848-5.2224 12.5952-5.2224s9.216 1.9456 12.5952 5.2224c3.2768 3.2768 5.2224 7.8848 5.2224 12.5952s-1.9456 9.216-5.2224 12.5952c-3.2768 3.2768-7.8848 5.2224-12.5952 5.2224z" fill="#ffffff"></path>
                <path d="M511.1808 215.04c-8.4992 0-15.36-6.8608-15.36-15.36V46.08c0-8.4992 6.8608-15.36 15.36-15.36s15.36 6.8608 15.36 15.36v153.6c0 8.4992-6.9632 15.36-15.36 15.36zM511.1808 995.9424c-8.4992 0-15.36-6.8608-15.36-15.36v-153.6c0-8.4992 6.8608-15.36 15.36-15.36s15.36 6.8608 15.36 15.36v153.6c0 8.4992-6.9632 15.36-15.36 15.36zM198.656 528.5888H45.056c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h153.6c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36zM979.5584 528.5888h-153.6c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h153.6c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36z" fill="#ffffff"></path>
                <path d="M511.1808 513.2288m-71.4752 0a71.4752 71.4752 0 1 0 142.9504 0 71.4752 71.4752 0 1 0-142.9504 0Z" fill="#ffffff"></path>
            </svg>
    `;
    targetIcon.style.width = "48px";
    targetIcon.style.height = "48px";

    // 在点击位置添加靶心图标
    this.currentMarker = new mapboxgl.Marker({ element: targetIcon })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(this.tmap.map);

    // 更新信息内容
    this.infoContent = {
        lng: lngLat.lng.toFixed(4),
        lat: lngLat.lat.toFixed(4),
    };
    this.infoVisible = true; // 显示信息窗口
},





    
    changeCurLayerInfo(layerName) {
        const _this = this;
        _this.curLayerInfo = _this.emptyLayerInfo;
        _this.layerInfos.forEach(layerInfo => {
            if (layerInfo.name === layerName) {
                _this.curLayerInfo = layerInfo;
            }
        });
    }
  }
}
</script>

<style lang="stylus" scoped>
#visualization-module
    position relative
    width 100%
    height 100%
    #map-container
        width 100%
        height 100%
        background-color #000
        position relative
        z-index 1
        >>> .mapboxgl-ctrl-attrib-inner
            color black
    
    #map-container {
        height: 100%;
        width: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        opacity: 1;
        }   
    
    
</style>