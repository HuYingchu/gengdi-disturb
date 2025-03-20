<template>
    <div id="map-home-button"
         class="mapboxgl-ctrl mapboxgl-ctrl-group"
        @click="backToOriginalView">
        <button class="mapboxgl-ctrl-home-button" type="button" aria-label="Back to original view" title="Back to original view">
            <span class="mapboxgl-ctrl-icon" aria-hidden="true"></span>
        </button>
    </div>
</template>

<script>
import TMap from "../utils/tmap"
import { registerControl} from "../utils/controlutils"

export default {
    data() {
        return {
            tmap: null,
        }
    },
    mixins: [
        registerControl("map-home-button")
    ],
    mounted() {
        this.tmap = TMap.getInstance()
        const map = this.tmap.map
        map.addControl(this)
    },
    methods: {
        backToOriginalView() {
            const _this = this
            const map = _this.tmap.map

            map.flyTo({
                center: [121.44603, 29.974815],
                zoom: 11.5,
                bearing: 0,
                pitch: 0
            })
        }
    }
}
</script>

<style lang="stylus" scoped>

.mapboxgl-ctrl-home-button
    .mapboxgl-ctrl-icon
        background-image url("~@/assets/images/home-button.svg")

</style>