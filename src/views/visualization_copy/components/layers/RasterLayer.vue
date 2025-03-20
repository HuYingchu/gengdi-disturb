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
                    map.addLayer(layerConfig.layer)
                    _this.registerHoverEvent(layerConfig, layerType === 'geojson')
                    _this.registerClickEvent(layerConfig)
                }
            }
        },
        /**
         * Register hover events
         */
        registerHoverEvent(layerConfig, isGeojsonType) {
            const _this = this
            const map = _this.tmap.map
            const layerId = layerConfig.layer.id
            const sourceId = layerConfig.layer.id

            if (!layerConfig.layer.hoverable) { return }

            // When the user moves their mouse over the state-fill layer, we'll update the
            // feature state for the feature under the mouse.
            map.on('mousemove', layerId, function (e) {
                if (e.features.length > 0) {
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
                    _this.hoveredStateId = e.features[0].id
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
                }
            })

            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            map.on('mouseleave', layerId, function () {
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
                _this.hoveredStateId = null
            })
        },
        /**
         * Register click events
         */
        registerClickEvent(layerConfig) {
            const _this = this
            const map = _this.tmap.map
            const layerId = layerConfig.layer.id

            if (!layerConfig.layer.clickable) { return }
            console.log("register click event for " + layerId)
            map.on("click", layerId, function (e) {
                console.log(e)
                if (e.features.length > 0) {
                    const feature = e.features[0]
                    if (feature.geometry.type === "Point") {
                        map.flyTo({
                            center: feature.geometry.coordinates,
                            zoom: 10,
                        })
                    } else {
                        const bounds = _this.getBounds(feature)
                        map.fitBounds(bounds, {
                            padding: 50
                        })
                    }
                }
            })
        },
        /**
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
    }
}
</script>