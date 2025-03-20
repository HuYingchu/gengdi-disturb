import mapboxgl from "mapbox-gl"
import { addDefaultSourcesAndLayers } from "../../views/visualization/components/utils/defaultLayers"

mapboxgl.accessToken = "pk.eyJ1Ijoic2VkcmZndGhqIiwiYSI6ImNtMW1pNjJsaDBod2Eyam42ejQwcnkyOG4ifQ.7GViL0R5AZUIYRRpYlz20A"

/**
 * TMap with singleton.
 */
class TMap {
    static created = false  // flag of creation of the TMap instance
    static ready = false    // flag of map loaded
    static accessToken = mapboxgl.accessToken
    static instance = null

    constructor() {
        this.map = null
        this.init()
    }

    static getInstance() {
        if (document.getElementById("map-container") && !this.created) {
            console.log("getInstance", this.instance)
            this.instance = new TMap()
        }
        return this.instance
    }

    init() {
        const _this = this
        _this.map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
            center: [121.55, 28.58993],
            zoom: 12,
            customAttribution: ["© 2024 浙江大学遥感与信息技术应用研究所"],
        })

        _this.map.on('load', function() {
            TMap.ready = true
        })
        console.log("create mapbox.Map instance", this.map)
        TMap.created = true
    }

    static destroy() {
        this.instance = null
        this.created = false
        this.ready = false
    }
}

export default TMap