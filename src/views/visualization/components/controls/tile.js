import axios from 'axios'; // 确保引入 axios

// 经纬度转换为米
function latLonToMeters(lon, lat) {
    const originShift = 2 * Math.PI * 6378137 / 2.0;
    const mx = lon * originShift / 180.0;
    let my = Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI / 360.0))) * originShift / Math.PI;
    // 防止极限值溢出
    my = Math.max(-originShift, Math.min(my, originShift));
    return { mx, my };
}

// 米坐标转换为瓦片坐标
function metersToTile(mx, my, zoom) {
    const tileSize = 256;
    const initialResolution = 2 * Math.PI * 6378137 / tileSize;
    const resolution = initialResolution / Math.pow(2, zoom);

    const px = (mx + 2 * Math.PI * 6378137 / 2.0) / resolution;
    const py = (2 * Math.PI * 6378137 / 2.0 - my) / resolution;

    const tileX = Math.floor(px / tileSize);
    const tileY = Math.floor(py / tileSize);

    return {
        tileX,
        tileY,
        pixelCoords: {
            pixelX: Math.floor(px % tileSize),
            pixelY: Math.floor(py % tileSize)
        }
    };
}

// 计算瓦片和像素坐标
function calculateTileAndPixel(lon, lat, zoom) {
    const { mx, my } = latLonToMeters(lon, lat);
    return metersToTile(mx, my, zoom);
}

// 请求 GeoServer 数据
async function fetchGeoServerData(lngLat, tmap) {
    const zoom = Math.round(tmap.map.getZoom()) + 1; // 动态计算缩放级别
    console.log("当前缩放级别:", zoom);

    // 打印经纬度
    // console.log("经纬度:", { lng: lngLat.lng, lat: lngLat.lat });

    const { tileX, tileY, pixelCoords } = calculateTileAndPixel(lngLat.lng, lngLat.lat, zoom);
    // console.log("瓦片坐标:", { tileX, tileY });
    // console.log("像素坐标:", pixelCoords);

    // 构建请求 URL
    const disturbUrl = `http://10.75.68.56:8080/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=sccd:conse&STYLE=&TILEMATRIX=EPSG:900913:${zoom}&TILEMATRIXSET=EPSG:900913&SERVICE=WMTS&FORMAT=image/jpeg&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=${tileX}&TileRow=${tileY}&I=${pixelCoords.pixelX}&J=${pixelCoords.pixelY}`;
    const disproUrl = `http://10.75.68.56:8080/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=sccd:dispro&STYLE=&TILEMATRIX=EPSG:3857:${zoom}&TILEMATRIXSET=EPSG:3857&SERVICE=WMTS&FORMAT=image/jpeg&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=${tileX}&TileRow=${tileY}&I=${pixelCoords.pixelX}&J=${pixelCoords.pixelY}`;

    // console.log("干扰灰度请求 URL:", disturbUrl);
    // console.log("控制灰度请求 URL:", disproUrl);

    try {
        const [disturbResponse, disproResponse] = await Promise.all([
            axios.get(disturbUrl),
            axios.get(disproUrl)
        ]);

        const disturbGrayIndex = disturbResponse.data.features.length > 0 ? disturbResponse.data.features[0].properties.GRAY_INDEX : null;
        const disproGrayIndex = disproResponse.data.features.length > 0 ? disproResponse.data.features[0].properties.GRAY_INDEX : null;

        // console.log("干扰灰度索引:", disturbGrayIndex);
        // console.log("控制灰度索引:", disproGrayIndex);

        return {
            GRAY_DISTURB: disturbGrayIndex,
            GRAY_PRO: disproGrayIndex
        };
    } catch (error) {
        console.error("获取 GeoServer 数据时出错:", error);
        throw error; // 重新抛出错误以便于进一步处理
    }
}

// 导出 fetchGeoServerData 函数
export { fetchGeoServerData };
