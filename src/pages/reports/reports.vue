<template>
  <el-card class="box-card">
    <!-- 面包屑导航区域 -->
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 卡片视图区域 -->

    <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 750px; height: 400px;"></div>
  </el-card>
</template>

<script>
// 1. 导入 echarts
// import echarts from 'echarts'
var echarts = require('echarts')
export default {
  mounted () {
    this.useEchart()
  },
  methods: {
    async useEchart () {
    // init
      var myChart = echarts.init(document.getElementById('main'))
      // option
      // 获取表格数据
      const res = await this.$http.get(`reports/type/1`)
      let option2 = res.data.data
      // 指定图标的配置项和数据
      let option1 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      // ES6 扩展运算符 ...arr ...obj
      let option = {...option1, ...option2}

      // setOption
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
#main{
  margin-top:20px;
}
</style>
