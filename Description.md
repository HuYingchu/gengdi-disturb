# contamination-sites-manage-vis-system

-   系统包括
    -   全局地图TMap
        -   TMap:
            -   属性：
                -   map：地图
                -   mapView：视图
                -   modules：加载的模块
                -   layers：当前存在的图层
                -   curLayer：当前数据指向的图层，负责与图表控制器进行联动
    -   全局组件：
        -   基本地图模块组件
            -   地图基本交互组件
                -   BasemapGallery
                -   BasemapToggle
                -   Zoom
                -   Compass
                -   Attribution
    -   四大模块
        -   数据空间展示模块组件
            -   数据组件库：
                -   每类数据一个图层，为数据图层组件
                    -   数据分为点数据、线数据、面数据、栅格数据四种，因此包含四类图层组件
                    
                        >   [A] 表示系统定义内容，[U] 表示用户可选内容
                    
                        -   点数据图层：一个点数据图层可包含多个数据层，比如：学校数据图层可以包括市统计图层，区县统计图层和具体学校点位图层三个图层，他们的 layerName 相同。
                    
                            -   一个点数据图层包含以下几部分：
                    
                                -   地图
                                    -   点
                                        -   位置 [A]
                                        -   大小 [U]
                                        -   颜色 [U]
                                        -   信息板 [A]
                                -   统计表 [A]
                                -   统计图 [A]
                                -   图例 [A]
                    
                            -   创建一个点数据图层所需要的数据
                    
                                ```json
                                {
                                  "layerName": "PotentialComtamSitesLayer",    // 当前图层名称
                                  "topicName": "潜在污染场地",                   // 当前专题
                                  "mapConfig": {
                                    "layersConfig": {                          // 该数据图层所包含的子图层
                                      "cityLayer": {
                                        "url": "/api/potential-contam-sites-layer/city-data-flat.geojson",
                                        "renderer": { 
                                          // ...
                                        },
                                        "minScale": 0,
                                        "maxScale": 2000000
                                      }
                                    },
                                //    "colormap": colormap['1'],
                                    "infoPanelConfig": {
                                      "alias": {
                                        "province": "省",
                                        "city": "市",
                                        "lon": "经度",
                                        "lat": "纬度",
                                        "count": "潜在污染场地数量"
                                      }
                                    }
                                  },
                                  "chartConfig": {
                                    "url": "/api/potential-contam-sites-layer/prov-data-flat.geojson",
                                    "fields": {
                                      "name": "行政区",
                                      "count": "数量",
                                      "pollutionTypeCount_水": "水",
                                      "pollutionTypeCount_大气": "大气",
                                      "pollutionTypeCount_土壤": "土壤"
                                    }
                                  },
                                  "graphConfig": {
                                    "title": "不同潜在污染场地类型占比",
                                    "fields": {
                                      "pollutionTypeCount_水": "水",
                                      "pollutionTypeCount_大气": "大气",
                                      "pollutionTypeCount_土壤": "土壤"
                                    },
                                    "colormap": colormap['6']
                                  },
                                  "legendConfig": {
                                    "title": "潜在污染场地数量",
                                    "legendData": [
                                      { color: this.mapGraphicColors[0], size: 13, label: '水' },
                                      { color: this.mapGraphicColors[1], size: 13, label: '大气' },
                                      { color: this.mapGraphicColors[2], size: 13, label: '土壤' },
                                      { color: this.mapGraphicColors[3], size: 13, label: '水 大气' },
                                      { color: this.mapGraphicColors[4], size: 13, label: '大气 土壤' },
                                      { color: this.mapGraphicColors[3], size: 13, label: '水 土壤' },
                                      { color: this.mapGraphicColors[2], size: 13, label: '水 大气 土壤' },
                                      { color: this.mapGraphicColors[1], size: 13, label: '无' },
                                    ]
                                  }
                                }
                                ```
                    
                                
                    
                -   学校：天地图
                -   社会经济数据：GDP，栅格
                -   潜在污染场地：全国，按省进行计算（表）
                -   全国土地利用数据：栅格
            -   图层管理组件，负责管理TMap的layers
                -   用NormalWindow包装
                -   用el-collapse作为一级内容
                -   用vuedraggable作为二级内容
                -   添加图层顺序的容器，里面按照按图层顺序放置el-tag
            -   图表控制组件，负责控制TMap当前的图层curLayer，并渲染图表。
        -   热区探测分析模块组件
        -   污染风险评估模块组件
        -   场地演变预测模块组件





-   原则应该是数据驱动，即所有的组件并不是相互耦合、相互依赖的，而是它们都依赖于数据（接口）。因为组件相互依赖的话，即纯粹面向对象编程，对象相互依赖，其耦合度会很高，那么其扩展性、可维护性就会非常差，而如果他们都依赖于数据（接口），即面向接口编程，就可以实现组件之间的解耦，使得组件具有较好的扩展性和可维护性。
-   数据包括数据本身（geojson）和配置数据（关于数据展示的一些配置信息）。
-   对于数据空间展示模块，总组件是`Visualization.vue`。该组件主要管理该模块内的各类全局信息，这些信息可以在该模块内进行共享，这些信息包括所有图层的数据及其配置信息（可以从配置文件读取）。内部有两类子组件，一类是数据图层组件，另一类是控制组件，包括图层管理器、统计表、统计图组件。
    -   对于数据图层组件，数据组件通过读取数据本身和它的配置数据，来将数据按照相关配置放置在地图上，并注册一些事件。
    -   对于控制组件：
        -   图层管理器是用来控制图层的显示隐藏、图层的排列次序、图层的样式的等信息。因此，该组件依赖的是数据的配置数据。
            -   显示和隐藏会修改对应图层数据的显示和隐藏配置
            -   图层的排列次序会修改对应图层的排列索引配置
            -   图层的样式主要是图层的colormap，控制的是图层的colormap配置
        -   统计表组件可以显示当前显示的图层的统计表信息。因此，该组件依赖每个图层数据的显示隐藏配置数据和该图层的统计表配置数据。
        -   统计图组件可以显示当前点位的统计图信息。因此，该组件依赖的是图层的当前点位数据和该图层的统计图配置数据。
-   重构步骤：
    -   首先定义好某一图层的数据及其配置信息的格式，并做一个示例，放入js中
        -   可以根据不同组件需要什么数据及配置数据来写这个js
    -   在`Visualization.vue`组件中引入该图层数据及其配置信息
    -   图层管理器、统计表组件、统计图组件读取图层数据及其配置信息来得到应有的内容
    -   数据图层组件通过读取该图层数据及其配置信息来将数据放置在地图上，并按照配置信息配置一些事件
    -   

