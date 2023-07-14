<template>
    <el-container>
        <el-header class="nav">
            <p>电商后台管理系统</p>
            <el-button type="info" @click="loginOut">登出</el-button>
        </el-header>
        <el-container>
            <el-aside class="aside" :width="menuWidth + 'px'">
                <div @click="toggleCollapse" class="toggle-button">|||</div>
                <el-menu 
                    background-color="#313743" text-color="#fff" active-text-color="#359BFF" 
                    :default-active="activeItem" router :collapse="isCollapse" unique-opened class="el-menu-vertical-demo">
                    <el-submenu v-for="item1 in menus" :key="item1.path" :index="item1.path">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">{{item1.authName}}</span>
                        </template>
                        <el-menu-item @click="saveActiveItem(item2.path)" class="sub-menu" v-for="item2 in item1.children" :key="item2.path" :index="item2.path">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">{{item2.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            isCollapse:false,
            menuWidth:200,
            menus:[],
            activeItem:'',
        }
    },
    created(){
        this.getMenulist();
        this.activeItem = window.sessionStorage.getItem('activeItem');
    },
    methods:{
        saveActiveItem(activeItem){
            window.sessionStorage.setItem('activeItem',activeItem);
        },
        async getMenulist(){
            const {data:res} = await this.$http.get("menus");
            if(res.meta.status!=200){
                this.$message.error("获取菜单失败！")
            }else{
                console.log(res);
                this.menus = res.data;
            }
        },
        loginOut(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
            if(this.isCollapse){
                this.menuWidth=64;
            }else{
                this.menuWidth=200;
            }
        }
    }
}
</script>

<style lang="less">
    .nav{
        background: #2E3436;
        display: flex;
        color: #fff;
        font-size: 24px;
        justify-content: space-between;
        align-items: center;
    }
    section,.aside{
        height: 100%;
    }
    .aside{
        .toggle-button{
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 40px;
            cursor: pointer;
            background: #475163;
            color:#fff;
        }
        .el-menu-vertical-demo {
            min-height: calc(100% - 40px);
        }
        .sub-menu{
            border: 0;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
</style>