<template>
    <div id="map-basemap-gallery">
        <div id="map-basemap-gallery-button"
             ref="map-basemap-gallery-button"
             class="mapboxgl-ctrl mapboxgl-ctrl-group"
             @click="showBasemapGalleryGroup = !showBasemapGalleryGroup">
            <button class="mapboxgl-ctrl-basemap-gallery" type="button" aria-label="Toggle basemap gallery" title="Toggle basemap gallery">
                <span class="mapboxgl-ctrl-icon" aria-hidden="true"></span>
            </button>
        </div>
        <div id="map-basemap-gallery-group"
            v-show="showBasemapGalleryGroup">
            <ul class="map-basemap-gallery-group__container">
                <li class="map-basemap-gallery-group__item"
                    v-for="(basemapItem, index) in basemapGroup"
                    :key="index"
                    @click="changeBasemap(basemapItem)">
                    <img :src="basemapItem['thumbUrl']" alt="">
                    <i :class="{
                        'tag': true,
                        'basemap-active': basemapItem.index === activeBasemapIndex
                    }"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import TMap from "../../../../components/utils/tmap";
import { registerDomControl } from "../../../../components/utils/controlutils"
import { addDefaultSourcesAndLayers } from "../utils/defaultLayers"

export default {
    props: {
        layerInfos: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tmap: null,
            showBasemapGalleryGroup: false,
            activeBasemapIndex: 0,
            basemapGroup: [
                { index: 0, thumbUrl: '/static/basemap/open-street-map-thumbnail.png', styleUrl: 'mapbox://styles/mapbox/outdoors-v11' },
                { index: 1, thumbUrl: '/static/basemap/dark-world-street-map-thumbnail.png', styleUrl: 'mapbox://styles/tishacy/ckhon0e5k080m19ns0wypj342' },
                { index: 2, thumbUrl: '/static/basemap/satellite-thumbnail.jpeg', styleUrl: 'mapbox://styles/mapbox/satellite-v9' },
            ],
            firstAddLayers: true,
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        const map = _this.tmap.map
        const basemapGalleryButtonControl = registerDomControl("map-basemap-gallery-button")
        map.addControl(basemapGalleryButtonControl)
        map.on('load', function() {
            addDefaultSourcesAndLayers(map)
            _this.firstAddLayers = false
        })
        map.on('style.load', function () {
            if (!_this.firstAddLayers) {
                addDefaultSourcesAndLayers(map)
            }
        })
    },
    methods: {
        changeBasemap(basemapItem) {
            const _this = this
            const map = _this.tmap.map
            if (_this.activeBasemapIndex !== basemapItem.index) {
                // Set style
                map.setStyle(basemapItem.styleUrl)
                _this.activeBasemapIndex = basemapItem.index
            }
        },
    }
}
</script>

<style lang="stylus" scoped>

#map-basemap-gallery-button
    .mapboxgl-ctrl-basemap-gallery
        .mapboxgl-ctrl-icon
            background-image url("~@/assets/images/basemap-gallery-button.svg")

#map-basemap-gallery-group
    box-sizing border-box
    position absolute
    bottom 40px
    right 60px
    background-color #fff
    box-shadow 0 0 15px #ccc

    //border 1px solid #fff
    overflow-x scroll
    z-index 10
    ul.map-basemap-gallery-group__container
        position relative
        padding 0 6px
        //height 112px
        li.map-basemap-gallery-group__item
            position relative
            width 100px
            height 75px
            padding 6px
            float left
            cursor pointer
            transition background-color 250ms ease-in-out
            img
                width 100%
                height 100%
            i.tag
                position absolute
                bottom 0
                left 0
                width 100%
                height 3px
                transition background-color 250ms ease-in-out
            i.tag.basemap-active
                background-color var(--blue)
        li.map-basemap-gallery-group__item:hover
            background-color var(--header-hover-bg-color)
            i.tag
                background-color var(--purple)



</style>