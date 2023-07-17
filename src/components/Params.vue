<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <el-row class="shop-cate">
                <el-col :span="8">
                    选择商品分类：
                    <el-cascader
                    v-model="selectValue"
                    :options="selectOptions"
                    @change="handleChange"
                    :props="selectProps"
                    clearable
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="selectTab" @tab-click="tabHandleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button @click="openAddDialog" class="add-button" type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
                    <el-table
                    border
                    :data="manyData"
                    stripe
                    style="width: 100%">
                        <el-table-column
                        type="expand"
                        width="50">
                            <template v-slot="scope">
                                <el-tag
                                class="el-tag"
                                :key="index"
                                v-for="(item,index) in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(index,scope.row)">
                                {{item}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                        type="index"
                        label="#"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="attr_name"
                        label="属性名称">
                        </el-table-column>
                        <el-table-column
                        label="操作">
                            <template v-slot="scope">
                                <el-button @click="openEditDialog(scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
                                <el-button @click="deleteParams(scope.row)" icon="el-icon-delete" type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="openAddDialog" class="add-button" type="primary" size="mini"  :disabled="isDisabled">添加属性</el-button>
                    <el-table
                    border
                    :data="onlyData"
                    stripe
                    style="width: 100%">
                        <el-table-column
                        type="expand"
                        width="50">
                            <template v-slot="scope">
                                <el-tag
                                class="el-tag"
                                :key="index"
                                v-for="(item,index) in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(index,scope.row)">
                                {{item}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                        type="index"
                        label="#"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="attr_name"
                        label="属性名称">
                        </el-table-column>
                        <el-table-column
                        label="操作">
                            <template v-slot="scope">
                                <el-button @click="openEditDialog(scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
                                <el-button @click="deleteParams(scope.row)" icon="el-icon-delete" type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加动态参数/静态属性 -->
        <el-dialog
        :title="'添加'+text"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="closeAddDialog">
            <el-form class="add-params-form"  ref="addForm" :rules="addFormRules" :model="addForm" label-width="80px">
                <el-form-item :label="text" prop="attr_name" >
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeAddDialog">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 修改动态参数/静态属性 -->
        <el-dialog
        :title="'修改'+text"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="closeEditDialog">
            <el-form class="edit-params-form"  ref="editForm" :rules="editFormRules" :model="editForm" label-width="80px">
                <el-form-item :label="text" prop="attr_name" >
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeEditDialog">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selectValue:[],
            selectOptions:[],
            selectProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectId:'',
            selectTab:'many',
            isDisabled:true,
            onlyData:[],
            manyData:[],
            text:'动态参数',
            addDialogVisible:false,
            addFormRules:{
                attr_name:[
                    {required: true, message: '请输入名称', trigger: 'blur'},
                ],
            },
            addForm:{},
            editDialogVisible:false,
            editFormRules:{
                attr_name:[
                    {required: true, message: '请输入名称', trigger: 'blur'},
                ],
            },
            editForm:{
                attr_id:'',
                attr_name:'',
                cat_id:''
            },
            
        }
    },
    created(){
        this.getCateData();
    },
    methods:{
        async getCateData(){
            const {data:res} = await this.$http.get('categories');
            if(res.meta.status==200){
                this.selectOptions = res.data;
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        handleChange(){
            if(this.selectValue.length==3){
                this.selectId = this.selectValue[2];
                this.isDisabled = false;
                this.tabHandleClick();
            }else{
                this.selectId = '';
                this.selectValue = [];
                this.isDisabled = true;
                this.manyData = [];
                this.onlyData = [];
            }
        },
        async tabHandleClick(){
            if(this.selectId){
                const {data:res} = await this.$http.get(`categories/${this.selectId}/attributes`,{params:{sel:this.selectTab}});
                if(res.meta.status==200){
                    res.data.forEach(item => {
                        item.attr_vals=item.attr_vals?item.attr_vals.split(','):[];
                        item.inputVisible = false;
                        item.inputValue = '';
                    });
                    if(this.selectTab=='only'){
                        this.onlyData = res.data;
                    }else{
                        this.manyData = res.data;
                    }
                }else{
                    this.$message.error(res.meta.msg);
                }
            }
        },
        closeAddDialog(){
            this.$refs.addForm.resetFields();
            this.addDialogVisible=false;
        },
        async addParams(){
            const {data:res} = await this.$http.post(`categories/${this.selectId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.selectTab});
            if(res.meta.status==201){
                this.tabHandleClick();
                this.$message.success(res.meta.msg);
            }else{
                this.$message.error(res.meta.msg);
            }
            this.addDialogVisible=false;
        },
        openAddDialog(){
            this.addDialogVisible=true;
        },
        openEditDialog(row){
            this.editForm.cat_id = row.cat_id;
            this.editForm.attr_id = row.attr_id;
            this.editForm.attr_name = row.attr_name;
            this.editDialogVisible=true;
        },
        closeEditDialog(){
            this.$refs.editForm.resetFields();
            this.editForm={};
            this.editDialogVisible=false;
        },
        async editParams(){
            this.editDialogVisible=false;
            const {data:res} = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.selectTab});
            if(res.meta.status==200){
                this.$message.success(res.meta.msg);
                this.tabHandleClick();
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        async deleteParams(row){
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`);
                if(res.meta.status==200){
                    this.tabHandleClick();
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
        handleClose(index,row){
            let attr_vals=[...row.attr_vals.slice(0,index),...row.attr_vals.slice(index+1,row.attr_vals.length)];
            this.handleInputConfirm(row,attr_vals);
        },
        async handleInputConfirm(row,attr_vals=[]){
            if(row.inputValue.trim() || attr_vals.length!=0){
                let vals=[];
                if(attr_vals.length!=0){
                    vals = attr_vals;
                }else{
                    row.attr_vals.push(row.inputValue.trim());
                    vals = row.attr_vals;
                }
                vals=vals.join(',');
                const {data:res} = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:vals})
                if(res.meta.status==200){
                    this.$message.success(res.meta.msg);
                    if(attr_vals.length!=0){
                        row.attr_vals = attr_vals;
                    }
                }else{
                    this.$message.error(res.meta.msg);
                    if(attr_vals.length==0){
                        row.attr_vals.pop();
                    }
                }
                row.inputVisible = false;
                row.inputValue = '';
            }
        },
        showInput(row){
            row.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
    },
    watch:{
        selectTab(newValue){
            if(newValue=='only'){
                this.text='静态属性';
            }else{
                this.text='动态参数';
            }
        }
    }
}
</script>

<style lang="less">
    .shop-cate{
        margin: 20px 0;
    }
    .add-button{
        margin: 0 0 20px;
    }
    .button-group{
        display: flex;
        justify-content: flex-end;
        margin: 10px 0 0;
    }
    .el-tag,.button-new-tag{
        margin: 10px;
    }
    .input-new-tag{
        margin: 10px;
        width: 100px;
    }
    
</style> 