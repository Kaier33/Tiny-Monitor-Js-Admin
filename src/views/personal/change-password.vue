<template>
  <div class="container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldpass">
        <el-input v-model="ruleForm.oldpass" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { changePassword } from '@/api/user'
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'))
        } else if (value.length < 6) {
          callback(new Error('密码至少6位'))
        } else {
          callback()
        }
      }
      let validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码至少6位'))
        } else if (value === this.ruleForm.oldpass) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          oldpass: '',
          password: '',
          checkPass: '',
        },
        rules: {
          oldpass: [{ validator: validatePass, trigger: 'blur' }],
          password: [{ validator: validatePass1, trigger: 'blur' }],
          checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changePW()
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      changePW() {
        const Loading = this.$baseLoading()
        changePassword(this.ruleForm)
          .then((res) => {
            if (res.code === 200) {
              this.$baseMessage(res.message, 'success')
              setTimeout(async () => {
                await this.$store.dispatch('user/logout')
                this.$router.push('/login')
              }, 2000)
            } else {
              this.$baseMessage(res.message, 'error')
            }
          })
          .finally(() => {
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
    width: 40%;
    margin: 0 auto;
    margin-top: 5%;
  }
</style>
