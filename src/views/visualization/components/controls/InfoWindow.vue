<template>
    <div 
        v-if="visible" 
        :style="{ left: position.x + 'px', top: position.y + 'px' }" 
        class="info-window"
        
    >
    <div 
            class="info-window-header"
            @mousedown="startDrag"
        >

            <button class="toggle-btn" @click="toggleCollapse">
                <svg 
                    viewBox="0 0 64 64" 
                    width="23px" 
                    height="20px" 
                    class="data-ex-icons-layers" 
                    style="fill: #00BFFF; stroke: none"
                >
                    <path 
                        d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"
                    ></path>
                </svg>
            </button>    
            <span class="title">扰动信息</span>
        </div>
        <div class="info-window-content" v-show="!collapsed">
            
            <table class="grid-table">
                <thead>
                    <tr>
                        <th>经纬度</th>
                        <th>地表异常特征</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>经度: {{ content.lng }}</td>
                        <td>地表异常连续观测数: {{ geoData.GRAY_DISTURB  }}</td>
                    </tr>
                    <tr>
                        <td>纬度: {{ content.lat }}</td>
                        <td>地表异常事件置信度: {{ geoData.GRAY_PRO }}%</td>
                    </tr>
                    <!-- 添加更多行 -->
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { fetchGeoServerData } from './tile.js'; // 导入 tile.js 中的函数

export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        position: {
            type: Object,
            required: true
        },
        content: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dragging: false,
            dragOffset: { x: 0, y: 0 },
            collapsed: false,
            geoData: {}
        };
    },
    methods: {
        startDrag(event) {
            this.dragging = true;
            this.dragOffset.x = event.clientX - this.position.x;
            this.dragOffset.y = event.clientY - this.position.y;
            window.addEventListener('mousemove', this.onDrag);
            window.addEventListener('mouseup', this.stopDrag);
        },
        onDrag(event) {
            if (this.dragging) {
                this.$emit('update:position', {
                    x: event.clientX - this.dragOffset.x,
                    y: event.clientY - this.dragOffset.y
                });
            }
        },
        stopDrag() {
            this.dragging = false;
            window.removeEventListener('mousemove', this.onDrag);
            window.removeEventListener('mouseup', this.stopDrag);
        },
        toggleCollapse() {
            this.collapsed = !this.collapsed; // 切换收起状态
        },
        async fetchData() {
            try {
                this.geoData = await fetchGeoServerData({ lng: this.content.lng, lat: this.content.lat }, this.$parent.tmap);
                console.log("获取的地理数据:", this.geoData); // 调试信息
            } catch (error) {
                console.error("获取地理数据时出错:", error);
            }
        }
    },
    watch: {
        content: {
            immediate: true,
            handler() {
                this.fetchData(); // 当 content 更新时重新请求数据
            }
        }
    },
    mounted() {
        // 组件挂载时请求数据
        this.fetchData();
    }
}
</script>

<style scoped>
.info-window {
    position: absolute; /* 允许拖动 */
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* 确保窗口在上层 */
}

.info-window-header {
    display: flex;
    justify-content: space-between; /* 使按钮分布在两端 */
    align-items: center;
    cursor: move;
    background: #f1f1f1;
    padding: 5px;
    border-bottom: 1px solid #ccc;
}

.title {
    flex: 1; /* 使标题占据剩余空间 */
    text-align: center; /* 中心对齐 */
}

.toggle-btn {
    margin-right: 10px; /* 与标题之间增加间隔 */
    cursor: pointer;
}

.info-window-content {
    margin: 10px 0;
    transition: max-height 0.3s ease, opacity 0.3s ease; /* 添加过渡效果 */
    overflow: hidden; /* 隐藏溢出内容 */
}

.info-window-content[collapsed] {
    max-height: 0; /* 收起时最大高度为 0 */
    opacity: 0; /* 收起时透明 */
}

.grid-table {
    border-collapse: collapse;
    width: 100%;
}

.grid-table th {
    background-color: #A0D3E8; /* 冰川蓝 */
    color: white; /* 白色字体 */
}

.grid-table tr:nth-child(odd) {
    background-color: #E0F7FA; /* 浅冰川蓝 */
}

.grid-table tr:nth-child(even) {
    background-color: #B2EBF2; /* 更浅的冰川蓝 */
}

.grid-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
    color: #333; /* 深灰色字体 */
}
</style>