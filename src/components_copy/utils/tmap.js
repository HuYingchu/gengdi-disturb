import mapboxgl from "mapbox-gl"
import { addDefaultSourcesAndLayers } from "../../views/visualization_copy/components/utils/defaultLayers"

mapboxgl.accessToken = "pk.eyJ1Ijoic2VkcmZndGhqIiwiYSI6ImNtMW1pNjJsaDBod2Eyam42ejQwcnkyOG4ifQ.7GViL0R5AZUIYRRpYlz20A"

class TMap {
    static instances = new Map()  // 使用 Map 存储多个实例
    static ready = false    // flag of map loaded
    static accessToken = mapboxgl.accessToken

    constructor(containerId = 'map-container') {
        this.map = null
        this.containerId = containerId
        this.init()
    }

    static getInstance(containerId = 'map-container') {
        if (document.getElementById(containerId) && !this.instances.has(containerId)) {
            console.log("getInstance for", containerId)
            this.instances.set(containerId, new TMap(containerId))
        }
        return this.instances.get(containerId)
    }

    init() {
        const _this = this
        if (!document.getElementById(this.containerId)) {
            console.error(`Container ${this.containerId} not found`)
            return
        }

        _this.map = new mapboxgl.Map({
            container: this.containerId,
            style: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
            center: [121.55, 28.58993],
            zoom: 12,
            customAttribution: ["© 2024 浙江大学遥感与信息技术应用研究所"],
        })

        _this.map.on('load', function() {
            TMap.ready = true
            // 如果需要添加默认图层，在这里添加
            if (typeof addDefaultSourcesAndLayers === 'function') {
                addDefaultSourcesAndLayers(_this.map)
            }
        })
        console.log("create mapbox.Map instance for", this.containerId, this.map)
    }

    static destroy(containerId) {
        if (this.instances.has(containerId)) {
            const instance = this.instances.get(containerId)
            if (instance && instance.map) {
                instance.map.remove()
            }
            this.instances.delete(containerId)
            console.log("destroyed map instance for", containerId)
        }
    }
}

export default TMap