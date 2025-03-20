import axios from 'axios';

// GeoServer配置
const GEOSERVER_CONFIG = {
    URL: "http://10.75.68.56:8080/geoserver",
    WORKSPACE: "sccd",
    STYLE_NAME: "doy",
    LAYER_NAME: "date_touying",
    USERNAME: "admin",
    PASSWORD: "geoserver"
};

/**
 * 生成SLD样式内容
 * @param {number} startDays - 开始日期的总天数
 * @param {number} endDays - 结束日期的总天数
 * @returns {string} - SLD样式XML字符串
 */
function generateSldContent(startDays, endDays) {
    return `<?xml version="1.0" encoding="UTF-8"?> 
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.opengis.net/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>default_raster</Name>
    <UserStyle>
      <Title>DOY Range Style</Title>
      <Abstract>Style that shows pixels within DOY range in orange and others as transparent</Abstract>
      <FeatureTypeStyle>
        <Rule>
          <Name>rule1</Name>
          <Title>DOY Range Visualization</Title>
          <Abstract>Show values within range as orange, others as transparent</Abstract>
          <RasterSymbolizer>
            <Opacity>1.0</Opacity>
            <ColorMap type="intervals">
              <ColorMapEntry color="#000000" opacity="0.0" quantity="${startDays - 1}" label="below"/>
              <ColorMapEntry color="#FFA500" opacity="1.0" quantity="${startDays}" label="start"/>
              <ColorMapEntry color="#FFA500" opacity="1.0" quantity="${endDays}" label="end"/>
              <ColorMapEntry color="#000000" opacity="0.0" quantity="${endDays + 1}" label="above"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

/**
 * 上传SLD样式到GeoServer
 * @param {string} sldContent - SLD样式内容
 */
async function uploadSld(sldContent) {
    const styleUrl = `${GEOSERVER_CONFIG.URL}/rest/workspaces/${GEOSERVER_CONFIG.WORKSPACE}/styles`;
    const headers = { "Content-Type": "application/vnd.ogc.sld+xml" };
    const auth = {
        username: GEOSERVER_CONFIG.USERNAME,
        password: GEOSERVER_CONFIG.PASSWORD
    };

    try {
        // 检查样式是否存在
        const checkUrl = `${styleUrl}/${GEOSERVER_CONFIG.STYLE_NAME}.sld`;
        const checkResponse = await axios.get(checkUrl, { auth });

        // 样式已存在，执行更新
        console.log("Style exists, updating...");
        await axios.put(
            `${styleUrl}/${GEOSERVER_CONFIG.STYLE_NAME}`,
            sldContent,
            { auth, headers }
        );
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // 样式不存在，执行创建
            console.log("Style does not exist, creating...");
            await axios.post(
                styleUrl,
                sldContent,
                {
                    auth,
                    headers,
                    params: { name: GEOSERVER_CONFIG.STYLE_NAME }
                }
            );
        } else {
            console.error("Failed to upload/update SLD:", 
                error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

/**
 * 将样式应用到图层
 */
async function applyStyleToLayer() {
    const layerUrl = `${GEOSERVER_CONFIG.URL}/rest/layers/${GEOSERVER_CONFIG.WORKSPACE}:${GEOSERVER_CONFIG.LAYER_NAME}`;
    const headers = { "Content-Type": "application/json" };
    const data = {
        layer: {
            defaultStyle: {
                name: GEOSERVER_CONFIG.STYLE_NAME
            }
        }
    };

    try {
        await axios.put(layerUrl, data, {
            auth: {
                username: GEOSERVER_CONFIG.USERNAME,
                password: GEOSERVER_CONFIG.PASSWORD
            },
            headers
        });
        console.log("Style applied to layer successfully.");
    } catch (error) {
        console.error("Failed to apply style to layer:", 
            error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * 计算从公元1年开始的总天数
 * @param {string} dateStr - ISO格式的日期字符串 (YYYY-MM-DD)
 * @returns {number} - 从公元1年1月1日开始的总天数
 */
export function calculateTotalDays(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 计算从1年到当前年初的天数
    let days = (year - 1) * 365;
    
    // 加上闰年的天数
    days += Math.floor((year - 1) / 4);
    days -= Math.floor((year - 1) / 100);
    days += Math.floor((year - 1) / 400);

    // 当前年份中每个月的天数
    const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // 如果是闰年，2月有29天
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        monthDays[2] = 29;
    }

    // 加上当前年份已经过去的月份的天数
    for (let i = 1; i < month; i++) {
        days += monthDays[i];
    }

    // 加上当月的天数
    days += day;

    return days;
}

/**
 * 处理日期变化，更新样式并应用到图层
 * @param {Object} dates - 包含起始日和截止日的对象
 */
export async function handleDateChange(dates) {
    const startDays = calculateTotalDays(dates.起始日);
    const endDays = calculateTotalDays(dates.截止日);
    
    console.log('从公元1年开始的天数:', {
        起始天数: startDays,
        截止天数: endDays
    });

    try {
        // 生成新的SLD样式
        const sldContent = generateSldContent(startDays, endDays);
        
        // 上传样式并应用到图层
        await uploadSld(sldContent);
        await applyStyleToLayer();
        
        console.log('样式更新成功');
    } catch (error) {
        console.error('更新样式失败:', error);
    }
    
    return { startDays, endDays };
}