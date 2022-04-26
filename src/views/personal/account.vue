<template>
  <div class="container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname" maxlength="20" placeholder="可填写昵称"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" maxlength="20" placeholder="可填写邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="ruleForm.avatar" maxlength="100" placeholder="头像的网络地址"></el-input>
      </el-form-item>
      <el-form-item v-if="showAvatar" label="浏览">
        <img :src="ruleForm.avatar" alt="头像浏览" class="avatar" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { updateUserInfo } from '@/api/user'
  import { isEmail } from '@/utils/validate.js'
  export default {
    data() {
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (value && value.trim() === '') {
          this.ruleForm.email = ''
        } else if (value && value.trim() && isEmail(value)) {
          callback()
        } else {
          callback(new Error('请填写正确的邮箱地址'))
        }
      }
      let checkNickname = (rule, value, callback) => {
        if (value && value.trim() === '') {
          this.ruleForm.nickname = ''
        } else {
          callback()
        }
      }
      let checkAvatar = (rule, value, callback) => {
        if (!value) {
          this.showAvatar = false
          callback()
        } else if (value && value.trim() === '') {
          this.showAvatar = false
          this.ruleForm.checkAvatar = ''
        } else if (value.indexOf('http') === -1) {
          this.showAvatar = false
          callback(new Error('请输入正确网络地址'))
        } else {
          this.showAvatar = true
          callback()
        }
      }
      return {
        Loading: null,
        showAvatar: false,
        ruleForm: {
          username: '',
          nickname: '',
          email: '',
          avatar: '',
        },
        rules: {
          nickname: [{ validator: checkNickname, trigger: 'blur' }],
          email: [{ validator: checkEmail, trigger: 'blur' }],
          avatar: [{ validator: checkAvatar, trigger: 'blur' }],
        },
      }
    },
    created() {
      const { username, nickname, email, avatar } = this.$store.getters['user/getUserInfo']
      this.fillInUserInfo({
        username,
        nickname,
        email,
        avatar: avatar === 'static/img/default_avatar.43ee69f8.jpeg' ? '' : avatar,
      })
    },
    methods: {
      fillInUserInfo(data) {
        this.ruleForm = { ...this.ruleForm, ...data }
        if (this.ruleForm.avatar.indexOf('http') !== -1) {
          this.showAvatar = true
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateInfo()
          } else {
            return false
          }
        })
      },
      updateInfo() {
        const Loading = this.$baseLoading()
        const { nickname = '', email = '', avatar = '' } = this.ruleForm
        updateUserInfo({ nickname, email, avatar })
          .then((res) => {
            if (res.code === 200) {
              this.$baseMessage(res.message, 'success')
              this.fillInUserInfo(res.data)
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
  .avatar {
    display: block;
    width: 100px;
  }
</style>
