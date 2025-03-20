<template>
  <div>
    <div id="map"></div>
    <div class="coordinates" v-if="coordinates">
      经度: {{ coordinates.lng.toFixed(6) }} | 纬度:{{
        coordinates.lat.toFixed(6)
      }}
    </div>
    <footer class="footer">
      <p>
        中国近实时土地扰动归因系统<br />© 2024 浙江大学环资学院叶粟团队.
        保留所有权利.
      </p>
    </footer>
  </div>
</template>

<script>
import "geotiff";
import L from "leaflet";
import "leaflet-geotiff";
import "leaflet/dist/leaflet.css"; // 确保样式也被引入
import axios from "axios"; // 确保导入 Axios

export default {
  mounted() {
    this.initMap();
  },
  data() {
    return {
      a: 1,
      b: 2,
      map: null,
      currentMarker: null, // 当前的靶心图标
      coordinates: null, // 存储经纬度
      geotiffLayer: null, // 初始化 geotiffLayer
    };
  },

  methods: {
    initMap() {
      console.log("Initializing map...");
      this.map = L.map("map").setView([28.58993, 121.55], 13);

      // 添加底图
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          id: "mapbox/satellite-v9",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoibHJoNzIyNDAwNiIsImEiOiJjbTBidm9iam0wYnl4MmpyMGpuMWRsc2UzIn0.5AtG-yTUdcLHbBW_1uJdzA",
        }
      ).addTo(this.map);
      L.tileLayer
        .wms("http://10.75.68.56:8080/geoserver/sccd/wms?", {
          layers: "sccd:next5",
          transparent: true,
          format: "image/png", // 确保使用支持透明的格式
        })
        .addTo(this.map);

      // 初始化弹窗
      this.popup = L.popup({
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
        draggable: true,
      });

      // 添加比例尺
      L.control
        .scale({ position: "topright", imperial: false })
        .addTo(this.map);

      // 添加点击事件
      this.map.on("click", this.onMapClick);

      // 更新经纬度
      this.map.on("mousemove", (e) => {
        this.coordinates = e.latlng;
      });
    },
    onMapClick(event) {
      const latlng = event.latlng;

      // 如果已有靶心图标，先移除
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      // 创建新的靶心图标
      const targetIcon = L.divIcon({
        className: "custom-icon",
        html: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="48" height="48">
            <path d="M511.1808 921.9072c-55.1936 0-108.7488-10.752-159.1296-32.1536-48.64-20.5824-92.3648-50.0736-129.9456-87.552s-66.9696-81.2032-87.552-129.9456C113.2544 621.8752 102.4 568.4224 102.4 513.2288c0-55.1936 10.8544-108.7488 32.1536-159.1296 20.5824-48.64 50.0736-92.3648 87.552-129.9456 37.5808-37.5808 81.2032-66.9696 129.9456-87.552C402.432 115.3024 455.9872 104.448 511.1808 104.448s108.7488 10.8544 159.1296 32.1536c48.64 20.5824 92.3648 50.0736 129.9456 87.552 37.5808 37.5808 66.9696 81.2032 87.552 129.9456 21.2992 50.3808 32.1536 103.936 32.1536 159.1296 0 87.9616-27.9552 172.1344-80.7936 243.2l-4.7104 6.3488-21.8112-28.4672 2.56-3.584c45.8752-64 70.0416-139.1616 70.0416-217.4976 0-206.336-167.8336-374.1696-374.1696-374.1696-206.336 0-374.1696 167.8336-374.1696 374.1696 0 206.336 167.8336 374.0672 374.1696 374.0672 68.4032 0 135.7824-19.0464 194.8672-55.1936l4.608-2.7648 21.2992 27.4432-5.632 3.4816c-64.9216 40.3456-139.264 61.6448-215.04 61.6448z" fill="#ffffff"></path>
            <path d="M718.7456 861.5936c-4.608 0-9.0112-1.8432-12.288-5.12-3.2768-3.2768-5.12-7.68-5.12-12.288s1.8432-9.0112 5.12-12.288c3.2768-3.2768 7.68-5.12 12.288-5.12s9.0112 1.8432 12.288 5.12c3.1744 3.1744 5.12 7.68 5.12 12.288s-1.8432 9.0112-5.12 12.288c-3.2768 3.2768-7.7824 5.12-12.288 5.12zM822.9888 766.2592c-4.7104 0-9.216-1.8432-12.5952-5.2224-3.2768-3.2768-5.2224-7.8848-5.2224-12.5952 0-4.7104 1.9456-9.216 5.2224-12.5952 3.2768-3.2768 7.8848-5.2224 12.5952-5.2224s9.216 1.9456 12.5952 5.2224c3.2768 3.2768 5.2224 7.8848 5.2224 12.5952s-1.9456 9.216-5.2224 12.5952c-3.2768 3.2768-7.8848 5.2224-12.5952 5.2224z" fill="#ffffff"></path>
            <path d="M511.1808 215.04c-8.4992 0-15.36-6.8608-15.36-15.36V46.08c0-8.4992 6.8608-15.36 15.36-15.36s15.36 6.8608 15.36 15.36v153.6c0 8.4992-6.9632 15.36-15.36 15.36zM511.1808 995.9424c-8.4992 0-15.36-6.8608-15.36-15.36v-153.6c0-8.4992 6.8608-15.36 15.36-15.36s15.36 6.8608 15.36 15.36v153.6c0 8.4992-6.9632 15.36-15.36 15.36zM198.656 528.5888H45.056c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h153.6c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36zM979.5584 528.5888h-153.6c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h153.6c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36z" fill="#ffffff"></path>
            <path d="M511.1808 513.2288m-71.4752 0a71.4752 71.4752 0 1 0 142.9504 0 71.4752 71.4752 0 1 0-142.9504 0Z" fill="#ffffff"></path>
          </svg>
        `,
        iconSize: [48, 48], // 图标大小
        iconAnchor: [24, 24], // 图标锚点
      });

      // 在点击位置添加靶心图标
      this.currentMarker = L.marker(latlng, { icon: targetIcon }).addTo(
        this.map
      );

      // 设置弹窗在靶心图标的正上方
      const popupOffset = L.popup()
        .setLatLng([latlng.lat + 0.005, latlng.lng]) // 将弹窗设置在靶心图标的正上方
        .setContent(
          `经度: ${latlng.lng.toFixed(6)}<br>纬度: ${latlng.lat.toFixed(6)}<br>
          confidence:<br>disturbance:<br>date:<br>conse:`
        )
        .openOn(this.map);

      // 调用获取属性的方法
      this.getFeatureInfo(latlng);
    },

    getFeatureInfo(latlng) {
      const url = this.getFeatureInfoUrl(latlng);
      console.log("Feature Info URL:", this.getFeatureInfoUrl(latlng));
      axios
        .get(url)
        .then((response) => {
          console.log("Response data:", response.data); // 调试输出
          const features = response.data.features || []; // 确保 features 是一个数组
          if (features.length > 0) {
            const properties = features[0].properties;
            this.showPopup(latlng, properties);
          } else {
            this.popup
              .setContent("未找到属性")
              .setLatLng(latlng)
              .openOn(this.map);
          }
        })
        .catch((error) => {
          console.error("Error fetching feature info:", error);
          this.popup.setContent("请求错误").setLatLng(latlng).openOn(this.map);
        });
    },

    getFeatureInfoUrl(latlng) {
      const size = this.map.getSize();
      const point = this.map.latLngToContainerPoint(latlng, this.map.getZoom());
      // 使用实际的边界框值
      const minX = 13463933.601782713;
      const minY = 3239162.111484953;
      const maxX = 13565259.320296235;
      const maxY = 3365860.069621959;

      const params = {
        request: "GetFeatureInfo", // 请求类型
        service: "WMS", // 服务类型
        version: "1.1.1", // WMS 版本
        srs: "EPSG:3857", // 使用与地图一致的 SRS
        layers: "sccd:next5", // 请求的图层
        query_layers: "sccd:next5", // 查询图层
        bbox: `${minX},${minY},${maxX},${maxY}`, // 确保这里使用实际值
        width: size.x, // 图像宽度
        height: size.y, // 图像高度
        format: "image/png", // 图像格式
        info_format: "application/json", // 返回的数据格式
        [this.map.getCenter().lat < 0 ? "i" : "x"]: point.x, // x 坐标
        [this.map.getCenter().lng < 0 ? "j" : "y"]: point.y, // y 坐标
      };

      return `http://10.75.68.56:8080/geoserver/sccd/wms?${L.Util.getParamString(
        params
      )}`;
    },

    showPopup(latlng, properties) {
      const content = `
        经度: ${latlng.lng.toFixed(6)}<br>
        纬度: ${latlng.lat.toFixed(6)}<br>
        conse: ${properties.conse_last || "N/A"}
        disturbance: ${properties.chg_agent || "N/A"}<br>
      `;
      this.popup.setLatLng(latlng).setContent(content).openOn(this.map);

      console.log(this.content);
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #000000;
  color: #e0e0e0;
  text-align: center;
}

#map {
  height: 87vh;
  width: 100%;
  border: 2px solid #444444;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  opacity: 1;
}

/* 当鼠标在地图上时，确保它是默认的指针形状 */
#map:hover {
  cursor: default;
}
/* 实时经纬度 */
.coordinates {
  margin: 10px 0;
  font-size: 1.2em;
  color: #00bfae;
}

h1,
h2 {
  margin: 10px 0;
  font-weight: normal;
}

h1 {
  font-size: 2.5em;
  color: #234d49;
}

h2 {
  font-size: 1.5em;
  color: #63686a;
}

.footer {
  position: fixed; /* 使用固定定位 */
  bottom: 3px; /* 距离底部的距离 */
  right: 3px; /* 距离右侧的距离 */
  font-size: 0.7em;
  color: #a0a0a0;
  text-align: right; /* 右对齐 */
  padding: 3px; /* 增加内边距 */
  background-color: rgba(255, 255, 255, 0.8); /* 背景色 */
  border-radius: 5px; /* 圆角效果 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* 阴影效果 */
}

.custom-popup {
  background-color: #8fdbdf;
  color: hwb(0 0% 100%);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 255, 174, 0.5);
  font-size: 14px;
  font-family: "Times New Roman", Times, serif;
}

.custom-popup h3 {
  margin: 0;
  padding: 0;
  color: #00bfae;
  font-size: 16px;
  border-bottom: 1px solid #00bfae;
  padding-bottom: 5px;
  margin-bottom: 5px;
}

.custom-popup p {
  margin: 5px 0;
  padding: 0;
}
</style>