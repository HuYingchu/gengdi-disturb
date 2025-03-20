<template>
    <div class="normal-window stacked-dom"
         ref="normal-window"
         :style="{'width':`${width}px`, 'height': `${actualHeight}px`}"
         v-show="showWindow">
        <div class="header"
             ref="drag-element"
            :style="headerStyle">
            <div class="header-content">
                <div class="left-icon icon" v-show="hasLeftIcon">
                    <slot name="left-icon"></slot>
                </div>
                <div class="header-title" :style="{'color': headerTextColor}">{{ headerTitle }}</div>
                <div class="right-icon icon" v-show="hasRightIcon">
                    <slot name="right-icon"></slot>
                </div>
            </div>
            <div class="close-btn" v-show="couldBeClosed" @click="closeWindow">
                <svg viewBox="0 0 64 64" width="16px" height="16px" class="data-ex-icons-closewindow " style="fill: #000"><g transform="translate(8,8)"><path d="M16.127688,49.4434399 L0.686714703,34.0024666 C-0.228904901,33.086847 -0.228904901,31.6023343 0.686714703,30.6867147 C1.12641074,30.2470187 1.72276655,30 2.34459065,30 L17.785564,30 C19.0804456,30 20.1301546,31.049709 20.1301546,32.3445907 L20.1301546,47.785564 C20.1301546,49.0804456 19.0804456,50.1301546 17.785564,50.1301546 C17.1637399,50.1301546 16.5673841,49.883136 16.127688,49.4434399 Z"></path><path d="M45.127688,19.4434399 L29.6867147,4.0024666 C28.7710951,3.086847 28.7710951,1.60233431 29.6867147,0.686714703 C30.1264107,0.247018663 30.7227665,-8.17124146e-14 31.3445907,-8.17124146e-14 L46.785564,-7.7547585e-14 C48.0804456,-7.7547585e-14 49.1301546,1.04970899 49.1301546,2.34459065 L49.1301546,17.785564 C49.1301546,19.0804456 48.0804456,20.1301546 46.785564,20.1301546 C46.1637399,20.1301546 45.5673841,19.883136 45.127688,19.4434399 Z" transform="translate(39.065077, 10.065077) rotate(-180.000000) translate(-39.065077, -10.065077)"></path></g></svg>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="content-wrapper"
                v-show="!isCollapse"
                :style="contentStyle">
                <div class="content" :style="{'padding': `${padding}px`, 'height': 'calc(100% - ${2*this.padding}px)'}">
                    <slot name="content"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import {DragDomElem, LimitDragDomElem} from "../utils/controlutils";

export default {
    props: {
        width: {
            type: Number,
            default() {
                return 300
            }
        },
        height: {
            type: Number,
            default() {
                return
            }
        },
        headerTitle: {
            type: String,
            default() {
                return "窗口标题"
            }
        },
        headerBackgroundColor: {
            type: String,
            default() {
                return 'var(--header-bg-color)'
            }
        },
        headerTextColor: {
            type: String,
            default() {
                return 'var(--content-color)'
            }
        },
        headerHeight: {
            type: Number,
            default() {
                return 40
            }
        },
        headerFontSize: {
            type: Number,
            default() {
                return 15
            }
        },
        hasLeftIcon: {
            type: Boolean,
            default() {
                return false
            }
        },
        hasRightIcon: {
            type: Boolean,
            default() {
                return false
            }
        },
        isCollapse: {
            type: Boolean,
            default() {
                return false
            }
        },
        contentBackgroundColor: {
            type: String,
            default() {
                return "var(--content-bg-color)"
            }
        },
        couldBeClosed: {
            type: Boolean,
            default() {
                return true
            }
        },
        showWindow: {
            type: Boolean,
            default() {
                return true
            }
        },
        draggable: {
            type: Boolean,
            default() {
                return false
            }
        }
    },
    data() {
        return {
            padding: 16,
        }
    },
    computed: {
        actualHeight() {
            if (this.isCollapse) {
                return this.headerHeight
            } else {
                return this.height
            }
        },
        headerStyle() {
            return {
                'background-color': this.headerBackgroundColor,
                'font-size': `${this.headerFontSize}px`,
                'height': `${this.headerHeight}px`,
                'padding': `5px ${this.padding}px 5px`,
                'line-height': `${this.headerHeight}px`,
            }
        },
        contentStyle() {
            return {
                'background-color': this.contentBackgroundColor,
                // 'width': `calc(100% - ${2*this.padding}px)`,
                // 'height': `calc(100% - ${this.headerHeight}px)`,
                // 'padding': `${this.padding}px`
                'transition': `all 0.3s ease-in-out`
            }
        }
    },
    mounted() {
        if (this.draggable) {
            // new DragDomElem(
            //     this.$refs['drag-element'],
            //     this.$refs['normal-window']
            // )
            new LimitDragDomElem(
                this.$refs['drag-element'],
                this.$refs['normal-window'],
                document.getElementById("visualization-module")
            )
        }
    },
    methods: {
        closeWindow() {
            this.$emit('closeWindow', false)
        }
    },
}
</script>

<style lang="stylus" scoped>
.normal-window
    box-sizing border-box
    //transition all 0.2s ease

.header
    text-align left 
    overflow hidden
    box-shadow var(--shadow)
    display flex
    align-items center
    justify-content space-between
    .header-content
        .icon
            width 30px
            height 100%
            display inline-block
            text-align left
            color var(--icon-color)
            transition all 0.2s ease
            :hover
                color var(--icon-hover-color)
        .left-icon
            float left
            text-align left 
        .right-icon
            float right
            text-align right
        .header-title
            display inline-block
            // max-width calc(100% - 80px)
            height 100%
            display inline-block
            float left
    .close-btn
        width 18px
        height 18px
        background-color var(--light-grey)
        display flex
        justify-content center
        align-items center
        border-radius 50%
        cursor pointer

.content-wrapper
    box-sizing border-box
    height calc(100% - 50px)
    position relative
    overflow auto
    box-shadow var(--shadow)

.slide-fade-enter-active, .slide-fade-leave-active
    transition: all .2s ease-in-out
.slide-fade-enter, .slide-fade-leave-to
    height 0

[class*=" el-icon-"]
    vertical-align middle
</style>