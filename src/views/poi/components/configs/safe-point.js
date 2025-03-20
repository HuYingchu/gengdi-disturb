import colormaps from '../../../../components/utils/colormap'

const colormap = colormaps['57']
const visibility = 'visible'
const opacity = 1

//这是layer中paint的颜色需要用到的格式
function render1(colormap){
    return [
        'match',
        ['get','zh5_level'],//获取该图层的'zh5_level'属性
        1,colormap[0],
        2,colormap[2],
        3,colormap[4],
        /* other */ '#ccc'
    ]
}

function legendRender1(colormap){
    return{
        name:'江北区管控受污染耕地POI',//需要更改
        type:'point',
        info:[
            ['1-优先保护类', colormap[0]],
            ['2-安全利用类', colormap[2]],
            ['3-严格管控类', colormap[4]],
            ['其他', '#ccc']
        ]
    }
}

/**
 * 给不同的属性赋予不同的点形状
 * @returns 匹配属性
 */
function symbolRender(){
    return [
        'match',
        ['get','pointclass'],//获取该图层的属性
        1,'circle-icon',
        2,'triangle-icon',
        /* other */ 'circle-icon'
    ]
}

/**
 * 给图例提供信息
 * @returns 图例所需信息
 */
function legendRender2(){
    return{
        name:'江北区管控受污染耕地POI',//需要更改
        type:'point',
        info:[
            ['1-治理措施', 'point','#6495ED'],//类型、形状、颜色
            ['2-试验田块', 'triangle','#6495ED'],
        ]
    }
}

export default {
    name: 'jb_measure_info',
    aliasName: '江北区管控受污染耕地POI',
    topicName: '江北区安全利用保护成果',//图层管理器主标题
    type: 'vector',
    layers: [{
        aliasName: '江北区管控受污染耕地POI',
        hoverable: true,
        clickable: true,
        // opacityAttr: 'circle-opacity',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_measure_info@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'measure_info', //到时候替换成safepoint
            type: 'symbol',
            source: 'measure_info',//到时候替换成safepoint
            'source-layer': 'jb_measure_info',//到时候替换成jb_safepoint
            layout: {
                visibility: visibility,
                'icon-allow-overlap': true,
                'icon-image':symbolRender(),
                'icon-padding':0,
                'icon-size':0.25,
            },
            paint: {
                'icon-color':[
                    'case',
                    ['boolean',['feature-state','hover'],false],
                    'rgba(255,0,0,0.5)','#6495ED'
                ]
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'circle-color',
            render: render1
        },
        infoPanelConfig: {
            title: '江北区管控受污染耕地POI',
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
            render: legendRender2
        }
    }],
    controls: {
        showSettings: false,
        visibility: visibility,
        colormap: colormap,
        opacity: opacity
    }
}

