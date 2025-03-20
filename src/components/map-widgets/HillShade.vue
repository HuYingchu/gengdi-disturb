<template>
    <div id="map-hill-shade">
        <div id="toggle-hill-shade-button"
             ref="toggle-hill-shade-button"
             class="mapboxgl-ctrl mapboxgl-ctrl-group"
             @click="toggleHillShadeLayer">
            <button class="mapboxgl-ctrl-toggle-hill-shade" type="button" aria-label="Toggle hill shade layer" title="Toggle hill shade layer">
                <span class="mapboxgl-ctrl-icon el-icon-switch-button" aria-hidden="true"></span>
            </button>
        </div>
    </div>
</template>

<script>
import TMap from "../utils/tmap"
import { registerDomControl } from "../utils/controlutils"

export default {
    data() {
        return {
            tmap: null,
            visibility: 'none'
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        const map = _this.tmap.map

        map.on('load', function () {

        })

        const toggleHillShadeControl = registerDomControl("toggle-hill-shade-button")
        map.addControl(toggleHillShadeControl)
    },
    methods: {
        toggleHillShadeLayer() {
            const _this = this
            const map = _this.tmap.map
            _this.visibility = (_this.visibility === 'visible')? 'none' : 'visible'
            map.setLayoutProperty('hillshading', 'visibility', _this.visibility)
        }
    }
}
</script>

<style lang="stylus" scoped>
.mapboxgl-ctrl-icon
    line-height 29px
    font-size 18px
</style>