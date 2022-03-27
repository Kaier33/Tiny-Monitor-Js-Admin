<template>
  <div class="index-container">
    <header>
      <p class="title">项目列表</p>
      <el-button size="medium" icon="el-icon-plus" type="primary">
        创建项目
      </el-button>
    </header>
    <main>
      <div class="project-list">
        <div v-for="(item, index) in list" :key="index" class="project-box">
          <section class="header">
            <div class="clickable">
              <p class="p_name-box">
                <span class="icon"></span>
                <span class="p_name">{{ item.p_name }}</span>
              </p>
              <el-button type="primary" plain>查看详情</el-button>
            </div>
            <p class="p_desc">{{ item.p_desc }}</p>
          </section>
          <section :id="`p_id_${item.p_id}`" class="chart"></section>
          <p class="tips">*最近24小时的数据</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import * as echarts from 'echarts/core'
  import { BarChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'
  import { GridComponent, TooltipComponent } from 'echarts/components'
  echarts.use([BarChart, CanvasRenderer, GridComponent, TooltipComponent])
  import { getProjectList } from '@/api/projects'
  import { formatDate } from '@/utils/tool'
  export default {
    name: 'Index',
    data() {
      return {
        list: [],
        hourlist: [],
        option: {
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            data: [],
            show: false,
          },
          yAxis: {
            type: 'value',
            show: false,
          },
          grid: {
            left: '1%',
            right: '1%',
            bottom: 0,
          },
          color: 'rgba(84,112,198, .5)',
          backgroundColor: 'rgba(250, 249, 251, 1)',
          series: [
            {
              barMinHeight: 1,
              data: [
                120, 200, 150, 80, 70, 110, 0, 120, 200, 150, 80, 70, 110, 130,
                120, 200, 150, 80, 70, 110, 0, 120, 70, 110,
              ],
              type: 'bar',
            },
          ],
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        const Loading = this.$baseLoading()
        getProjectList().then((res) => {
          if (res.code === 200) {
            this.setOption()
            this.list = res.data.list || []
            this.$nextTick(() => {
              this.initEcharts()
            })
          }
        })
        Loading.close()
      },
      initEcharts() {
        this.list.forEach((ele) => {
          const dom = document.getElementById(`p_id_${ele.p_id}`)
          if (dom) {
            const myChart = echarts.init(dom)
            const data = Array(24).fill(0)
            ele.statistics_data.forEach((_ele) => {
              let _index = this.hourlist.indexOf(_ele.time)
              if (_index !== -1) {
                data[_index] = _ele.count
              }
            })
            myChart.setOption({
              ...this.option,
              ...{
                series: [
                  {
                    data,
                    barMinHeight: 1,
                    type: 'bar',
                  },
                ],
              },
            })
          }
        })
      },
      setOption() {
        const now = new Date()
        const timestamp = now.getTime()
        let fmt_time = formatDate('yyyy-MM-dd hh', now)
        this.hourlist.unshift(fmt_time)
        this.option.xAxis.data.unshift(fmt_time.slice(5) + '时')
        for (let i = 1; i < 24; i++) {
          let _date = new Date(timestamp - i * 3600000)
          let fmt_time = formatDate('yyyy-MM-dd hh', _date)
          this.hourlist.unshift(fmt_time)
          this.option.xAxis.data.unshift(fmt_time.slice(5) + '时')
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
      .title {
        font-size: 20px;
        font-weight: 600;
      }
    }
    main {
      position: relative;
      top: 0;
      .project-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .project-box {
          background-color: #fff;
          border: 1px solid rgb(219, 214, 225);
          border-radius: 4px;
          box-shadow: $base-box-shadow;
          min-height: 300px;
          width: 480px;
          margin-right: 25px;
          margin-bottom: 25px;
          word-break: break-all;
          .header {
            position: relative;
            top: 0;
            padding: 20px;
            .clickable {
              display: flex;
              justify-content: space-between;
            }
            .p_name-box {
              display: flex;
              align-items: center;
              margin: 0;
              .p_name {
                max-width: 250px;
                font-size: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .icon {
                width: 30px;
                height: 30px;
                background: url('../../assets/images/JavaScript.png') no-repeat;
                background-position: center;
                background-size: 100% 100%;
                border-radius: 10px;
                overflow: hidden;
                margin-right: 10px;
              }
            }
            .p_desc {
              max-width: 420px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
              color: rgb(149, 134, 165);
            }
          }
          .chart {
            position: relative;
            top: 0;
            width: 100%;
            height: 150px;
          }
          .tips {
            padding: 0 8px;
            text-align: right;
            font-size: 12px;
            line-height: 16px;
            color: rgb(84, 112, 198, 0.3);
          }
        }
      }
    }
  }
</style>
