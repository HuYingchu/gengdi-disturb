<template>
    <div id="layer-opacity-control">
        <div class="slider-container">
            <input ref="slider" id="slider" class="slider" type="range" min="0" max="1" step="0.01" v-model="opacity">
            <span class="slider-value">{{ parseInt( 100 * opacity) }}%</span>
        </div>
    </div>
</template>

<script>
import TMap from "../../utils/tmap2"

export default {
    props: {
        layerInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tmap: null,
        }
    },
    computed: {
        opacity: {
            get: function() {
                return this.layerInfo.controls.opacity
            },
            set: function(newValue) {
                this.layerInfo.controls.opacity = newValue
            }
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        _this.init()
    },
    methods: {
        init() {
            const _this = this
            const map = _this.tmap.map
            const sliderDom = _this.$refs['slider']

            sliderDom.addEventListener('input', function(e) {
                const targetValue = parseFloat(e.target.value)
                for (let layerConfig of _this.layerInfo.layers) {
                    const layerId = layerConfig.layer.id
                    const opacityAttr = layerConfig.opacityAttr
                    map.setPaintProperty(layerId, opacityAttr, targetValue)
                    layerConfig.layer.paint[opacityAttr] = targetValue
                }
            })
        }
    }
}
</script>

<style scoped lang="stylus">
    #layer-opacity-control
        position relative
        box-sizing border-box
        width 100%
        height 34px
        display flex
        justify-content center
        align-items center
        background-color var(--selector-bg-color)
        transition all 0.2s ease
        .slider-container
            display flex
            align-items center
            input.slider[type="range"]
                -webkit-appearance none
                appearance none
                background-color: var(--inactive-color)
                height 2px
                width 100%
                outline none
            input.slider[type="range"]::-webkit-slider-thumb
                -webkit-appearance none
                width 10px
                height 10px
                background-color  #ff
            input.slider[type="range"]:active::-webkit-slider-thumb
            input.slider[type="range"]:hover::-webkit-slider-thumb
                box-shadow 0 0 6px #fff
            .slider-value
                display inline-block
                width 48px
                text-align right

</style>