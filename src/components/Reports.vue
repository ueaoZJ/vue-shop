<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from "echarts"
import _ from "lodash"
export default {
    data(){
        return{
            option : {
                title: {
                text: '用户来源'
                },
                tooltip: {},
                legend: {
                data: ['地区']
                },
                xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                {
                    name: '地区',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
                ]
            }
        }
    },
    async mounted(){
        const myChart = echarts.init(document.getElementById('main'));
        
        const {data:res} = await this.$http.get(`reports/type/1`);
        if(res.meta.status==200){
            let resource = _.merge(res.data,this.option);
            myChart.setOption(resource);
        }else{
            this.$message.error(res.meta.msg);
        }
    }
}
</script>

<style lang="less">

</style>