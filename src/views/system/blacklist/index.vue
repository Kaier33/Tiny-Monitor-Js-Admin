<template>
  <div class="container">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="180"></el-table-column>
      <el-table-column prop="p_id" label="项目id" width="180"></el-table-column>
      <el-table-column prop="p_name" label="项目名称"></el-table-column>
      <el-table-column prop="p_desc" label="项目简述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" plain @click="handleClick(scope.row)">
            启用
          </el-button>
          <el-button type="danger" size="small" plain>拦截</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getProjectList } from '@/api/projects'
  export default {
    data() {
      return {
        tableData: [
          {
            date: '2016-05-02',
            p_name: '王小虎',
            p_desc: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            p_id: 200333,
            tag: '家',
          },
          {
            date: '2016-05-04',
            p_name: '王小虎',
            p_desc: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1517 弄',
            p_id: 200333,
            tag: '公司',
          },
          {
            date: '2016-05-01',
            p_name: '王小虎',
            p_desc: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1519 弄',
            p_id: 200333,
            tag: '家',
          },
          {
            date: '2016-05-03',
            p_name: '王小虎',
            p_desc: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1516 弄',
            p_id: 200333,
            tag: '公司',
          },
          {
            date: '2016-05-02',
            p_name: '王小虎',
            p_desc: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            p_id: 200333,
            tag: '家',
          },
        ],
        Loading: null,
      }
    },
    created() {
      // this.Loading = this.$baseLoading()
      // getProjectList()
      //   .then((res) => {
      //     if (res.code === 200) {
      //     } else {
      //       this.$baseLoading(res.message, 'error')
      //     }
      //   })
      //   .finally(() => {
      //     this.Loading.close()
      //   })
    },
    methods: {
      handleClick(row) {},
    },
  }
</script>
<style lang="scss" scoped>
  .container {
    position: relative;
    top: 0;
    padding: 10px;
  }
</style>
