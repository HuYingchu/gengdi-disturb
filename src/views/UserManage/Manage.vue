<template>
    <div id="manage-module">
        <div class="query-wrapper">
            <div class="query-submit">
                <el-button type="info" plain icon="el-icon-circle-plus-outline" style="width:140px;font-size:16px">添加</el-button>
                <el-button type="info" plain icon="el-icon-circle-check" style="width:140px;font-size:16px">启用</el-button>
                <el-button type="info" plain icon="el-icon-circle-close" style="width:140px;font-size:16px">禁用</el-button>
                <el-button type="info" plain icon="el-icon-delete" style="width:140px;font-size:16px">删除</el-button>
            </div>
            <div class="query-item-wrapper">
                <el-input class="query-input" placeholder="输入用户名查询" >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
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
                    type="selection"
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
                    prop="permission"
                    label="权限信息"
                    width="700">
                    <template slot-scope="scope">
                        <el-tag
                            class="permission-tag"
                            v-for="tag in scope.row.permission"
                            :key="tag.name">
                            {{tag.name}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作选项"
                    width="200">
                    <template slot-scope="scope">
                        <el-button @click="queryDetail(scope.row.username)" type="text" size="small">操作记录</el-button>
                        <el-button  type="text" size="small">编辑</el-button>
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
                用户操作记录
            </span>
            <span class="el-icon-close detail-window-close-btn"
                @click="closeDetailWindow">
            </span>
            <operation-record :detail-data="detailData"></operation-record>
        </div>
    </div>
</template>

<script>
import vuescroll from 'vuescroll'
import axios from 'axios'
import NormalFooter from '@/components/window/NormalFooter'
import OperationRecord from "./components/OperationRecord"

export default {
    name: "Manage",
    components: {
        NormalFooter,
        vuescroll,
        OperationRecord
    },
    data() {
        return {
            chartData: [],
            chartFields: {
                'username': '用户名',
                'role': '用户角色',
                'status': '账号状态',
                'createDate': '注册时间'
            },
            queryParams: {},
            categoryOptions: {},
            detailData: [
                    {   
                        "username":"admin",
                        "operationTime":"2020-10-10 10:10:10",
                        "operationType":"查询",
                        "operation":"admin在2020-10-10 10:10:10对农用地污染数据管理模块的jb_classify表进行了查询操作"
                        },
                    {
                        "username":"admin",
                        "operationTime":"2020-10-10 10:10:10",
                        "operationType":"查询",
                        "operation":"admin在2020-10-10 10:10:10对农用地污染数据管理模块的jb_classify表进行了查询操作"
                        }
                ],
            detailWindowVisible: 'hidden',
            detailWindowOpacity: 0,
            currentPage: 1,
            currentPageSize: 20,
            totalItemsNum: 2000,
            upLoadPanelVisable: false,
            upLoadImageDate: ''
        }
    },
    mounted() {
        const _this = this
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
        queryData() {
            const _this = this
            // 组合 url 和查询参数
            const baseUrl = "/api/user/query"
            const queryParam = {}
            const queryUrl = _this._concatUrlParams(baseUrl, queryParam)
            // 获取数据
            axios.get(queryUrl).then((res) => {
                const resData = res.data
                console.log(resData)
                if (0 === resData.status) {
                    // 获取数据成功
                    // resData.data.for()
                    resData.data.forEach((value, index) => {
                        if (value["role"] === "普通用户") {
                            value["permission"] = [{"name":"农用地污染数据查看"},{"name":"农用地安全利用数据查看"},{"name":"耕地遥感监测数据查看"}]
                        } else if (value["role"] === "管理员") {
                            value["permission"] = [{"name":"查看农用地污染数据"},{"name":"新增农用地污染数据"},{"name":"查看农用地安全利用数据"},{"name":"查看耕地遥感监测数据"},{"name":"新增遥感影像"},{"name":"新增用户"},{"name":"激活用户"},{"name":"禁用用户"}]
                        } else if (value["role"] === "超级管理员") {
                            value["permission"] = [{"name":"查看农用地污染数据"},{"name":"新增农用地污染数据"},{"name":"查看农用地安全利用数据"},{"name":"查看耕地遥感监测数据"},{"name":"新增遥感影像"},{"name":"新增用户"},{"name":"激活用户"},{"name":"禁用用户"},{"name":"删除用户"},{"name":"编辑用户"},{"name":"查看用户操作记录"}]
                        }
                    })
                    _this.chartData = resData.data
                    _this.totalItemsNum = _this.chartData.length
                    console.log("chartData", _this.chartData)
                    // console.log("chartData", _this.chartData['permission'])
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
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.queryData()
            this.moveToTableTop()
        },
        handleSizeChange(currentPageSize) {
            this.currentPageSize = currentPageSize
            this.queryData()
            this.moveToTableTop()
        },
        moveToTableTop() {
            let overflowY = this.$el.getElementsByClassName("el-table__body-wrapper")[0]
            if (!overflowY) {
                return
            }
            overflowY.scrollTop = 0
        },
        queryDetail(username) {
            // 显示详细信息窗口
            this.detailWindowVisible = 'visible'
            this.detailWindowOpacity = 1

            const _this = this
            // const baseUrl = "@/../static/fakeQueryDetailData.json"
            const baseUrl = "/api/userRecord/query"
            const queryParam = {
                'username': username,
            }
            const queryUrl = _this._concatUrlParams(baseUrl, queryParam)
            // 获取数据
            axios.get(queryUrl).then((res) => {
                const resData = res.data
                if (0 === resData.status
                    && resData.hasOwnProperty('data')) {
                    // 获取数据成功
                    resData.data.forEach((value, index) => {
                        if (value["opType"] == 1) {
                            value["operationType"] = "查询"
                        } else if (value["opType"] == 2) {
                            value["operationType"] = "新增"
                        } else if (value["opType"] == 3) {
                            value["operationType"] = "更新"
                        } else if (value["opType"] == 4) {
                            value["operationType"] = "删除"
                        }
                    })
                    _this.detailData = resData.data
                    // console.log("detail data", _this.detailData)
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
        }
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
            margin-left 640px
            .query-input
                width 270px
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
        .permission-tag
            margin-right 10px
            margin-top 5px
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
        width 1200px
        height 500px
        background-color #fff
        position absolute
        left 20%
        top 100px
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