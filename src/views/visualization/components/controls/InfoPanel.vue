<!-- <template>
  <div class="info-panel" ref="info-panel" style="display: none">
    <div
      class="info-panel__wrapper"
      v-for="(infoPanelDataSource, index) in infoPanelDataSources"
      :key="index"
      v-show="infoPanelDataSource.visible"
      style="position: relative; width: 100%"
    >
      <div class="info-panel__header">
        <svg viewBox="0 0 64 64" width="15px" height="15px" class="data-ex-icons-layers" style="fill: currentcolor; padding: 0 5px 0 0">
          <path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path>
        </svg>
        <span class="info-name">{{ infoPanelDataSource.name }}</span>
      </div>
      <table class="info-panel__table">
        <tbody>
          <tr class="row" v-for="(value, name) in infoPanelDataSource.data" :key="name">
            <td class="row__name">{{ name }}</td>
            <td class="row__value">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="coordinates.lng && coordinates.lat" class="coordinates-info">
      <p>经度: {{ coordinates.lng }}</p>
      <p>纬度: {{ coordinates.lat }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import TMap from "../../../../components/utils/tmap";
import { calculateTileAndPixel } from './tileCalculator.js';
import LayerOpacityControl from './LayerOpacityControl.vue';
import ColormapSelector from './ColormapSelector.vue';

export default {
  components: {
    LayerOpacityControl,
    ColormapSelector
  },
  props: {
    visibleLayerInfos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tmap: null,
      infoPanelDataSources: {},
      tagColor: "var(--content-bg-color)",
      defaultInfoPanelConfig: {
        titleField: "name",
        alias: null,
      },
      popup: null,
      coordinates: {
        lng: null,
        lat: null,
      },
      layerControls: true,
      disturbLayerInfo: {
        controls: {
          opacity: 1,
        },
        colormap: 'viridis'
      },
      conseLayerInfo: {
        controls: {
          opacity: 1,
        },
        colormap: 'viridis'
      }
    };
  },
  mounted() {
    const _this = this;
    _this.tmap = TMap.getInstance();
    _this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    _this.tmap.map.on("load", function () {
      _this.registerInfoPanel();
    });
  },
  methods: {
    registerInfoPanel() {
      const _this = this;
      const map = _this.tmap.map;

      _this.visibleLayerInfos.forEach((layerInfo) => {
        layerInfo.layers.forEach((layerConfig) => {
          const layerId = layerConfig.layer.id;
          
          // 设置图层信息
          if (layerId.includes('disturb')) {
            _this.disturbLayerInfo = {
              layers: [layerConfig],
              controls: {
                opacity: layerConfig.layer.paint['raster-opacity'] || 1
              },
              colormap: layerConfig.colormap || []
            };
          } else if (layerId.includes('conse')) {
            _this.conseLayerInfo = {
              layers: [layerConfig],
              controls: {
                opacity: layerConfig.layer.paint['raster-opacity'] || 1
              },
              colormap: layerConfig.colormap || []
            };
          }

          const infoPanelConfig = layerConfig.infoPanelConfig;

          if (!layerConfig.hoverable) {
            return;
          }

          _this.infoPanelDataSources[layerId] = {
            visible: false,
            name: "",
            data: {},
          };

          map.on("mousemove", layerId, function (e) {
            if (_this.showInfoPanel) {
              _this.showInfoPanel = false;
            }

            const feature = e.features[0];

            // 计算瓦片信息
            
            
            const zoom = Math.round(_this.tmap.map.getZoom())+1;
            console.log(zoom)
            const result = calculateTileAndPixel(e.lngLat.lng, e.lngLat.lat, zoom);

            if (result && result.pixelCoords) {
              const { tileX, tileY, pixelCoords } = result;

              // 更新信息面板的信息
              _this.updateInfoPanelInfo(feature, layerId, infoPanelConfig, zoom, tileX, tileY, pixelCoords);

              // 更新信息面板的位置
              _this.updateInfoPanelPosition(e, feature);
            } else {
              console.error("瓦片计算返回无效:", result);
            }

            _this.coordinates = {
              lng: e.lngLat.lng,
              lat: e.lngLat.lat,
            };
          });

          map.on("mouseleave", layerId, function () {
            map.getCanvas().style.cursor = "";
            _this.$set(_this.infoPanelDataSources, layerId, {
              visible: false,
              name: "",
              data: {},
            });
            _this.popup.remove();
          });
        });
      });
    },

    async updateInfoPanelPosition(evt, feature) {
      const _this = this;
      const map = _this.tmap.map;

      map.getCanvas().style.cursor = "pointer";



      const infoPanel = _this.$refs["info-panel"];
      if (infoPanel) {
        _this.popup
          .setLngLat(evt.lngLat)
          .setHTML(infoPanel.innerHTML)
          .addTo(map);
      } else {
        console.error("info-panel 引用无效");
      }
    },

    async updateInfoPanelInfo(feature, layerId, infoPanelConfig, zoom, tileX, tileY, pixelCoords) {
  const _this = this;
  const attrs = feature.properties;

  if (!infoPanelConfig) return false;

  // 构建获取 GeoServer 数据的 URL
  const disturbUrl = `http://10.75.68.56:8080/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=sccd:disturb&STYLE=&TILEMATRIX=EPSG:3857:${zoom}&TILEMATRIXSET=EPSG:3857&SERVICE=WMTS&FORMAT=image/jpeg&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=${tileX}&TileRow=${tileY}&I=${pixelCoords.pixelX}&J=${pixelCoords.pixelY}`;
  
  const conseUrl = `http://10.75.68.56:8080/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=sccd:dispro&STYLE=&TILEMATRIX=EPSG:3857:${zoom}&TILEMATRIXSET=EPSG:3857&SERVICE=WMTS&FORMAT=image/jpeg&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=${tileX}&TileRow=${tileY}&I=${pixelCoords.pixelX}&J=${pixelCoords.pixelY}`;
console.log(disturbUrl,conseUrl)

  try {
    // 请求 disturb 图层的数据
    const disturbResponse = await axios.get(disturbUrl);
    const disturbGeoData = disturbResponse.data;

    let disturbGrayIndex = null;
    if (disturbGeoData.features.length > 0) {
      disturbGrayIndex = disturbGeoData.features[0].properties.GRAY_INDEX;
    }

    // 请求 conse 图层的数据
    const conseResponse = await axios.get(conseUrl);
    const conseGeoData = conseResponse.data;

    let conseGrayIndex = null;
    if (conseGeoData.features.length > 0) {
      conseGrayIndex = conseGeoData.features[0].properties.GRAY_INDEX;
    }

    // 更新信息面板数据
    _this.$set(_this.infoPanelDataSources, layerId, {
      visible: true,
      name: attrs[infoPanelConfig.titleField] || infoPanelConfig.title,
      data: (() => {
        const alias = infoPanelConfig.alias;
        const data = {};
        Object.keys(alias).forEach((key) => {
          let val = attrs[key];
          if (val && val !== "null") {
            // 格式化日期或数字
            if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(val)) {
              const [year, month, day] = val.split("-").map(Number);
              val = `${year}年${month}月${day}日`;
            } else if (key === "chg-date") {
              const dateParts = val.split("-").map(Number);
              if (dateParts.length === 3) {
                const [year, month, day] = dateParts;
                val = `${year}年${month}月${day}日`;
              }
            } else {
              if (!isNaN(val)) {
                val = Number(val);
                val = val % 1 !== 0 ? Math.floor(val) : val;

                if (alias[key] === "经度" || alias[key] === "纬度") {
                  val = val.toFixed(6);
                } else {
                  let att = alias[key].slice(0, 2);
                  if (["Cd", "Hg", "As", "Pb", "Cr", "pH"].includes(att)) {
                    val = val.toFixed(2);
                  }
                }
              }
            }
            data[alias[key]] = val;
          }
        });
        data["DISTURB"] = disturbGrayIndex; // 显示 disturb 图层的 GRAY_INDEX
        data["PRO"] = conseGrayIndex; // 显示 conse 图层的 GRAY_INDEX
        return data;
      })(),
    });

    _this.$forceUpdate();
  } catch (error) {
    console.error("获取 GeoServer 数据失败:", error);
  }

  return true;
},
    showInfoPanel(feature, layerId, lngLat) {
      const _this = this;
      const map = _this.tmap.map;
      
      // 计算瓦片信息
      const zoom = Math.round(_this.tmap.map.getZoom()) + 1;
      const result = calculateTileAndPixel(lngLat.lng, lngLat.lat, zoom);

      if (result && result.pixelCoords) {
        const { tileX, tileY, pixelCoords } = result;
        const layerConfig = this.findLayerConfig(layerId);
        
        if (layerConfig && layerConfig.infoPanelConfig) {
          // 更新信息面板的信息
          this.updateInfoPanelInfo(feature, layerId, layerConfig.infoPanelConfig, zoom, tileX, tileY, pixelCoords);

          // 更新信息面板的位置
          this.updateInfoPanelPosition({ lngLat }, feature);

          this.coordinates = {
            lng: lngLat.lng,
            lat: lngLat.lat,
          };
        }
      }
    },

    findLayerConfig(layerId) {
      for (const layerInfo of this.visibleLayerInfos) {
        for (const config of layerInfo.layers) {
          if (config.layer.id === layerId) {
            return config;
          }
        }
      }
      return null;
    },
    // 更新图层透明度
    updateLayerOpacity(layerInfo) {
      const map = this.tmap.map;
      layerInfo.layers.forEach(layerConfig => {
        map.setPaintProperty(layerConfig.layer.id, 'raster-opacity', layerInfo.controls.opacity);
      });
    },

    // 更新颜色映射
    changeColormap(colormap, layerType) {
      const map = this.tmap.map;
      const layerInfo = layerType === 'disturb' ? this.disturbLayerInfo : this.conseLayerInfo;
      
      if (layerInfo) {
        layerInfo.colormap = colormap;
        layerInfo.layers.forEach(layerConfig => {
          // 这里需要根据实际的颜色映射逻辑来设置
          const layerId = layerConfig.layer.id;
          // 构建新的 WMS URL 包含颜色映射参数
          const source = map.getSource(layerId);
          if (source) {
            const tiles = source.tiles;
            // 更新 tiles URL 中的 style 参数
            // 这里需要根据实际的 GeoServer 配置来修改
            console.log(`Updating ${layerType} layer colormap:`, colormap);
          }
        });
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
.info-panel__header {
  width: 100%;
  padding: 0 14px;
  margin-top: 12px;
  position: relative;
  display: flex;
  align-items: center;

  .info-name {
    display: inline-block;
    width: calc(100% - 35px);
    color: var(--header-color);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.43px;
  }

  .color-tag {
    display: inline-block;
    position: absolute;
    right: 20px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 100%;
  }
}

.info-panel__table {
  width: 100%;
  padding: 12px;
  position: relative;

  tr.row {
    font-size: 13px;
    line-height: 15px;

    .row__name {
      color: var(--content-color);
      padding: 4px;
      width: 100px;
    }

    .row__value {
      color: var(--header-color);
      padding: 4px;
      text-align: right;
      font-weight: 500;
    }
  }
}

.layer-controls
  padding 12px
  background-color var(--content-bg-color)
  border-top 1px solid var(--border-color)
  
  .layer-control-item
    margin-bottom 16px
    
    h4
      margin 0 0 8px 0
      font-size 14px
      color var(--header-color)
    
    .opacity-control,
    .colormap-control
      margin-bottom 8px
      
      span
        display block
        margin-bottom 4px
        color var(--content-color)
        font-size 13px
      
      .el-slider
        width 100%
        
    .colormap-control
      .colormap-selector
        width 100%
        padding 4px
        border 1px solid var(--border-color)
        border-radius 4px
        background-color var(--content-bg-color)
</style> -->