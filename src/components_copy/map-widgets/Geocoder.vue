<template>
    <div id="map-geocoder">
        <div id="map-geocoder-button"
             class="mapboxgl-ctrl mapboxgl-ctrl-group"
             @click="toggleGeocoder">
            <button class="mapboxgl-ctrl-geocoder-button" type="button" aria-label="Toggle geocoder" title="Toggle geocoder">
                <span class="mapboxgl-ctrl-icon el-icon-location" aria-hidden="true"></span>
            </button>
        </div>
    </div>
</template>

<script>
import TMap from "../utils/tmap"
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import { registerDomControl } from "../utils/controlutils"

export default {
    data() {
        return {
            tmap: null,
            showGeocoder: false
        }
    },
    mounted() {
        this.tmap = TMap.getInstance()
        const map = this.tmap.map
        const geocoderControl = new MapboxGeocoder({
            accessToken: TMap.accessToken,
            mapboxgl: mapboxgl
        })
        const geocoderButtonControl = registerDomControl('map-geocoder-button')
        map.addControl(geocoderControl)
        map.addControl(geocoderButtonControl)
    },
    methods: {
        toggleGeocoder() {
            const elems = document.getElementsByClassName("mapboxgl-ctrl-geocoder")
            if (elems.length === 0) {
                return
            }
            const geocoderDomElem = elems[0]
            geocoderDomElem.style.display = geocoderDomElem.style.display === "block"? "none" : "block"
        }
    }
}
</script>

<style lang="stylus" scoped>
#map-geocoder-button
    .mapboxgl-ctrl-geocoder-button
        .mapboxgl-ctrl-icon
            text-align center
            line-height 29px
            font-size 17px
        .mapboxgl-ctrl-icon:hover
            color var(--content-color)

</style>