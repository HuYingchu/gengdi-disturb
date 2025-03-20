<template>
    <div class="vector-layer"></div>
</template>

<script>
import TMap from "../../../../components/utils/tmap"
import mapboxgl from "mapbox-gl"

export default {
    data() {
        return {
            tmap: null,
            hoveredStateId: null,
            firstLoad: true,
        }
    },
    props: {
        layerConfigs: {
            type: Array
        },
        visibility: {
            type: Boolean
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()

        const map = _this.tmap.map
        map.on('load', function() {
            _this.init()
            _this.firstLoad = false
        })
        map.on('style.load', function() {
            if (!_this.firstLoad) {
                _this.init()
            }
        })
    },
    methods: {
        /**
         * Initialize the map.
         */
        init() {
            const _this = this
            const map = _this.tmap.map

            for (let layerConfig of _this.layerConfigs) {
                if (layerConfig.source && layerConfig.layer) {
                    const layerType = layerConfig.source.type
                    map.addSource(layerConfig.layer.id, layerConfig.source)
                    map.addLayer(layerConfig.layer, layerConfig.before)
                    _this.registerClickEvent(layerConfig, layerType === 'geojson')
                }
            }
        },

        /**
         * Register click events
         */
        registerClickEvent(layerConfig, isGeojsonType) {
            const _this = this
            const map = _this.tmap.map
            const layerId = layerConfig.layer.id
            const sourceId = layerConfig.layer.id

            if (!layerConfig.clickable) { return }

            map.on("click", layerId, function (e) {
                if (e.features.length > 0) {
                    const feature = e.features[0]
                    if (_this.hoveredStateId) {
                        if (isGeojsonType) {
                            map.setFeatureState(
                                { source: sourceId, id: _this.hoveredStateId },
                                { hover: false }
                            )
                        } else {
                            map.setFeatureState(
                                { source: sourceId, id: _this.hoveredStateId, sourceLayer: layerConfig.layer['source-layer'] },
                                { hover: false }
                            )
                        }
                    }
                    _this.hoveredStateId = feature.id
                    if (isGeojsonType) {
                        map.setFeatureState(
                            { source: sourceId, id: _this.hoveredStateId },
                            { hover: true }
                        )
                    } else {
                        map.setFeatureState(
                            { source: sourceId, id: _this.hoveredStateId, sourceLayer: layerConfig.layer['source-layer'] },
                            { hover: true }
                        )
                    }

                    // 触发点击事件，传递给父组件
                    _this.$emit('layer-click', {
                        feature,
                        layerId,
                        lngLat: e.lngLat,
                        point: e.point
                    })
                }
            })

            // 当点击地图其他区域时，清除高亮状态
            map.on('click', function(e) {
                if (_this.hoveredStateId) {
                    if (isGeojsonType) {
                        map.setFeatureState(
                            { source: sourceId, id: _this.hoveredStateId },
                            { hover: false }
                        )
                    } else {
                        map.setFeatureState(
                            { source: sourceId, id: _this.hoveredStateId, sourceLayer: layerConfig.layer['source-layer'] },
                            { hover: false }
                        )
                    }
                    _this.hoveredStateId = null
                }
            })
        },

        /*
         * Get bounds of a polygon feature
         * @param feature: Feature object
         * @return bounds
         */
        getBounds(feature) {
            const coordinates = feature.geometry.coordinates[0];
            const bounds = coordinates.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
            return bounds
        }
    },
    beforeDestroy() {
        const _this = this
        _this.firstLoad = false
    }
}
</script>