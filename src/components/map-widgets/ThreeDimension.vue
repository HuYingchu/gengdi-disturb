<!-- <template>
    <div id="map-three-dim">
        <div id="map-three-dim-button"
             class="mapboxgl-ctrl mapboxgl-ctrl-group"
             @click="toggle3DView">
            <button class="mapboxgl-ctrl-three-dim-button" type="button" aria-label="Toggle 3D view" title="Toggle 3D view">
                <span class="mapboxgl-ctrl-icon" aria-hidden="true"></span>
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
        }
    },
    mounted() {
        this.tmap = TMap.getInstance()
        const map = this.tmap.map
        const threeDimButtonControl = registerDomControl('map-three-dim-button')
        map.addControl(threeDimButtonControl)
    },
    methods: {
        toggle3DView() {
            const _this = this
            const map = _this.tmap.map

            if (map.getPitch() === 0) {
                map.flyTo({
                    bearing: 30,
                    pitch: 60
                })
            } else {
                map.flyTo({
                    bearing: 0,
                    pitch: 0
                })
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
#map-three-dim-button
    .mapboxgl-ctrl-three-dim-button
        .mapboxgl-ctrl-icon
            background-image url("~@/assets/images/three-dim-button.svg")
</style> -->