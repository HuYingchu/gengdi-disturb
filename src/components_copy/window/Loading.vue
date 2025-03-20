<template>
    <div class="loading">
        <scale-loader :color="color" :height="height" :width="width"></scale-loader>
    </div>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'

export default {
    components: {
        ScaleLoader
    },
    data() {
        return {
            color: 'var(--blue)',
            height: '35px',
            width: '5px'
        }
    }
}
</script>

<style lang="stylus" scoped>
.loading
    position fixed
    box-sizing border-box
    width 100%
    height calc(100% - 70px)
    margin-top 70px
    display flex
    justify-content center
    align-items center
    background-color var(--loading-bg-color)
    opacity 0.7
    z-index 1000
</style>