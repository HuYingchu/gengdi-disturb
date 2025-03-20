<template>
    <div id="manage-module">
        <div class="query-wrapper">
            <div class="query-item-wrapper">
                <span class="query-label">耕地编码：</span>
                <el-input class="query-input" v-model="queryParams['arable_code']" placeholder="根据耕地编码查询"></el-input>
            </div>
            <div class="query-item-wrapper">
                <span class="query-label">乡镇/街道：</span>
                <el-select class="query-select" clearable v-model="queryParams['town']" placeholder="请选择">
                    <el-option
                        v-for="item in categoryOptions['town']"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="query-item-wrapper">
                <span class="query-label">行政村：</span>
                <el-select class="query-select" clearable v-model="queryParams['village']" placeholder="请选择">
                    <el-option
                        v-for="item in categoryOptions['village']"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="query-item-wrapper">
                <span class="query-label">影像时间：</span>
                <el-select class="query-select" clearable v-model="queryParams['image_date']" placeholder="请选择">
                    <el-option
                        v-for="item, key in categoryOptions['image_date']"
                        :key="key"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="query-item-wrapper">
                <span class="query-label">耕地质量类别：</span>
                <el-select class="query-select" clearable v-model="queryParams['quality_type']" placeholder="请选择">
                    <el-option
                        v-for="item, key in categoryOptions['quality_type']"
                        :key="key"
                        :label="item"
                        :value="key">
                    </el-option>
                </el-select>
            </div>
            <div class="query-submit">
                <el-button type="primary" @click="initPage() && queryData(queryParams)">查询</el-button>
                <el-button type="primary" @click="resetQueryParams">重置</el-button>
            </div>
            <div class="query-submit">
                <el-button type="primary" @click="upLoadPanelVisable = true">上传影像</el-button>
                <el-button type="primary" @click="downLoadPDF(queryParams)">生成报告</el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table
                class="table"
                :data="chartData"
                style="width: 100%; background-color: var(--selector-bg-color)"
                max-height="650px"
                size="medium"
                stripe
                border
                :cell-style="{'color': 'var(--content-color)'}"
                :header-cell-style="{'background-color': 'transparent'}">
                <el-table-column
                    type="index"
                    :index="indexMethod"
                    width="60"
                    align="center">
                </el-table-column>
                <el-table-column
                    sortable
                    v-for="(field, key) in chartFields"
                    :key="key"
                    :prop="key"
                    :label="field">
                </el-table-column>
                <el-table-column
                    label="详情"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="queryDetail(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="currentPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItemsNum">
            </el-pagination>
        </div>
        <normal-footer></normal-footer>
        <el-dialog
            class="upLoadPanel"
            title="影像上传"
            :visible.sync="upLoadPanelVisable"
            width="400px"
            :before-close="handleUpLoadPanelClose">
            <div class="datePicker" style="margin-bottom:10px">
                <el-date-picker
                    v-model="upLoadImageDate"
                    type="date"
                    placeholder="选择日期"
                    style="width:360px">
                </el-date-picker>
            </div>
            <div class="fileUpLoad">
                <el-upload
                    class="upload"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileLists"
                    :auto-upload="false"
                    style="margin:auto">
                    <el-button slot="trigger" type="primary" style="width:360px">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">上传研究区经过预处理的Sentinel-2影像</div>
                </el-upload>                
            </div>        
            <span slot="footer" class="dialog-footer">
                <el-button class="center" type="primary" @click="submitUpload()" style="width:360px">上传到服务器<i class="el-icon-upload el-icon--right"></i></el-button>
            </span>
        </el-dialog>
        <div class="detail-wrapper" id="detail-wrapper"
             :style="{
                'visibility': detailWindowVisible,
                'opacity': detailWindowOpacity
             }"
             @click="closeDetailWindow">
        </div>
        <div class="detail-window" id="detail-window"
             :style="{
                'visibility': detailWindowVisible,
                'opacity': detailWindowOpacity
             }">
            <span class="section-title">
                耕地信息详情
            </span>
            <span class="el-icon-close detail-window-close-btn"
                @click="closeDetailWindow">
            </span>
            <detail-view :detail-data="detailData"></detail-view>
        </div>

    </div>
</template>

<script>
import vuescroll from 'vuescroll'
import axios from 'axios'
import NormalFooter from '@/components/window/NormalFooter'
import DetailView from "./components/DetailView"

export default {
    name: "Manage",
    components: {
        NormalFooter,
        vuescroll,
        DetailView
    },
    data() {
        return {
            chartData: [],
            chartFields: {
                'farmlandCode': '耕地编码',
                'townShipMat': '乡镇/街道',
                'village': '行政村',
                'fiveIndicators': '耕地质量类别',
                'imageDate': '影像时间',
                'isRice': '判别结果'
            },
            queryParams: {},
            categoryOptions: {},
            detailData: {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {
                        "dlmc": "水田",
                        "qsdwmc": "北门村",
                        "nydtbmj": 8524.05,
                        "dllb": "耕地",
                        "centerx": 121.452174977,
                        "centery": 29.991132930399999,
                        "cd_level": 1.0,
                        "hg_level": 2.0,
                        "as_level": 1.0,
                        "cr_level": 1.0,
                        "cu_level": 1.0,
                        "zn_level": 1.0,
                        "ni_level": 1.0,
                        "bap_level": 1.0,
                        "zh5_level": 2.0,
                        "zh3_level": 1.0,
                        "zh8_level": 2.0,
                        "zh9_level": 2.0,
                        "pb_level": 1.0,
                        "gdbm": "330205285245219113",
                        "lbbm": "330205000741Ⅱ",
                        "zh5temp": "Ⅱ",
                        "nzwlx": "非农用地",
                        "sffny": "否",
                        "BZ": "主要种植梨树",
                        "乡镇_mat": "慈城镇",
                        "dlwz": "经度（121.45162980736973-121.4528007129826），纬度（29.99064807005243-29.991612741335018）",
                        "mbwrw": "汞",
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ [ [ 121.452800712982594, 29.99139016092721 ], [ 121.452627556616562, 29.99064807005243 ], [ 121.451641968901754, 29.990836575147853 ], [ 121.451635286938995, 29.991007083909835 ], [ 121.45163047196877, 29.99133791301432 ], [ 121.451629807369727, 29.991612741335018 ], [ 121.452781721998917, 29.991393974052698 ], [ 121.452800712982594, 29.99139016092721 ] ] ]
                    }
                }
            },
            detailWindowVisible: 'hidden',
            detailWindowOpacity: 0,
            currentPage: 1,
            currentPageSize: 20,
            totalItemsNum: 2000,
            upLoadPanelVisable: false,
            upLoadImageDate: '',
            fileLists: []
        }
    },
    mounted() {
        const _this = this
        _this.resetQueryParams()
        _this.queryCategoryOptions()
        _this.queryData()
    },
    methods: {
        queryCategoryOptions() {
            this.categoryOptions = {
                'town': ['慈城镇', '洪塘街道', '庄桥街道', '江北区所辖街道'],
                'village': ['北门村', '国庆村', '妙山村', '三联村', '鞍山村', '居陆村', '双顶山村', '灵山村', '新华村',
                    '龚冯村', '南门村', '塘民村', '东门村', '胡家村', '浦丰村', '湖心村', '勤丰村', '八字村',
                    '五星村', '向上村', '民丰村', '上岙村', '东山村', '东镇村', '黄山村', '荪湖村', '观庄村',
                    '费市村', '山西村', '慈城镇区', '联群村', '新联村', '白米湾村', '赵家村', '后张村', '山东村',
                    '邵余村', '上沈村', '苏冯村', '杨陈村', '后洋村', '童家村', '上邵村', '姚家村', '应家村',
                    '外漕村', '畈里塘村', '西卫桥村', '周陈村', '洪塘村', '虹星村', '横山村', '农牧场', '东邵村',
                    '孔家村', '马径村', '前洋村', '方界村', '洪家村', '林家村', '葛家村', '西邵村', '半浦村',
                    '压赛村', '夏家村', '孔浦村', '河西村', '前后潘村', '郎家村', '朱界村', '西洪村', '邵家渡村',
                    '旧宅村', '洋市村', '下沈村', '骆兴村', '金沙村', '公有村', '南联村', '英雄水库', '五联村',
                    '五湖村', '毛岙村', '慈湖村', '毛力村', '王家坝村', '三勤村', '洪陈村', '裘市村', '叶家斗村',
                    '小郎家村', '旧宅徐村', '西江村', '谢家村', '冯家村', '后姜村', '李家村', '河东村', '荪湖水库',
                    '上宅村', '颜家村', '姚江村', '孙家村', '宁波师范学院', '永红村', '联成村', '荐江村', '包家村',
                    '双桥村', '长石村', '尚志村', '曙光村'],
                'quality_type': {
                    '1': '1-优先保护类',
                    '2': '2-安全利用类',
                    '3': '3-严格管控类'
                },
                'image_date': ['2019-06-15', '2021-08-08']
            }
        },
        initPage() {
            const _this = this
            _this.currentPage = 1
            return true
        },
        queryData(params) {
            const _this = this
            // 组合 url 和查询参数
            const baseUrl = "/api/riceMonitor/query_items"
            const queryParam = {
                'page_size': _this.currentPageSize,
                'page_num': _this.currentPage,
                ...params
            }
            const queryUrl = _this._concatUrlParams(baseUrl, queryParam)
            // 获取数据
            axios.get(queryUrl).then((res) => {
                const resData = res.data
                // console.log(resData)
                if (0 === resData.status
                    && resData.hasOwnProperty('data')
                    && resData.data.hasOwnProperty('list')) {
                    // 获取数据成功
                    resData.data.list.forEach((value, index) => {
                        if (value["mean"] >= 127.5) {
                            value["isRice"] = "疑似种植"
                        } else {
                            value["isRice"] = "未种植"
                        }
                    })
                    _this.chartData = resData.data.list
                    _this.totalItemsNum = resData.data.total
                    // console.log("chartData", _this.chartData)
                } else {
                    _this.chartData = []
                    _this.totalItemsNum = 0
                    _this.$message({
                        message: '数据为空',
                        type: 'warning'
                    })
                }
            }, (err) => {
                _this.$message({
                    message: '获取数据失败，请检查网络后重试',
                    type: 'error'
                })
                console.log(err)
            })
        },
        resetQueryParams() {
            this.queryParams = {
                'arable_code': '',
                'town': '',
                'village': '',
                'quality_type': '',
                'image_date': ''
            }
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.queryData(this.queryParams)
            this.moveToTableTop()
        },
        handleSizeChange(currentPageSize) {
            this.currentPageSize = currentPageSize
            this.queryData(this.queryParams)
            this.moveToTableTop()
        },
        moveToTableTop() {
            let overflowY = this.$el.getElementsByClassName("el-table__body-wrapper")[0]
            if (!overflowY) {
                return
            }
            overflowY.scrollTop = 0
        },
        queryDetail(row) {
            // 显示详细信息窗口
            this.detailWindowVisible = 'visible'
            this.detailWindowOpacity = 1

            const _this = this
            // const baseUrl = "@/../static/fakeQueryDetailData.json"
            const baseUrl = "/api/riceMonitor/query_detail"
            const queryParam = {
                'arable_code': row['farmlandCode'],
                'image_date': row['imageDate']
            }
            const queryUrl = _this._concatUrlParams(baseUrl, queryParam)
            // 获取数据
            axios.get(queryUrl).then((res) => {
                const resData = res.data
                if (0 === resData.status
                    && resData.hasOwnProperty('data')) {
                    // 获取数据成功
                    console.log(resData)
                    const detailData = {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: JSON.parse(resData.data.data.geometry.value),   // BUG is here
                            properties: JSON.parse(resData.data.data.properties.value)
                        }
                    }
                    detailData.data.geometry.type = "Polygon"
                    detailData.data.geometry.coordinates = detailData.data.geometry.coordinates[0]
                    // detailData.data.geometry.crs = null
                    delete detailData.data.geometry.crs
                    _this.detailData = detailData
                    console.log("detail data", _this.detailData)
                } else {
                    _this.$message({
                        message: '获取数据失败，请检查网络后重试',
                        type: 'error'
                    })
                    _this.detailData = []
                }
            }, (err) => {
                _this.$message({
                    message: '获取数据失败，请检查网络后重试',
                    type: 'error'
                })
                console.log(err)
            })
        },
        closeDetailWindow() {
            // 关闭详细信息窗口
            this.detailWindowVisible = 'hidden'
            this.detailWindowOpacity = 0
        },
        indexMethod(index) {
            const _this = this
            return (index + 1) + (_this.currentPage - 1) * _this.currentPageSize
        },
        _concatUrlParams(baseUrl, queryParam) {
            let queryUrl = baseUrl + '?'
            for (let key in queryParam) {
                queryUrl += `${key}=${queryParam[key]}&`
            }
            return queryUrl.slice(0, -1)
        },
        handleUpLoadPanelClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        submitUpload() {
            this.upLoadPanelVisable = false;
        },
        downLoadPDF(params){
            const baseUrl = "/api/riceMonitor/download"
            const queryUrl = this._concatUrlParams(baseUrl, params)
            console.log("url:{}", queryUrl)
            var a = document.createElement("a"); //创建一个<a></a>标签
            a.href = queryUrl;
            //给a标签的href属性值加上地址，注意，这里是绝对路径，不用加点. 
            a.download ="疑似违种报告.pdf";
            //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
            a.style.display = "none"; // 障眼法藏起来a标签 
            document.body.appendChild(a);
            // 将a标签追加到文档对象中 
            a.click(); //模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
            a.remove();
            // 一次性的，用完就删除a标签 
        },
    }
}
</script>

<style scoped lang="stylus">
#manage-module
    width 100%
    height 100%
    background-color #f0f2f5
    position relative
    overflow scroll
    .query-wrapper
        width 95%
        //height 100px
        margin 10px auto 0
        padding-bottom 5px
        background-color #fff
        box-shadow 0 2px 5px #ddd
        border-bottom 1px solid #eee
        .query-item-wrapper
            display inline-block
            margin 5px 0
            .query-label
                font-size 15px
                padding 0 10px
            .query-input
            .query-select
                width 150px
        .query-submit
            display inline-block
            margin 5px 30px
    .table-wrapper
        width 95%
        height 85%
        margin 0px auto 20px
        //border 1px solid red
        position relative
        .table
            border-radius 4px
            box-shadow 0 2px 5px #ddd
        .pagination
            margin 20px 20px
            position absolute
            right 0
    .detail-wrapper
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        background-color rgba(0,0,0,0.1)
        z-index 100
        transition .2s all ease-in-out
    .detail-window
        width 600px
        height 500px
        background-color #fff
        position absolute
        left 50%
        top 100px
        margin-left -300px
        z-index 101
        transition .2s all ease-in-out
        box-shadow 0 2px 15px #ccc
        overflow-y scroll
        padding 10px
        border-radius 4px
        .section-title
            width 95%
            //font-weight bold
            font-size 20px
            line-height 36px
            color #555
            padding 0px 15px 10px
        .detail-window-close-btn
            position absolute
            right 5px
            top 2px
            margin 10px
            width 25px
            height 25px
            line-height 25px
            text-align center
            background-color: #eee
            border-radius 50%
            color #aaa
            cursor pointer
            transition .2s all ease-in-out
        .detail-window-close-btn:hover
            background-color: #aee3df
            color #fff
    .upLoadPanel
        display: flex;
        align-items: center;
    .dialog-footer
        display: flex;
        align-items: center;

</style>