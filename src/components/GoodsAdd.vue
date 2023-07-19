<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert class="el-alert" title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <el-steps class="el-steps" :active="parseInt(setpActive)" align-center finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form  label-position="top" class="add-goods-form"  ref="addGoodsForm" :rules="addGoodsRules" :model="addGoodsForm" label-width="80px">
                <el-tabs @tab-click="tabClick" :before-leave="tabChange" tab-position="left" v-model="setpActive" >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name" >
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price" >
                            <el-input type="number" v-model="addGoodsForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight" >
                            <el-input type="number" v-model="addGoodsForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" >
                            <el-input type="number" v-model="addGoodsForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addGoodsForm.goods_cat"
                                :options="selectOptions"
                                @change="handleChange"
                                :props="selectProps"
                                clearable
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item class="params-form-item" v-for="(item,index) in manyData" :key="index" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border v-for="(item2,index2) in item.attr_vals" :key="index2" :label="item2"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="(item,index) in onlyData" :key="index" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                        class="upload-demo"
                        :action="uploadUrl"
                        :on-preview="picHandlePreview"
                        :on-remove="picHandleRemove"
                        :headers="headerObj"
                        :on-success="picHandleSuccess"
                        list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                          <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce"/>
                          <el-button @click="addGoods" type="primary" class="btn-add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 修改动态参数/静态属性 -->
        <el-dialog
        title="图片浏览"
        :visible.sync="previewVisible"
        width="50%"
        @close="closePreviewDialog">
            <img class="dialog-img" :src="previewUrl"/>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data(){
        return{
            setpActive:0,
            addGoodsRules:{
                goods_name:[
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                ],
                goods_price:[
                    {required: true, message: '请输入商品价格', trigger: 'blur'},
                ],
                goods_weight:[
                    {required: true, message: '请输入商品重量', trigger: 'blur'},
                ],
                goods_number:[
                    {required: true, message: '请输入商品数量', trigger: 'blur'},
                ],
                goods_cat:[
                    {required: true, message: '请选择商品分类', trigger: 'blur'},
                ],
            },
            addGoodsForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                goods_introduce:"",
                attrs:[]
            },
            selectValue:[],
            selectOptions:[],
            selectProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            manyData:[],
            onlyData:[],
            uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj:{
                "Authorization":window.sessionStorage.getItem('token')
            },
            previewUrl:'',
            previewVisible:false,

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
            if(this.addGoodsForm.goods_cat.length!=3){
                this.addGoodsForm.goods_cat = []
            }
        },
        tabChange(avtiveName,oldName){
            if(oldName==0 && this.addGoodsForm.goods_cat.length!=3){
                this.$message.error("请选择商品分类");
                return false;
            }
        },
        async tabClick(){
            if(this.setpActive==1){
                const {data:res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`,{params:{sel:'many'}});
                if(res.meta.status==200){
                    res.data.forEach(item => {
                        item.attr_vals= item.attr_vals.length == 0 ? [] : item.attr_vals.split(',');
                    });
                    this.manyData = res.data;
                }else{
                    this.$message.error(res.meta.msg);
                }
            }else if(this.setpActive==2){
                const {data:res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`,{params:{sel:'only'}});
                if(res.meta.status==200){
                    this.onlyData = res.data;
                }else{
                    this.$message.error(res.meta.msg);
                }
            }
        },
        picHandleSuccess(res){
            const picInfo = {
                pic : res.data.tmp_path
            }
            this.addGoodsForm.pics.push(picInfo);
        },
        picHandlePreview(file){
            this.previewUrl = file.response.data.url;
            this.previewVisible=true;
        },
        picHandleRemove(file){
            const filePath = file.response.data.tmp_path;
            const index = this.addGoodsForm.pics.findIndex(item=>item.pic===filePath);
            this.addGoodsForm.pics.splice(index,1);
        },
        closePreviewDialog(){
            this.previewVisible=false;
        },
        async addGoods(){
            this.$refs.addGoodsForm.validate(async(valid)=>{
                if(valid){
                    this.addGoodsForm.goods_price = parseInt(this.addGoodsForm.goods_price);
                    this.addGoodsForm.goods_weight = parseInt(this.addGoodsForm.goods_weight);
                    this.addGoodsForm.goods_number = parseInt(this.addGoodsForm.goods_number);
                    this.manyData.forEach(item=>{
                        const newInfo={
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals.join(' ')
                        }
                        this.addGoodsForm.attrs.push(newInfo);
                    })
                    this.onlyData.forEach(item=>{
                        const newInfo={
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals
                        }
                        this.addGoodsForm.attrs.push(newInfo);
                    })
                    let form = _.cloneDeep(this.addGoodsForm);
                    form.goods_cat = form.goods_cat.join(',');
                    const {data:res} = await this.$http.post('goods',form);
                    if(res.meta.status==201){
                        this.$message.success(res.meta.msg);
                        this.$router.push('/goods');
                    }else{ 
                        this.$message.error(res.meta.msg);
                    }
                }else{
                    this.$message.error("请填写完整必填项");
                }
            })
            
        }
    }
}
</script>

<style lang="less">
    .el-alert{
        margin: 0 0 10px;
    }
    .el-steps{
        margin: 0 10px 10px 0;
    }
    .params-form-item{
        .el-checkbox{
            margin: 10px !important;
        }
    }
    .el-dialog__body{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 100%;
        }
    }
    .btn-add{
        margin: 20px 0 0;
    }
</style>