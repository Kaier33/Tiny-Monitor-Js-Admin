<template>
  <div class="issue-list-container">
    <header>
      <p class="title">{{ projectInfo.p_name }}</p>
      <div>
        <el-button
          class="member-btn"
          type="success"
          plain
          icon="el-icon-user"
          @click.stop="dialogMembersVisible = true"
        >
          成员列表
        </el-button>
        <el-select
          v-model="dateRange"
          :disabled="tableLoading"
          placeholder="请选择日期"
          @change="selectChange"
        >
          <el-option
            v-for="item in dateRangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </header>
    <main>
      <div id="line-chart-box"></div>
      <el-table
        v-loading="tableLoading"
        :data="errorList"
        height="300"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="error_id" label="异常ID"></el-table-column>
        <el-table-column prop="error_type" label="异常类型"></el-table-column>
        <el-table-column prop="exception_time" label="触发时间">
          <template slot-scope="scope">
            {{ scope.row | fmt_date }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button plain type="primary" @click="handleClick(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :disabled="tableLoading"
          :current-page.sync="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </main>
    <el-dialog title="成员列表" :visible.sync="dialogMembersVisible">
      <div class="tools">
        <el-button icon="el-icon-plus" type="primary" @click.stop="invite">
          邀请成员
        </el-button>
      </div>
      <el-table border stripe :data="memberList">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
        ></el-table-column>
        <el-table-column
          property="username"
          label="用户名"
          width="150"
        ></el-table-column>
        <el-table-column
          property="nickname"
          label="昵称"
          width="200"
        ></el-table-column>
        <el-table-column property="email" label="邮箱"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import { errorTypeEnum } from '@/utils/enum'
  import { formatDate } from '@/utils/tool'
  import { getProjectInfo } from '@/api/projects'
  import { getErrorList, getLineChartErrorList } from '@/api/error'
  import * as echarts from 'echarts/core'
  import { LineChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'
  import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
  } from 'echarts/components'
  echarts.use([
    LineChart,
    CanvasRenderer,
    GridComponent,
    TooltipComponent,
    LegendComponent,
  ])
  export default {
    name: 'IssueList',
    filters: {
      fmt_date(row) {
        return formatDate(
          'yyyy-MM-dd hh:mm:ss',
          new Date(Number(row.exception_time))
        )
      },
    },
    data() {
      return {
        lineChart: null,
        tableLoading: true,
        dialogMembersVisible: false,
        projectInfo: {},
        memberList: [],
        errorList: [],
        dateRangeOptions: [
          {
            value: 7,
            label: '最近7天',
          },
          {
            value: 14,
            label: '最近14天',
          },
          {
            value: 30,
            label: '最近30天',
          },
          {
            value: 60,
            label: '最近60天',
          },
        ],
        dateRange: 14,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        lineChartOption: {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: [],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
          yAxis: {
            type: 'value',
          },
          series: [],
        },
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.lineChart = echarts.init(document.getElementById('line-chart-box'))
        const { p_id } = this.$route.query
        p_id && this.getProjectInfoReq(p_id)
        p_id && this.getLineChartErrorListReq(p_id)
      })
    },
    methods: {
      selectChange() {
        const { p_id } = this.$route.query
        this.currentPage = 1
        this.getErrorListReq(p_id)
        this.getLineChartErrorListReq(p_id)
      },
      getProjectInfoReq(p_id) {
        const Loading = this.$baseLoading()
        getProjectInfo(p_id)
          .then((res) => {
            if (res.code === 200) {
              this.projectInfo = res.data.projectInfo
              this.memberList = res.data.memberList
              this.getErrorListReq(p_id)
            } else {
              this.$baseMessage(res.message, 'error')
            }
          })
          .finally(() => {
            Loading.close()
          })
      },
      getErrorListReq(p_id) {
        this.tableLoading = true
        getErrorList({
          p_id,
          page: this.currentPage,
          page_size: this.pageSize,
          day: this.dateRange,
        }).then((res) => {
          if (res.code === 200) {
            this.tableLoading = false
            this.errorList = res.data.list
            this.total = res.data.total
          }
        })
      },
      getLineChartErrorListReq(p_id) {
        this.lineChart.showLoading({ text: '' })
        getLineChartErrorList({
          p_id,
          day: this.dateRange,
        })
          .then((res) => {
            if (res.code === 200) {
              this.categoryErrorType(res.data.list)
            }
          })
          .finally(() => {
            this.lineChart.hideLoading()
          })
      },
      invite() {
        this.$baseMessage('功能开发中...', 'warning')
      },
      currentChange() {
        if (this.tableLoading) return
        this.getErrorListReq(this.$route.query.p_id)
      },
      handleClick(row) {
        this.$router.push(`/issue/detail?id=${row.id}`)
      },
      setLineChartXaxis() {
        const { xAxis } = this.lineChartOption
        xAxis.data.length = 0
        const now = new Date()
        const timestamp = now.getTime()
        const oneday = 3600000 * 24
        const today = formatDate('MM/dd', now)
        xAxis.data.unshift(today)
        for (let i = 1; i < this.dateRange; i++) {
          xAxis.data.unshift(
            formatDate('MM/dd', new Date(timestamp - i * oneday))
          )
        }
      },
      categoryErrorType(list) {
        this.setLineChartXaxis()
        const { legend, series, xAxis } = this.lineChartOption
        const category = {}
        legend.data.length = 0
        series.length = 0
        for (const key in errorTypeEnum) {
          category[errorTypeEnum[key]] = []
          legend.data.push(errorTypeEnum[key])
        }
        list.forEach((ele) => {
          ele.fmt_time = formatDate(
            'MM/dd',
            new Date(Number(ele.exception_time))
          )
          if (category.hasOwnProperty(ele.error_type)) {
            category[ele.error_type].push(ele)
          }
        })
        let constant = {
          type: 'line',
          stack: 'Total',
          smooth: true,
        }
        for (const key in category) {
          const dataArr = Array(this.dateRange).fill(0)
          category[key].forEach((ele) => {
            if (xAxis.data.includes(ele.fmt_time)) {
              dataArr[xAxis.data.indexOf(ele.fmt_time)]++
            }
          })
          series.push({
            ...constant,
            ...{
              name: key,
              data: dataArr,
            },
          })
        }
        this.lineChart.setOption(this.lineChartOption)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .issue-list-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      padding: 0 20px;
      .title {
        font-weight: 600;
        font-size: 22px;
        line-height: 50px;
      }
      .member-btn {
        margin-right: 20px;
      }
    }
    p {
      margin: 0;
    }
    main {
      // margin-top: 30px;
      background-color: #fff;
      padding: 30px 20px;
      #line-chart-box {
        position: relative;
        top: 0;
        height: 300px;
        margin-bottom: 30px;
      }
      .pagination-box {
        margin-top: 20px;
        position: relative;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
  .tools {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
</style>
