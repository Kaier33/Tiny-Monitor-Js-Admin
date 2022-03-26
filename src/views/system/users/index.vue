<template>
  <div class="container">
    <header>
      <h4>成员管理</h4>
      <span>共 {{ list.length }} 名</span>
    </header>
    <main>
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column
          align="center"
          type="index"
          width="180"
          label="序号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="账号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="nickname"
          label="昵称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="email"
          label="邮箱"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning "
              plain
              disabled
              size="small"
              @click="handleClick(scope.row)"
            >
              冻结
            </el-button>
            <el-button type="danger" plain disabled size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>
<script>
  import { getUserList } from '@/api/user'
  export default {
    data() {
      return {
        list: [],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      handleClick(row) {},
      getData() {
        const Loading = this.$baseLoading()
        getUserList().then((res) => {
          this.list = res.data.list || []
          Loading.close()
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .container {
    position: relative;
    top: 0;
    padding: 10px;
    header {
      display: flex;
      align-items: flex-end;
      line-height: 20px;
      h4 {
        font-size: 20px;
        margin: 0;
      }
      span {
        line-height: 16px;
        font-size: 14px;
        margin-left: 10px;
      }
    }
    main {
      margin: 40px 20px;
    }
  }
</style>
