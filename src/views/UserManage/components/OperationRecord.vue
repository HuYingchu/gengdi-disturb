<template>
    <div class="detail-view-wrapper">
        <el-container>
            <el-table
                :data="detailData"
                style="width: 100%">
                <el-table-column
                    prop="username"
                    label="用户名"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="operationTime"
                    label="操作时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="operationType"
                    label="操作类型"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag
                            :type="getTagType(scope.row.operationType)">
                            {{scope.row.operationType}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作内容">
                </el-table-column>
            </el-table>   
        </el-container>
    </div>
</template>

<script>

export default {
    name: "DetailView",
    props: {
        detailData: {
            type: Array,
            default() {
                return [
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
                ]
            }
        }
    },
    mounted() {
    },
    methods: {
        getTagType(operationType) {
            if (operationType == "查询") {
                return "success"
            } else if (operationType == "更新" || operationType == "新增") {
                return "warning"
            } else if (operationType == "删除") {
                return "danger"
            }
        }
    }
}
</script>

<style scoped lang="stylus">
.detail-view-wrapper
    padding 10px
    position relative
    .bg-purple
        background: #e0e4ef
    .bg-purple-light
        background: #eceef5
</style>