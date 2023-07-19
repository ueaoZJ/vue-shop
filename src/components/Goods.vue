<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="search">
                <el-row :gutter="20 ">
                    <el-col :span="8">
                        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" class="input-with-select">
                            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="addGoods" type="primary">添加用户</el-button>
                    </el-col> 
                </el-row>
            </div>

            <el-table
            :data="goodsList"
            stripe
            style="width: 100%">
                <el-table-column
                type="index"
                label="#"
                width="50">
                </el-table-column>
                <el-table-column
                prop="goods_name"
                label="商品名称">
                </el-table-column>
                <el-table-column
                prop="goods_price"
                label="商品价格(元)"
                width="60">
                </el-table-column>
                <el-table-column
                prop="goods_weight"
                label="商品重量"
                width="60">
                </el-table-column>
                <el-table-column
                label="创建时间"
                width="200">
                    <template v-slot="scope">
                        {{scope.row.add_time | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                label="操作"
                width="200">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="编辑商品" placement="top" >
                            <el-button @click="editGoods(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除商品" placement="top" >
                            <el-button @click="deleteGoods(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table> 
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            goodsList:[],
            total:0,//总个数
            queryInfo:{
                query:'',//查询参数
                pagenum:1,//当前页码
                pagesize:10,//每页显示个数
            },
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
            if(res.meta.status==200){
                this.goodsList = res.data.goods;
                this.total = res.data.total;
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        addGoods(){
            this.$router.push('/goods/add');
        },
        editGoods(row){
            this.$router.push({path:'/goods/edit',query:{id:row.goods_id}})
        },
        async deleteGoods(row){
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`goods/${row.goods_id}`);
                if(res.meta.status==200){
                    let maxPageNum =  Math.ceil(this.total/this.queryInfo.pagesize);
                    if(this.queryInfo.pagenum == maxPageNum && this.total%this.queryInfo.pagesize==1){
                        this.queryInfo.pagenum--;
                    }
                    this.getGoodsList();
                    this.$message.success(res.meta.msg);
                }else{
                    this.$message.error(res.meta.msg);
                }
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;
            this.getGoodsList();
        },
        handleCurrentChange(currentPage){
            this.queryInfo.pagenum = currentPage;
            this.getGoodsList();
        }
    }
}
</script>
<style lang="less">
    .search{
        margin:0 0 20px;
    }
</style>