// tileCalculator.js

function latLonToMeters(lon, lat) {
    const originShift = 2 * Math.PI * 6378137 / 2.0;
    const mx = lon * originShift / 180.0;
    let my = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
    my = my * originShift / 180.0;
    return { mx, my };
}

function metersToTile(mx, my, zoom) {
    const tileSize = 256;
    const initialResolution = 2 * Math.PI * 6378137 / tileSize;
    const resolution = initialResolution / Math.pow(2, zoom);

    const px = (mx + 2 * Math.PI * 6378137 / 2.0) / resolution;
    const py = (2 * Math.PI * 6378137 / 2.0 - my) / resolution;

    const tileX = Math.floor(px / tileSize);
    const tileY = Math.floor(py / tileSize);

    return { tileX, tileY, pixelX: px % tileSize, pixelY: py % tileSize };
}

function calculateTileAndPixel(lon, lat, zoom) {
    const { mx, my } = latLonToMeters(lon, lat);
    const { tileX, tileY, pixelX, pixelY } = metersToTile(mx, my, zoom);

    return {
        tileX,
        tileY,
        pixelCoords: {
            pixelX: Math.floor(pixelX),
            pixelY: Math.floor(pixelY)
        }
    };
}

// 导出计算函数
export { calculateTileAndPixel };