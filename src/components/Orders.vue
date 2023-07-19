<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row class="search" :gutter="20 ">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" class="input-with-select">
                        <el-button @click="getOrdersList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table
            :data="ordersList"
            stripe
            style="width: 100%">
                <el-table-column
                type="index"
                label="#"
                width="50">
                </el-table-column>
                <el-table-column
                prop="order_number"
                label="订单编号">
                </el-table-column>
                <el-table-column
                prop="order_price"
                label="订单价格"
                width="120">
                </el-table-column>
                <el-table-column
                prop="order_pay"
                label="是否付款"
                width="120">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.order_pay==1" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                prop="is_send"
                label="是否发货"
                width="120">
                </el-table-column>
                <el-table-column
                lable="下单时间"
                with="200">
                    <template v-slot="scope">
                        {{scope.row.create_time | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                label="操作"
                width="200">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="修改地址" placement="top" >
                            <el-button @click="addressDialog(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查询物流" placement="top" >
                            <el-button @click="openLogisticsDialog(scope.row)" type="success" icon="el-icon-orange" circle></el-button>
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
        <!-- 修改地址 -->
        <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="closeAddressDialog">
            <el-form class="address-form"  ref="addressForm" :rules="addressFormRules" :model="addressForm" label-width="100px">
                <el-form-item label="省市区/县" prop="economize">
                    <el-cascader
                        :options="cityOptions"
                        v-model="addressForm.economize"
                        :props="selectProps"
                        clearable
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detail">
                    <el-input v-model="addressForm.detail"></el-input>
                </el-form-item>
                <div class="button-group">
                    <el-button @click="closeAddressDialog">取 消</el-button>
                    <el-button type="primary" @click="changeAddress()">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 物流 -->
        <el-dialog
        title="物流查询"
        :visible.sync="logisticsVisible"
        width="50%"
        @close="logisticsVisible = false">
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in logisticsList"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityOptions from '../assets/city_data2017_element'
export default {
    data(){
        return{
            ordersList:[],
            total:0,//总个数
            queryInfo:{
                query:'',//查询参数
                pagenum:1,//当前页码
                pagesize:10,//每页显示个数
            },
            logisticsList:[],
            logisticsVisible:false,
            addressVisible:false,
            addressFormRules:{
                economize:[
                    {required: true, message: '请填写省/市', trigger: 'blur'},
                ],
                detail:[
                    {required: true, message: '请填写详细地址', trigger: 'blur'},
                ],
            },
            addressForm:{
                economize:[],
                detail:'',
            },
            cityOptions: cityOptions,
            selectProps:{
                value:'value',
                label:'label',
                children:'children'
            },

        }
    },
    created(){
        this.getOrdersList();
    },
    methods:{
        async getOrdersList(){
            const {data:res} = await this.$http.get("orders",{params:this.queryInfo});
            if(res.meta.status==200){
                this.ordersList = res.data.goods;
                this.total = res.data.total;
            }else{
                this.$message.error(res.meta.status);
            }
        },
        async openLogisticsDialog(row){
            // 接口只有一个供测试的物流单号，所以用不到传过来的id了
            // const {data:res} = await this.$http.get(`/kuaidi/${row.order_number}`);
            // if(res.meta.status==200){
            //     this.logisticsList = res.data;
            //     this.logisticsVisible = true;
            // }else{
            //     this.logisticsList = [];
            //     this.$message.error(res.meta.msg);
            // }
            this.logisticsList = [
            {
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "已签收,感谢使用顺丰,期待再次为您服务",
                "location": ""
            },
            {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                "location": ""
            },
            {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "快件到达 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "快件到达 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "顺丰速运 已收取快件",
                "location": ""
            },
            {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "卖家发货",
                "location": ""
            },
            {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                "location": ""
            },
            {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "商品已经下单",
                "location": ""
            }],
            this.logisticsVisible = true;
        },
        async addressDialog(row){
            this.addressVisible = true;
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;
            this.getOrdersList();
        },
        handleCurrentChange(currentPage){
            this.queryInfo.pagenum = currentPage;
            this.getOrdersList();
        },
        changeAddress(){
            this.$refs.addressForm.validate((valid)=>{
                if(valid){
                    this.closeAddressDialog();
                }else{
                    this.$message.error('请完善必填项')
                }
            })
        },
        closeAddressDialog(){
            this.addressForm={};
            this.addressVisible = false;
        }

    }
}
</script>

<style lang="less">
    .search{
        margin: 0 0 20px;
    }
    .button-group{
        display: flex;
        justify-content: flex-end;
        margin: 10px 0 0;
    }
    .el-cascader{
        width:100%;
    }
</style>