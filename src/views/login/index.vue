<template>
  <div class="login-container">
    <canvas id="canvas"></canvas>
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent">占位符,不要删</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
        >
          <!-- <div class="title">(ﾉ>ω&lt;)ﾉ</div> -->
          <div class="title-tips">Welcome to {{ title }} ！</div>
          <el-form-item style="margin-top: 40px" prop="username">
            <span class="svg-container svg-container-admin">
              <vab-icon :icon="['fas', 'user']" />
            </span>
            <el-input
              v-model.trim="form.username"
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <vab-icon :icon="['fas', 'lock']" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :type="passwordType"
              tabindex="2"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
            />
            <span
              v-if="passwordType === 'password'"
              class="show-password"
              @click="handlePassword"
            >
              <vab-icon :icon="['fas', 'eye-slash']"></vab-icon>
            </span>
            <span v-else class="show-password" @click="handlePassword">
              <vab-icon :icon="['fas', 'eye']"></vab-icon>
            </span>
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            登录
          </el-button>
          <!-- <router-link to="/register"> -->
          <div
            class="router_link"
            style="margin-top: 20px"
            @click.stop="goto('/register')"
          >
            注册
          </div>
          <!-- </router-link> -->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { isPassword } from '@/utils/validate'

  export default {
    name: 'Login',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.animation) {
        let cancelAnimationFrame =
          window.cancelAnimationFrame || window.mozCancelAnimationFrame
        cancelAnimationFrame(this.animation)
      }
      next()
    },
    data() {
      const validateusername = (rule, value, callback) => {
        if ('' == value) {
          callback(new Error('用户名不能为空'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      }
      return {
        nodeEnv: process.env.NODE_ENV,
        title: this.$baseTitle,
        form: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateusername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        animation: null,
      }
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    created() {
      document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto'
    },
    mounted() {
      this.initCanvas()
    },
    methods: {
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('user/login', this.form)
              .then(() => {
                const routerPath =
                  this.redirect === '/404' || this.redirect === '/401'
                    ? '/'
                    : this.redirect
                this.$router.push(routerPath).catch(() => {})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
      maxOrbit(x, y) {
        let max = Math.max(x, y),
          diameter = Math.round(Math.sqrt(max * max + max * max))
        return diameter / 2
      },
      random(min, max) {
        if (arguments.length < 2) {
          max = min
          min = 0
        }
        if (min > max) {
          var hold = max
          max = min
          min = hold
        }
        return Math.floor(Math.random() * (max - min + 1)) + min
      },
      initCanvas() {
        const self = this
        let canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d'),
          w = (canvas.width = window.innerWidth),
          h = (canvas.height = window.innerHeight),
          hue = 217,
          stars = [],
          count = 0,
          maxStars = 1400

        let canvas2 = document.createElement('canvas'),
          ctx2 = canvas2.getContext('2d')
        canvas2.width = 100
        canvas2.height = 100

        let half = canvas2.width / 2,
          gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
        gradient2.addColorStop(0.025, '#fff')
        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
        gradient2.addColorStop(1, 'transparent')

        ctx2.fillStyle = gradient2
        ctx2.beginPath()
        ctx2.arc(half, half, half, 0, Math.PI * 2)
        ctx2.fill()

        const Star = function () {
          this.orbitRadius = self.random(w / 2 - 50)
          this.radius = self.random(100, this.orbitRadius) / 10
          this.orbitX = w / 2
          this.orbitY = h / 2
          this.timePassed = self.random(0, maxStars)
          this.speed = self.random(this.orbitRadius) / 900000
          this.alpha = self.random(2, 10) / 10
          count++
          stars[count] = this
        }
        Star.prototype.draw = function () {
          let x =
              Math.sin(this.timePassed + 1) * this.orbitRadius + this.orbitX,
            y =
              (Math.cos(this.timePassed) * this.orbitRadius) / 2 + this.orbitY,
            twinkle = self.random(10)
          if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05
          } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05
          }
          ctx.globalAlpha = this.alpha
          ctx.drawImage(
            canvas2,
            x - this.radius / 2,
            y - this.radius / 2,
            this.radius,
            this.radius
          )
          this.timePassed += this.speed
        }
        for (var i = 0; i < maxStars; i++) {
          new Star()
        }
        function animation() {
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 0.8
          ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)'
          ctx.fillRect(0, 0, w, h)
          ctx.globalCompositeOperation = 'lighter'
          for (var i = 1, l = stars.length; i < l; i++) {
            stars[i].draw()
          }
          self.animation = window.requestAnimationFrame(animation)
        }
        animation()
      },
      goto(route) {
        this.$router.push(route)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    position: relative;
    top: 0;
    z-index: 10;
    background: #060e1b;
    overflow: hidden;
    height: 100vh;
    // background: url('~@/assets/login_images/background.jpg') center center fixed no-repeat;
    // background-size: cover;

    .title {
      // font-size: 54px;
      font-size: 24px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);
    }

    .title-tips {
      margin-top: 30px;
      font-size: 26px;
      font-weight: 400;
      // color: rgba(14, 18, 26, 1);
      // color: rgba(78, 104, 185, 1);
      color: #5470c6;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .login-btn {
      display: inherit;
      width: 130px;
      height: 40px;
      margin-top: 15px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }
    }

    .login-form {
      position: relative;
      max-width: 100%;
      margin: calc((100vh - 425px) / 2) 10% 10%;
      overflow: hidden;

      .forget-password {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-pass {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      top: 14px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 58px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
  .router_link {
    display: inline-block;
    cursor: pointer;
    color: #5470c6;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;

    opacity: 0.7;
    width: 100%;
    height: 100%;
  }
</style>
