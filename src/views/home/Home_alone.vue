<!-- <template>
    <div id="main">
        <div id="header">
            <div class="user">
                <el-dropdown trigger="click" @command="handleCommand">
                    <div style="display: flex; align-items: center; padding: 0 10px; cursor: pointer">
                        <svg t="1727603721373" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4316" width="30" height="30">
                            <path d="M835.2 765.5c-69-71.3-155.8-118.5-250.8-137.4 49.6-31.7 82.7-87.1 82.7-150.2 0-98.2-79.9-178.2-178.2-178.2s-178.2 79.9-178.2 178.2c0 63.1 33.1 118.5 82.7 150.2-94.9 18.9-181.7 66.1-250.7 137.4-17.8 18.4-17.8 48.3 0 66.7C234.4 926.9 357.3 979 489 979c131.7 0 254.6-52.1 346.2-146.8 17.8-18.4 17.8-48.3 0-66.7zM379.6 477.9c0-60.3 49.1-109.4 109.4-109.4s109.4 49.1 109.4 109.4S549.3 587.3 489 587.3s-109.4-49-109.4-109.4zM489 910.2c-106 0-205.4-39.4-282.1-111.4 76.7-72 176.1-111.4 282.1-111.4 106 0 205.3 39.4 282.1 111.4-76.7 72-176.1 111.4-282.1 111.4z" fill="#a7c6e7" p-id="4317"></path>
                            <path d="M922.9 551.8c-17.8 0-32.7-13.7-34.1-31.4C872.7 313.9 699.6 150.8 489 150.8S105.3 313.9 89.2 520.4c-1.4 17.8-16.3 31.4-34.1 31.4-20.2 0-36-17.3-34.4-37.4C39.8 272.8 242.5 82 489 82s449.2 190.8 468.3 432.4c1.6 20.1-14.2 37.4-34.4 37.4z" fill="#a7c6e7" p-id="4318"></path>
                        </svg>
                        <span style="padding: 0 10px">{{ username }}</span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="title">
                {{ headerTitle }}
                <svg t="1733900991018" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6358" width="40" height="40">
                    <path d="M32.442182 879.786667a81.904485 81.904485 0 0 0 81.47006 89.212121h243.153455l38.167273-418.909091H62.464zM182.954667 46.979879A81.88897 81.88897 0 0 0 101.484606 121.173333L70.17503 464.244364h332.350061L440.630303 46.979879zM493.02497 759.296a277.457455 277.457455 0 0 1 412.113454-240.593455L869.112242 122.88a81.904485 81.904485 0 0 0-81.051151-75.900121H524.753455l-85.767758 922.018909h148.371394a276.604121 276.604121 0 0 1-94.332121-209.702788z" fill="#1296db" p-id="6359"></path>
                    <path d="M918.776242 596.154182a217.972364 217.972364 0 1 0 73.107394 163.591757 217.956848 217.956848 0 0 0-73.107394-163.591757zM752.205576 955.004121l-16.973576-16.989091 48.438303-46.545454-50.253576-1.644606-15.996121-14.227394 68.002909-63.891394 16.989091 17.066666-39.90497 37.593213 51.2 0.822303 13.963637 15.763394z m75.698424-144.290909l-4.390788 4.390788-19.704242-19.704242 4.390788-4.390788a47.553939 47.553939 0 0 0 14.103272-34.319515 48.469333 48.469333 0 1 0-82.773333 34.272969l4.421818 4.390788-19.735273 19.735273-4.313212-4.390788a76.846545 76.846545 0 1 1 108.00097 0zM886.209939 870.4l-4.375272 4.390788-24.296728-24.296727 4.57697-4.390788c22.962424-21.953939 36.119273-53.666909 36.119273-86.993455a124.478061 124.478061 0 0 0-124.338424-124.338424 122.864485 122.864485 0 0 0-88.126061 36.864 121.188848 121.188848 0 0 0-35.188364 87.396848 124.121212 124.121212 0 0 0 36.212364 87.179637l4.390788 4.390788-24.203637 24.203636-4.359757-4.406303c-30.347636-30.347636-47.057455-69.818182-47.057455-111.290182a158.332121 158.332121 0 0 1 316.664243 0A156.299636 156.299636 0 0 1 886.209939 870.4z" fill="#1296db" p-id="6360"></path>
                </svg>
            </div>
        </div>
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-main style="padding: 0;">
                <visualization></visualization>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Visualization from '@/views/visualization/Visualization';
import { logout } from "../../components/utils/service";

export default {
    name: 'home',
    components: {
        Visualization
    },
    data() {
        return {
            headerTitle: '中国近实时地表异常归因系统',
            username: localStorage.username || '',
        }
    },
    methods: {
        confirmLogout() {
            this.$confirm('确认退出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                logout().then(res => {
                    if (res.status === 200) {
                        localStorage.removeItem('username');
                        localStorage.removeItem('token');
                        this.$router.push({ path: '/login' });
                    }
                });
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消退出' });
            });
        },
        handleCommand(command) {
            if (command === 'logout') {
                this.confirmLogout();
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
#main
    width 100%
    height 100%
    #header
        width 100%
        height 70px
        background-color #fff
        border-bottom 1px solid #eee
        display flex
        justify-content space-between
        align-items center
        padding 0 20px
        box-sizing border-box
        .title
            font-size 20px
            font-weight bold
            color #333
            display flex
            align-items center
            justify-content flex-end
            .icon
                margin-left 10px
        .user
            display flex
            align-items center
            padding 0 10px
            cursor pointer
            &:hover
                transition 0.2s all ease-in-out
                background-color: #eee
    .el-main
        background-color: #f0f2f5
        height calc(100% - 70px)
</style> -->