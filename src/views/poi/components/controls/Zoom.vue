<template>
    <div id="map-zoom"></div>
</template>

<script>
import TMap from "../../utils/tmap2"
import mapboxgl from 'mapbox-gl'

export default {
    data() {
        return {
            tmap: null,
        }
    },
    mounted() {
        this.tmap = TMap.getInstance()
        const map = this.tmap.map
        const zoomControl = new mapboxgl.NavigationControl()
        map.addControl(zoomControl, "bottom-right")
        map.addControl(new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'metric'
        }))
    }
}
</script>

<style lang="stylus" scoped>

</style>