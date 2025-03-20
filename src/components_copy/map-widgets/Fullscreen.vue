<template>
    <div id="map-full-screen"></div>
</template>

<script>
import TMap from "../utils/tmap"
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
        const fullscreenControl = new mapboxgl.FullscreenControl()
        map.addControl(fullscreenControl)
    }
}
</script>

<style lang="stylus" scoped>

</style>