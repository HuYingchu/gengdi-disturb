import colormaps from "@/components/utils/colormap";

const colormap = colormaps['14'];
const visibility = 'none';
const opacity = 1;

function render1(colormap) {
    return [
        'match',
        ['get', 'chg_agent'],
        '人为建设', colormap[0],
        '火灾', colormap[1],
        '胁迫', colormap[2],
        
        /* other */ '#ccc'
    ];
}

function legendRender1(colormap) {
    return {
        name: '地表异常事件类型',
        type: 'polygon',
        info: [
            ['人为建设', colormap[0]],
            ['火灾', colormap[1]],
            ['胁迫', colormap[2]],
            
        ]
    };
}

export default {
    name: 'next5',
    aliasName: '火灾、人为建设、胁迫',
    topicName: '地表异常变化类型',
    type: 'vector',
    layers: [
        {
            aliasName: 'next5',
            hoverable: true,
            clickable: true,
            opacityAttr: 'fill-opacity', 
            source: {
                type: 'vector',
                scheme: 'tms',
                tiles: [
                    'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Anext5@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                ],
                generateId: true
            },
            layer: {
                id: 'next5',
                type: 'fill', // 如果类型为 fill，那么使用 fill-color
                source: 'next5',
                'source-layer': 'next5',
                layout: {
                    visibility: visibility
                },
                paint: {
                    'fill-color': render1(colormap), // 使用填充颜色
                    'fill-opacity': opacity            // 填充透明度
                },
            },
            infoPanelConfig: {
                title: '特征属性',
                alias: {
                    'chg_agent': '地表异常类型',
                    'chg_date': '发生日期',
                    'conse_last': 'conse值'
                }
            },
            colormapConfig: {
                colormap: colormap,
                colormapAttr: 'fill-color',
                render: render1
            },
            legendConfig: {
                render: legendRender1
            }
        }
    ],
    controls: {
        showSettings: false,
        visibility: visibility,
        colormap: colormap,
        opacity: opacity
    }
};