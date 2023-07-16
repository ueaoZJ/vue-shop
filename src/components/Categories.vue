<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-button @click="openAddCateForm" class="add-cate-button" type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table
            :columns="columns"
            :data="cateData"
            show-index
            index-text="#"
            :show-row-hover="false"
            :expand-type="false"
            :selection-type="false"
            border
            >
                <template slot="isok" scope="scope">
                    <i style="color:lightgreen" v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
                    <i style="color:red" v-else class="el-icon-error"></i>
                </template>
                <template slot="sort" scope="scope">
                    <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <template slot="operate" scope="scope">
                    <el-button @click="openChangeDialog(scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
                    <el-button @click="deleteCate(scope.row)" icon="el-icon-delete" type="danger">删除</el-button>
                </template>
            </tree-table>

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
        <!-- 添加分类对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%"
        @close="closeAddCateForm">
            <el-form class="add-cate-form"  ref="addCateForm" :rules="addCateFormRules" :model="addCateForm" label-width="80px">
                <el-form-item label="分类名称" prop="cat_pid" >
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" prop="cat_level">
                    <el-cascader
                    v-model="selectValue"
                    :options="selectOptions"
                    @change="handleChange"
                    :props="selectProps"
                    clearable
                    ></el-cascader>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeAddCateForm">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 修改分类对话框 -->
        <el-dialog
        title="修改分类"
        :visible.sync="changeCateDialogVisible"
        width="30%"
        @close="closeChangeCateForm">
            <el-form class="change-cate-form"  ref="changeCateForm" :rules="changeCateFormRules" :model="changeCateForm" label-width="80px">
                <el-form-item label="分类名称" prop="cat_pid" >
                    <el-input v-model="changeCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeChangeCateForm">取 消</el-button>
                    <el-button type="primary" @click="changeCate">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            cateData:[],
            columns:[
                {label:"分类名称",prop:"cat_name"},
                {label:"是否有效",type:"template",template:'isok'},
                {label:"排序",type:"template",template:'sort'},
                {label:"操作",type:"template",template:'operate'},
            ],
            total:0,//总个数
            queryInfo:{
                pagenum:1,//当前页码
                pagesize:2,//每页显示个数
            },

            addCateDialogVisible:false,
            addCateFormRules:{
                cat_name:[
                    {required: true, message: '请输入分类名称', trigger: 'blur'},
                ],
            },
            addCateForm:{
                cat_name:'',//分类名称
                cat_level:0,//分类层级
                cat_pid:0,//父类id
            },
            selectValue:[],
            selectOptions:[],
            selectProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                checkStrictly: true
            },

            changeCateDialogVisible:false,
            changeCateFormRules:{
                cat_name:[
                    {required: true, message: '请输入分类名称', trigger: 'blur'},
                ],
            },
            changeCateForm:{
                cat_name:''
            },
            changeCateId:'',
        }
    },
    created(){
        this.getCateData();
        this.getCateDataList();
    },
    methods:{
        async getCateData(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
            this.total = res.data.total;
            if(res.meta.status==200){
                this.cateData = res.data.result;
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;
            this.getCateData();
        },
        handleCurrentChange(currentPage){
            this.queryInfo.pagenum = currentPage;
            this.getCateData();
        },
        closeAddCateForm(){
            this.$refs.addCateForm.resetFields();
            this.addCateForm = {
                cat_name:'',//分类名称
                cat_level:0,//分类层级
                cat_pid:0,//父类id
            }
            this.selectValue=[];
            this.addCateDialogVisible=false;
        },
        async openAddCateForm(){
            this.addCateDialogVisible=true;
        },
        handleChange(){
            if(this.selectValue.length>0){
                this.addCateForm.cat_level = this.selectValue.length;
                this.addCateForm.cat_pid = this.selectValue[this.selectValue.length-1];
            }else{
                this.addCateForm.cat_level = 0;
                this.addCateForm.cat_pid = 0;
            }
        },
        async addCate(){
            const {data:res} = await this.$http.post('categories',this.addCateForm);
            if(res.meta.status==201){
                this.getCateData();
                this.$message.success(res.meta.msg);
                this.closeAddCateForm();
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        async getCateDataList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}});
            if(res.meta.status==200){
                this.selectOptions = res.data;
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        closeChangeCateForm(){
            this.changeCateId="";
            this.$refs.changeCateForm.resetFields();
            this.changeCateDialogVisible = false;
        },
        openChangeDialog(row){
            this.changeCateId = row.cat_id;
            this.changeCateForm.cat_name = row.cat_name;
            this.changeCateDialogVisible = true;
        },
        async changeCate(){
            const {data:res} = await this.$http.put(`categories/${this.changeCateId}`,this.changeCateForm);
            if(res.meta.status==200){
                this.$message.success(res.meta.msg);
                this.getCateData();
                this.closeChangeCateForm();
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        async deleteCate(row){
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`categories/${row.cat_id}`);
                if(res.meta.status==200){
                    let maxPageNum =  Math.ceil(this.total/this.queryInfo.pagesize);
                    if(this.queryInfo.pagenum == maxPageNum && this.total%this.queryInfo.pagesize==1){
                        this.queryInfo.pagenum--;
                    }
                    this.getCateData();
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
        }
    }
}
</script>

<style lang="less">
    .add-cate-button{
        margin: 0 0 10px;
    }
    .button-group{
        display: flex;
        justify-content: flex-end;
        margin: 10px 0 0;
    }
</style>