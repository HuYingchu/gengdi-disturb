import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['100']
const visibility = 'visible'
const opacity = 1

function render1(colormap) {
    return [
        'match',
        ['get', 'zh5_level'],
        "1", colormap[0],
        "2", colormap[1],
        "3", colormap[2],
        /* other */ '#ccc'
    ]
}

function legendRender1(colormap) {
    return {
        name: '江北区详查点位',
        type: 'point',
        info: [
            ['1-优先保护类', colormap[0]],
            ['2-安全利用类', colormap[1]],
            ['3-严格管控类', colormap[2]],
            ['其他', '#ccc']
        ]
    }
}

export default {
    name: 'jb_measure_info',
    aliasName: '江北区详查点位',
    topicName: '江北区类别划分成果',
    type: 'vector',
    layers: [{
        aliasName: '江北区详查点位边界',
        hoverable: true,
        clickable: true,
        opacityAttr: 'circle-opacity',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://120.27.157.10:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soilpoint@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soilpoint@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soilpoint@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_measure_info@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'measure_info', //到时候替换成safepoint
            type: 'circle',
            source: 'measure_info',//到时候替换成safepoint
            'source-layer': 'jb_measure_info',//到时候替换成jb_safepoint
            layout: {
                visibility: visibility
            },
            paint: {
                'circle-radius': 8,
                'circle-stroke-color': '#69dcff',
                'circle-stroke-width': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    2, 0
                ],
                'circle-color': render1(colormap),
                'circle-opacity': opacity
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'circle-color',
            render: render1
        },
        infoPanelConfig: {
            title: '江北区详查点位',
            alias: {
                "longitude": "经度",
                "latitude": "纬度",
                "farmer_name": "农户名称",
                "farmer_telephone": "农户电话",
                'town': '乡镇',
                'address': '地址',
                'usage_per_mu': '每亩用量',
                'dispatch_quantity': '配送数量',
                'zh5_level': '综合五项指标等级',
                'point_class':'措施类型',
                'remark': '备注',
 
            },
            img_alias: {
                "picture_name":"图片名称"
            }
        },
        legendConfig: {
            render: legendRender1
        }
    }],
    controls: {
        showSettings: false,
        visibility: visibility,
        colormap: colormap,
        opacity: opacity
    }
}