<template>
  <div class="index-container">
    <header>
      <p class="title">项目列表</p>
      <el-button size="medium" icon="el-icon-plus" type="primary" @click.stop="showDialog = true">
        创建项目
      </el-button>
    </header>
    <main>
      <div v-if="list.length" class="project-list">
        <div v-for="(item, index) in list" :key="index" class="project-box">
          <section class="header">
            <div class="clickable">
              <p class="p_name-box">
                <span class="icon"></span>
                <span class="p_name">{{ item.p_name }}</span>
              </p>
              <div class="right-area">
                <el-button type="primary" plain @click.stop="goto(`/issue/list?p_id=${item.p_id}`)">
                  查看详情
                </el-button>
                <el-dropdown trigger="click" @command="handleCommand">
                  <i class="more el-icon-more"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="item.p_id">删除项目</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <p class="p_desc">{{ item.p_desc }}</p>
          </section>
          <section :id="`p_id_${item.p_id}`" class="chart"></section>
          <p class="tips">*最近24小时的数据</p>
        </div>
      </div>
      <el-empty v-else description="暂无项目"></el-empty>
    </main>
    <el-dialog title="新建项目" width="40%" :visible.sync="showDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="p_name">
          <el-input
            v-model="form.p_name"
            maxlength="15"
            placeholder="请填写项目名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth" prop="p_desc">
          <el-input
            v-model="form.p_desc"
            maxlength="50"
            placeholder="请填写项目描述 (可选)"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="技术选型" :label-width="formLabelWidth" prop="p_tech">
          <el-select v-model="form.p_tech" placeholder="请选择">
            <el-option
              v-for="(item, index) in techList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
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
  import { createProject, deleteProject } from '@/api/projects'
  export default {
    name: 'Index',
    data() {
      return {
        showDialog: false,
        btnLoading: false,
        formLabelWidth: '120px',
        form: {
          p_name: '',
          p_desc: '',
          p_tech: 'JavaScript',
        },
        rules: {
          p_name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            {
              min: 4,
              max: 15,
              message: '长度在 4 到 15 个字符',
              trigger: 'blur',
            },
          ],
        },
        techList: ['JavaScript', 'Vue', 'React', 'Angular', '小程序'],
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
                120, 200, 150, 80, 70, 110, 0, 120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80,
                70, 110, 0, 120, 70, 110,
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
        this.option.xAxis.data.length = []
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
      closeDialog() {
        this.$refs.form.resetFields()
        this.showDialog = false
      },
      confirm() {
        this.$refs.form
          .validate()
          .then(() => {
            this.btnLoading = true
            createProject(this.form)
              .then((res) => {
                if (res.code === 200) {
                  this.$baseMessage(`创建成功!`, 'success')
                  this.closeDialog()
                  setTimeout(() => {
                    this.fetchData()
                  }, 1500)
                } else {
                  this.$baseLoading(res.message, 'error')
                }
              })
              .finally(() => {
                this.btnLoading = false
              })
          })
          .catch(() => {})
      },
      goto(path) {
        this.$router.push(path)
      },
      handleCommand(p_id) {
        this.$baseConfirm('确定要删除整个项目吗?!', 'Warning', () => {
          const Loading = this.$baseLoading()
          deleteProject(p_id)
            .then((res) => {
              if (res.code === 200) {
                this.$baseMessage('删除成功', 'success')
                setTimeout(() => {
                  this.fetchData()
                }, 1500)
              } else {
                this.$baseMessage(res.message, 'error')
              }
            })
            .finally(() => {
              Loading.close()
            })
        })
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
          // width: 480px;
          width: 430px;
          min-width: 430px;
          margin-right: 25px;
          margin-bottom: 25px;
          word-break: break-all;
          .header {
            position: relative;
            top: 0;
            padding: 20px 10px 20px 20px;
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
            .right-area {
              position: relative;
              top: 0;
              .more {
                margin-left: 10px;
                cursor: pointer;
                color: #999;
                transform-origin: center;
                transform: rotate(90deg);
              }
            }
            .p_desc {
              max-width: 370px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
              color: rgb(149, 134, 165);
              height: 16px;
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
