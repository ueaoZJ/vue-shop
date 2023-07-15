<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="search">
                <el-row :gutter="20 ">
                    <el-col :span="8">
                        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" class="input-with-select">
                            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="addUserDialogVisible=true" type="primary">添加用户</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
            :data="userList"
            stripe
            style="width: 100%">
                <el-table-column
                type="index"
                label="#"
                width="50">
                </el-table-column>
                <el-table-column
                prop="username"
                label="姓名"
                width="180">
                </el-table-column>
                <el-table-column
                prop="email"
                label="邮箱"
                width="180">
                </el-table-column>
                <el-table-column
                prop="mobile"
                label="电话">
                </el-table-column>
                <el-table-column
                prop="role_name"
                label="角色">
                </el-table-column>
                <el-table-column
                prop="mg_state"
                label="状态">
                    <template v-slot="scope">
                        <el-switch @change="changeStatus(scope.row)" v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                label="操作">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="修改角色" placement="top" >
                            <el-button @click="openChangeUserForm(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除角色" placement="top" >
                            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" >
                            <el-button type="warning" icon="el-icon-setting" circle></el-button>
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
        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogVisible"
        width="30%"
        :before-close="closeAddUserForm">
            <el-form class="add-user-form"  ref="addUserForm" :rules="addUserFormRules" :model="addUserForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeAddUserForm">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加用户对话框 -->
        <el-dialog
        title="修改用户信息"
        :visible.sync="changeUserDialogVisible"
        width="30%"
        :before-close="closeChangeUserForm">
            <el-form class="change-user-form"  ref="changeUserForm" :rules="changeUserFormRules" :model="changeUserForm" label-width="80px">
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="changeUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="changeUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="changeUserForm.mobile"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeChangeUserForm">取 消</el-button>
                    <el-button type="primary" @click="changeUser">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            userList:[],
            total:0,//总个数
            queryInfo:{
                query:'',//查询参数
                pagenum:1,//当前页码
                pagesize:2,//每页显示个数
            },
            addUserDialogVisible:false,
            addUserFormRules:{
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                email:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                mobile:[
                    { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
                ]
            },
            addUserForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            changeUserDialogVisible:false,
            changeUserForm:{
                username:'',
                mobile:'',
                email:'',
            },
            changeUserFormRules:{
                email:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                mobile:[
                    { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
                ]
            },
            changeUserId:'',
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get('users',{params:this.queryInfo});
            if(res.meta.status == 200){
                this.userList = res.data.users;
                this.total = res.data.total;
            }else{
                this.$message.error("获取用户数据失败！")
            }
        },
        search(){
            this.getUserList();
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;
            this.getUserList();
        },
        handleCurrentChange(currentPage){
            this.queryInfo.pagenum = currentPage;
            this.getUserList();
        },
        async changeStatus(row){
            const {data:res} = await this.$http.put(`users/${row.id}/state/${row.status}`);
            if(res.meta.status == 200){
                this.$message.success("修改状态成功");
            }else{
                this.$message.error("修改状态失败");
                row.mg_state = !row.mg_state;
            }
        },
        deleteUser(row){
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`users/${row.id}`);
                if(res.meta.status == 200){
                    let maxPageNum =  Math.ceil(this.total/this.queryInfo.pagesize);
                    if(this.queryInfo.pagenum == maxPageNum && this.total%this.queryInfo.pagesize==1){
                        this.queryInfo.pagenum--;
                    }
                    this.getUserList();
                    this.$message.success("删除用户成功!");
                }else{
                    this.$message.error("删除用户失败!");
                }
            }).catch(()=>{
                this.$message.info("取消删除")
            })
        },
        closeAddUserForm(){
            this.addUserDialogVisible=false;
            this.$refs['addUserForm'].resetFields();
        },
        addUser(){
            this.$refs['addUserForm'].validate(async(valid)=>{
                if(valid){
                    const {data:res} = await this.$http.post("users",this.addUserForm);
                    if(res.meta.status==201){
                        this.$message.success('添加用户成功');
                        this.getUserList();
                        this.closeAddUserForm();
                    }else{
                        this.$message.error(res.meta.msg);
                    }
                }else{
                    this.$message.error('添加用户失败');
                    return false;
                }
            })
        },
        closeChangeUserForm(){
            this.changeUserDialogVisible=false;
            this.$refs['changeUserForm'].resetFields();
        },
        openChangeUserForm(row){
            this.changeUserForm.username = row.username;
            this.changeUserForm.mobile = row.mobile;
            this.changeUserForm.email = row.email;
            this.changeUserId = row.id;
            this.changeUserDialogVisible = true;
        },
        changeUser(){
            this.$refs['changeUserForm'].validate(async(valid)=>{
                if(valid){
                    const {data:res} = await this.$http.put(`users/${this.changeUserId}`,this.changeUserForm);
                    if(res.meta.status == 200){
                        this.$message.success(res.meta.msg);
                        this.getUserList();
                        this.closeChangeUserForm();
                    }else{
                        this.$message.error(res.meta.msg);
                    }
                }else{
                    this.$message.error('编辑失败');
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="less">
    .add-user-form,.change-user-form{
        .button-group{
            display: flex;
            justify-content: flex-end;
            align-items: center;            
        }
    }
</style>