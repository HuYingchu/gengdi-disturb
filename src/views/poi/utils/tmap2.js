import mapboxgl from "mapbox-gl"
import { addDefaultSourcesAndLayers } from "../../visualization/components/utils/defaultLayers"

mapboxgl.accessToken = "pk.eyJ1Ijoid2Vpd2VpeHgiLCJhIjoiY2t5anJpaXFuMnBneTJ3bzh5b3p6YXFlOSJ9.ozG2l7uHdIpAueCrq-JYng"

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
        if (document.getElementById("poi-container") && !this.created) {
            console.log("getInstance", this.instance)
            this.instance = new TMap()
        }
        return this.instance
    }

    init() {
        const _this = this
        _this.map = new mapboxgl.Map({
            container: 'poi-container',
            // style: 'mapbox://styles/tishacy/ckhon0e5k080m19ns0wypj342',
            style: 'mapbox://styles/weiweixx/cl8736szu000a14qdt6oapzcm',
            center: [121.44603, 28.58993],
            zoom: 11.5,
            customAttribution: ["© 2021 浙江大学遥感与信息技术应用研究所"],
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