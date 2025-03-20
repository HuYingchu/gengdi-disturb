<template>
    <div id="map-pitcher">
        <div class="slider-container">
            <input ref="slider" id="slider" class="slider" type="range" min="0" max="90" step="1" v-model="pitchVal">
        </div>
    </div>
</template>

<script>
import TMap from "../utils/tmap"

export default {
    data() {
        return {
            tmap: null,
        }
    },
    computed: {
        pitchVal: {
            get: function() {
                const _this = this
                if (_this.tmap) {
                    return _this.tmap.map.getPitch()
                }
                return 0
            },
            set: function(newValue) {
                const _this = this
                if (_this.tmap) {
                    _this.tmap.map.setPitch(newValue)
                }
            }
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        const map = this.tmap.map
        const sliderDom = _this.$refs['slider']

        sliderDom.addEventListener('input', function(e) {
            const targetValue = parseFloat(e.target.value)
            map.setPitch(targetValue)
        })
    },
    methods: {

    }
}
</script>

<style lang="stylus" scoped>
#map-pitcher
    position fixed
    bottom 160px
    right 10px
    width 29px
    height 100px
    //background-color var(--content-bg-color)
    //box-shadow var(--shadow)
    display flex
    justify-content center
    z-index 10
    .slider-container
        display flex
        align-items center
        input.slider[type="range"]
            -webkit-appearance none
            appearance none
            background-color var(--inactive-color)
            height 2px
            width 100px
            outline none
            transform: rotate(270deg);
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