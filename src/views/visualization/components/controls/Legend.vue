<template>
    <div id="map-legend">
        <div id="map-legend-button"
             class="mapboxgl-ctrl mapboxgl-ctrl-group"
             @click="showLegend = !showLegend">
            <button class="mapboxgl-ctrl-legend-button" type="button" aria-label="Toggle legend" title="Toggle legend">
                <span class="mapboxgl-ctrl-icon" aria-hidden="true"></span>
            </button>
        </div>
        <div id="map-legend-container"
             class="map-legend-container stacked-dom"
             ref="map-legend"
             v-show="showLegend">
            <div class="layer-legend-container" v-for="(legendInfo, index) in legendInfosOfLayers" :key="index">
                <div class="layer-legend-title">{{ legendInfo.name }}</div>
                <div class="layer-legend-info-container">
                    <div class="legend-numbers" v-if="legendInfo.minValue !== undefined && legendInfo.maxValue !== undefined">
                        <span class="min-value">{{ legendInfo.minValue }}</span>
                        <span class="max-value">{{ legendInfo.maxValue }}</span>
                    </div>
                    <!-- 根据 useGradient 属性决定是否显示渐变条 -->
                    <div v-if="legendInfo.useGradient" class="gradient-bar"
                         :style="{ background: `linear-gradient(to right, ${legendInfo.gradientColors.join(', ')})` }"></div>
                    <div class="layer-legend-info-item"
                         v-for="(legendItem, index) in legendInfo.info" :key="index">
                        <span :class="['layer-legend-info-item-color', legendInfo.type]" 
                              :style="{ 'background-color': legendItem[1] }"></span>
                        <span class="layer-legend-info-item-name">{{ legendItem[0] }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TMap from "../../../../components/utils/tmap";
import { DragDomElem, LimitDragDomElem, registerDomControl } from "../../../../components/utils/controlutils";

export default {
    name: "Legend",
    props: {
        visibleLayerInfos: {
            type: Array,
            required: true
        },
        draggable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            tmap: null,
            showLegend: false,
            legendInfosOfLayers: []
        };
    },
    watch: {
        visibleLayerInfos: {
            handler() {
                this.loadLegendInfosOfLayers();
            },
            deep: true
        }
    },
    mounted() {
        const _this = this;
        _this.tmap = TMap.getInstance();
        const map = _this.tmap.map;
        map.addControl(registerDomControl("map-legend-button"));
        map.on('load', function () {
            _this.loadLegendInfosOfLayers();
        });
        map.on('zoom', function () {
            _this.loadLegendInfosOfLayers();
        });

        if (_this.draggable) {
            new LimitDragDomElem(
                _this.$refs['map-legend'],
                _this.$refs['map-legend'],
                document.getElementById("map-container")
            );
        }
    },
    methods: {
        loadLegendInfosOfLayers() {
            const _this = this;
            const map = _this.tmap.map;
            _this.legendInfosOfLayers = [];

            _this.visibleLayerInfos.forEach(layerInfo => {
                const colormap = layerInfo.controls.colormap;
                layerInfo.layers.forEach(layerConfig => {
                    const legendConfig = layerConfig.legendConfig;
                    const minzoom = layerConfig.layer.minzoom || 0;
                    const maxzoom = layerConfig.layer.maxzoom || 22;

                    if (legendConfig && map.getZoom() >= minzoom && map.getZoom() <= maxzoom) {
                        const { render } = legendConfig;
                        const legendInfo = render(colormap);

                        // 从图层配置中获取最小值和最大值
                        const minValue = layerConfig.minValue; // 不设置默认值
                        const maxValue = layerConfig.maxValue; // 不设置默认值

                        // 仅当 minValue 和 maxValue 存在时才添加
                        if (minValue !== undefined && maxValue !== undefined) {
                            legendInfo.minValue = minValue;
                            legendInfo.maxValue = maxValue;
                        }

                        // 添加渐变设置
                        legendInfo.useGradient = layerConfig.useGradient; // 是否使用渐变
                        legendInfo.gradientColors = layerConfig.gradientColors || []; // 自定义渐变颜色

                        _this.legendInfosOfLayers.push(legendInfo);
                    }
                });
            });
        }
    }
};
</script>

<style scoped lang="stylus">
#map-legend-button
    .mapboxgl-ctrl-legend-button
        .mapboxgl-ctrl-icon
            background-image url("~@/assets/images/legend-button.svg")

.map-legend-container
    position absolute
    right 60px
    top 10px
    max-width 200px
    min-width 150px
    max-height 300px
    background-color var(--content-bg-color)
    color var(--content-color)
    overflow scroll
    z-index 10
    box-shadow 0 0px 15px #ccc

    .layer-legend-container:nth-child(1)
        border-top none

    .layer-legend-container
        width calc(100% - 24px)
        padding 12px
        border-top 1px solid var(--grey)

        .layer-legend-title
            font-size 14px

        .layer-legend-info-container
            margin-top 10px

            .layer-legend-info-item
                width 100%
                font-size 12px
                line-height 23px

                span.layer-legend-info-item-color
                    display inline-block
                    width 10px
                    height 10px

                span.layer-legend-info-item-color.point
                    border-radius 50%

                span.layer-legend-info-item-color.polygon
                    width 20px

                span.layer-legend-info-item-name
                    display inline-block
                    padding-left 10px

.legend-numbers
    display flex
    justify-content space-between
    margin-bottom 4px /* 添加底部间距 */
    font-size 12px /* 字体大小可以根据需要调整 */

.gradient-bar
    width 100%
    height 20px /* 高度可以根据需要调整 */
    border-radius 5px /* 圆角效果 */
</style>