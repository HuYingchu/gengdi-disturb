<template>
    <div id="colormap-selector">
        <div class="selector"
            :style="{ 'border': borderStyle }"
             @click="toggleDropdown">
            <div class="colormap-item">
                <span v-for="(color, index) in curColormap"
                    :key="index"
                    :style="{
                        'background-color': color,
                        'width': `${100 / curColormap.length}%`,
                    }"
                    class="color-item">
                </span>
            </div>
        </div>
        <div class="dropdown"
            v-show="showDropdown">
            <ul class="dropdown-wrapper">
                <li class="dropdown-item"
                    v-for="(colormap, id) in colormaps"
                    :key="id"
                    @click="selectColormap(colormap)">
                    <span class="colormap-tag">{{ id }}</span>
                    <div class="colormap-item">
                        <span v-for="(color, index) in colormap"
                            :key="index"
                            :style="{
                                'background-color': color,
                                'width': `${100 / colormap.length}%`
                            }"
                            class="color-item">
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import colormaps from "../../../../components/utils/colormap"

export default {
    props: {
        curColormap: {
            type: Array,
            required: false,
            default() {
                return colormaps['0']
            }
        }
    },
    data() {
        return {
            colormaps,
            showDropdown: false,
            borderStyle: '1px solid transparent'
        }
    },
    methods: {
        selectColormap(colormap) {
            this.$emit('changeColormap', colormap)
            this.toggleDropdown()
            this.showDropdown = false
        },
        toggleDropdown() {
            this.showDropdown = !this.showDropdown
            if (this.borderStyle.split(' ').slice(-1) == 'transparent') {
                this.borderStyle = '1px solid #fff'
            } else {
                this.borderStyle = '1px solid transparent'
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
    .selector
        position relative
        box-sizing border-box
        width 100%
        height 34px
        display flex
        justify-content center
        align-items center
        background-color var(--selector-bg-color)
        transition all 0.2s ease
        cursor pointer
    .selector:hover
        background-color var(--selector-hover-bg-color)
    
    .dropdown
        box-sizing border-box
        width 100%
        height 100px
        overflow scroll
        background-color var(--selector-bg-color)
        transition all 0.2s ease
        ul.dropdown-wrapper
            width 100%
            height 100%
            float left
            transition all 0.2s ease
            cursor pointer
            li.dropdown-item
                width 100%
                height 30px
                display flex
                justify-content space-evenly
                align-items center
                font-size 10px
            li.dropdown-item:hover
                background-color #3a414c
    .colormap-item
        width 80%
        height 8px
        display flex
        overflow hidden
        border-radius 2px
    .colormap-tag
        display  inline-block
        color var(--content-color)
        font-size 10px
</style>