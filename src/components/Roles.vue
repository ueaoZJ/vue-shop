<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-button @click="openAddRolesForm" class="add-roles-button" type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table
            border
            :data="rolesData"
            stripe
            style="width: 100%">
                <el-table-column
                type="expand"
                width="50">
                    <template v-slot="scope">
                        <el-row class="el-expand-row" v-for="item1 in scope.row.children" :key="item1.authName">
                            <el-col class="el-expand-col-1" :span="6">
                                <el-tag >{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="18">
                                <el-row class="el-expand-row-2"  v-for="item2 in item1.children" :key="item2.authName">
                                    <el-col :span="6">
                                        <el-tag type="success" >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col class="el-expand-col-3" :span="18">
                                        <el-tag @close="removeRightById(scope.row.id,item3.id,scope.row)" class="el-expand-tag-3" v-for="item3 in item2.children" :key="item3.authName" type="warning" closable>{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                type="index"
                label="#"
                width="50">
                </el-table-column>
                <el-table-column
                prop="roleName"
                label="角色名称"
                width="300">
                </el-table-column>
                <el-table-column
                prop="roleDesc"
                label="角色描述"
                width="300">
                </el-table-column>
                <el-table-column
                label="操作">
                    <template v-slot="scope">
                        <el-button @click="openEditDialog(scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
                        <el-button @click="deleteRoles(scope.row)" icon="el-icon-delete" type="danger">删除</el-button>
                        <el-button @click="openRightsDialog(scope.row)" icon="el-icon-setting" type="success">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="rightsDialogVisible"
        width="30%"
        @close="closeRightsTree">
            <el-tree 
            ref="rightTree"
            :data="allRightsData" 
            :props="rightsProps" 
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="defaultCheckedKeys"
            ></el-tree>
            <div class="button-group">
                <el-button @click="closeRightsTree">取 消</el-button>
                <el-button type="primary" @click="addUserRights()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加角色对话框 -->
        <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialogVisible"
        width="30%"
        @close="closeAddRolesForm">
            <el-form class="add-roles-form"  ref="addRolesForm" :rules="addRolesFormRules" :model="addRolesForm" label-width="80px">
                <el-form-item label="角色名称" prop="roleName" >
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeAddRolesForm">取 消</el-button>
                    <el-button type="primary" @click="addRoles">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加角色对话框 -->
        <el-dialog
        title="编辑角色"
        :visible.sync="editRolesDialogVisible"
        width="30%"
        @close="closeEditRolesForm">
            <el-form class="edit-roles-form"  ref="editRolesForm" :rules="editRolesFormRules" :model="editRolesForm" label-width="80px">
                <el-form-item label="角色名称" prop="roleName" >
                    <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item class="button-group">
                    <el-button @click="closeEditRolesForm">取 消</el-button>
                    <el-button type="primary" @click="editRoles">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rolesData:[],
            rightsDialogVisible:false,
            allRightsData:[],
            rightsProps:{
                label:'authName',
                children:'children'
            },
            defaultCheckedKeys:[],//默认选中的权限
            changeCheckedKeys:[],//获取改变后的选中的id
            roleID:'',//当前选中的角色id

            addRolesDialogVisible:false,
            addRolesFormRules:{
                roleName:[
                    {required: true, message: '请输入角色名称', trigger: 'blur'},
                ],
            },
            addRolesForm:{},

            editRolesDialogVisible:false,
            editRolesFormRules:{
                roleName:[
                    {required: true, message: '请输入角色名称', trigger: ['blur','change']},
                ]
            },
            editRolesForm:{
                roleName:'',
                roleDesc:'',
            },
            editRolesId:'',//选中角色的id
            
        }   
    },
    created(){
        this.getRolesData();
        this.getAllRights();
    },
    methods:{
        async getRolesData(){
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status==200){
                this.rolesData = res.data;
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        removeRightById(roleId,rightId,row){
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`roles/${roleId}/rights/${rightId}`);
                if(res.meta.status==200){
                    row.children = res.data;
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
        async deleteRoles(row){
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`roles/${row.id}`);
                if(res.meta.status == 200){
                    this.getRolesData();
                    this.$message.success(res.meta.msg);
                }else{
                    this.$message.error(res.meta.msg);
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        closeRightsTree(){
            this.rightsDialogVisible = false;
            this.defaultCheckedKeys = [];
            //解决不能显示正确的defaultCheckedKeys的Bug
            this.$nextTick(() => {
                this.$refs.rightTree.setCheckedKeys([]);
            })
        },
        openRightsDialog(row){
            this.roleID=row.id;
            this.getFinalRights(row,this.defaultCheckedKeys);
            this.rightsDialogVisible = true;
        },
        async getAllRights(){
            const {data:res} = await this.$http.get('rights/tree');
            if(res.meta.status == 200){
                this.allRightsData = res.data;
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        getFinalRights(element,arr){
            if(!element.children){
                return arr.push(element.id);
            }
            element.children.forEach(ele => {
                this.getFinalRights(ele,arr);
            });
        },
        async addUserRights(){
            this.changeCheckedKeys = [...this.$refs.rightTree.getCheckedKeys(),...this.$refs.rightTree.getHalfCheckedKeys()];
            this.changeCheckedKeys = this.changeCheckedKeys.join(',');
            const {data:res} = await this.$http.post(`roles/${this.roleID}/rights`,{"rids":this.changeCheckedKeys});
            if(res.meta.status==200){
                this.$message.success(res.meta.msg);
                this.getRolesData();
                this.closeRightsTree();
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        openAddRolesForm(){
            this.addRolesDialogVisible=true;
        },
        closeAddRolesForm(){
            this.$refs.addRolesForm.resetFields();
            this.addRolesDialogVisible=false;
        },
        async addRoles(){
            const {data:res} = await this.$http.post('roles',this.addRolesForm);
            if(res.meta.status==201){
                this.$message.success(res.meta.msg);
                this.getRolesData();
                this.closeAddRolesForm();
            }else{
                this.$message.error(res.meta.msg);
            }
        },
        openEditDialog(row){
            this.editRolesForm.roleName = row.roleName;
            this.editRolesForm.roleDesc = row.roleDesc;
            this.editRolesId = row.id;
            this.editRolesDialogVisible = true;
        },
        closeEditRolesForm(){
            this.editRolesDialogVisible=false;
            this.$refs.editRolesForm.resetFields();
            this.editRolesId = '';
        },
        async editRoles(){
            const {data:res} = await this.$http.put(`roles/${this.editRolesId}`,this.editRolesForm);
            if(res.meta.status == 200){
                this.$message.success(res.meta.msg);
                this.getRolesData();
                this.closeEditRolesForm();
            }else{
                this.$message.error(res.meta.msg);
            }
        }
    }
}
</script>

<style lang="less">
    .add-roles-button{
        margin: 0 0 20px;
    }
    .el-expand-col-1{
        margin:  0 0 0 10px;
    }
    .el-expand-row{
        display: flex;
        align-items: center;
        border-top: 1px solid #F2F7F8;
        border-bottom: 1px solid #F2F7F8;
    }
    .el-expand-row-2{
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-top: 1px solid #F2F7F8;
    }
    .el-expand-col-3{
        margin-bottom: -10px
    }
    .el-expand-tag-3{
        margin: 0 10px 10px 0;
    }
    .button-group{
        display: flex;
        justify-content: flex-end;
        margin: 10px 0 0;
    }
</style>