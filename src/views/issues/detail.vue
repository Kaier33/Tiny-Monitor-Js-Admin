<template>
  <div class="issue-detail-container">
    <section class="error-info">
      <div class="flex-box">
        <p class="error-icon icon"></p>
        <p class="error-type">{{ resData.error_type }}</p>
      </div>
      <div class="tags">
        <div class="tag">
          <span>error_id:</span>
          <span>{{ resData.error_id }}</span>
        </div>
        <div class="tag">
          <span>date:</span>
          <span>{{ resData.exception_time | fmt_date }}</span>
        </div>
      </div>
      <p class="error-desc">{{ getErrorInfo() }}</p>
    </section>
    <section class="device-info">
      <div class="flex-box">
        <div class="browser-info">
          <div :class="`browser_icon icon ${getBrowserIcon()}`"></div>
          <div class="browser_version">
            <p>{{ (UA_Info.browser && UA_Info.browser.name) || 'unknown' }}</p>
            <p>
              version:
              <span>{{ (UA_Info.browser && UA_Info.browser.version) || 'unknown' }}</span>
            </p>
          </div>
        </div>
        <div class="system-info">
          <div :class="`system_icon icon ${getSystemIcon()}`"></div>
          <div class="system_verison">
            <p>{{ (UA_Info.os && UA_Info.os.name) || 'unknown' }}</p>
            <p>
              version:
              <span>{{ (UA_Info.os && UA_Info.os.version) || 'unknown' }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="tags">
        <div class="tag">
          <span>browser:</span>
          <span>
            {{ UA_Info.browser && `${UA_Info.browser.name} ${UA_Info.browser.version}` }}
          </span>
        </div>
        <div class="tag">
          <span>engine:</span>
          <span>
            {{ UA_Info.engine && `${UA_Info.engine.name} ${UA_Info.engine.version}` }}
          </span>
        </div>
        <div class="tag">
          <span>os:</span>
          <span>
            {{ UA_Info.os && `${UA_Info.os.name} ${UA_Info.os.version}` }}
          </span>
        </div>
        <div class="tag">
          <span>environment:</span>
          <span>{{ resData.environment }}</span>
        </div>
        <div class="tag">
          <span>user_id:</span>
          <span>{{ resData.user_id }}</span>
        </div>
        <div class="tag">
          <span>language:</span>
          <span>
            {{ resData.error_info && resData.error_info.deviceInfo.language }}
          </span>
        </div>
        <div class="tag">
          <span>ua:</span>
          <span>
            {{ resData.error_info && resData.error_info.deviceInfo.userAgent }}
          </span>
        </div>
        <div class="tag">
          <span>url:</span>
          <span>{{ resData.error_info && resData.error_info.url }}</span>
        </div>
      </div>
    </section>
    <section class="other-info">
      <div class="flex-box">
        <div class="screen-info">
          <div class="screen-icon icon"></div>
          <div class="flex-info">
            <p>
              <span>AvailHeight :</span>
              <span>{{ getScreenInfo('availHeight') }}</span>
            </p>
            <p>
              <span>AvailWidth :</span>
              <span>{{ getScreenInfo('availHeight') }}</span>
            </p>
            <p>
              <span>Height :</span>
              <span>{{ getScreenInfo('availHeight') }}</span>
            </p>
            <p>
              <span>Width :</span>
              <span>{{ getScreenInfo('availHeight') }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="ip-info">
          <div class="ip-icon icon"></div>
          <div class="flex-info">
            <p>
              <span>IP address :</span>
              <span>{{ getIPaddress() }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="cookie-info">
          <div class="cookie-icon icon"></div>
          <div class="flex-info">
            <p>
              <span>Cookie :</span>
              <span>{{ getCookie() }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="header-info">
          <div class="header-icon icon"></div>
          <div class="flex-info">
            <p class="flex-box">
              <span style="flex-shrink: 0">Header :</span>
              <span>{{ getHeader() }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- <br />
    <br />
    {{ logs() }} -->
  </div>
</template>
<script>
  import UAparse from 'ua-parser-js'
  import { formatDate } from '@/utils/tool'
  import { getErrorDetail } from '@/api/error'
  export default {
    name: 'IssueDetailContainer',
    filters: {
      fmt_date(time) {
        return formatDate('yyyy-MM-dd hh:mm:ss', new Date(Number(time)))
      },
    },
    data() {
      return {
        resData: {},
        UA_Info: {},
      }
    },
    created() {
      const { id } = this.$route.query
      if (!id) return
      const Loading = this.$baseLoading()
      getErrorDetail(id)
        .then((res) => {
          if (res.code === 200) {
            const { error_info, header } = res.data
            error_info && (res.data.error_info = JSON.parse(error_info))
            header && (res.data.header = JSON.parse(header))
            this.resData = res.data
            if (this.resData.error_info.deviceInfo.userAgent) {
              const parser = new UAparse()
              parser.setUA(this.resData.error_info.deviceInfo.userAgent)
              this.UA_Info = parser.getResult()
            }
            console.log('resData::', this.resData)
            // console.log('this.UA_Info::', this.UA_Info)
          } else {
            this.$baseMessage(res.message, 'error')
          }
        })
        .finally(() => {
          Loading.close()
        })
    },
    methods: {
      getBrowserIcon() {
        let icon = 'default_browse'
        if (this.UA_Info.browser && this.UA_Info.browser.name) {
          const name = this.UA_Info.browser.name.toLowerCase()
          switch (true) {
            case /chrome/.test(name):
            case /Chromium/.test(name):
              return 'chrome'
            case /safari/.test(name):
              return 'safari'
            case /edge/.test(name):
              return 'edge'
            case /firefox/.test(name):
              return 'firefox'
            case /ie/.test(name):
              return 'ie'
          }
        }
        return icon
      },
      getSystemIcon() {
        let icon = 'default_system'
        if (this.UA_Info.os && this.UA_Info.os.name) {
          const name = this.UA_Info.os.name.toLowerCase()
          switch (true) {
            case /mac/.test(name):
            case /ios/.test(name):
              return 'apple'
            case /android/.test(name):
              return 'android'
            case /window/.test(name):
              return 'windows'
          }
        }
        return icon
      },
      getErrorInfo() {
        if (this.resData.error_info && this.resData.error_info.errorInfo) {
          return JSON.stringify(this.resData.error_info.errorInfo)
        }
      },
      getScreenInfo(field) {
        if (
          this.resData.error_info &&
          this.resData.error_info.deviceInfo &&
          this.resData.error_info.deviceInfo.screen_info
        ) {
          return this.resData.error_info.deviceInfo.screen_info[field]
        } else {
          return 'Unknown'
        }
      },
      getIPaddress() {
        if (this.resData.ip) {
          return this.resData.ip.replace('::ffff:', '')
        } else {
          return 'Unknown'
        }
      },
      getHeader() {
        if (this.resData.header) {
          this.resData.header['user-agent'] && delete this.resData.header['user-agent']
          this.resData.header['cookie'] && delete this.resData.header['cookie']
          return JSON.stringify(this.resData.header)
        } else {
          return 'Unknown'
        }
      },
      getCookie() {
        return this.resData.cookie || 'Unknown'
      },
      logs() {
        return (
          JSON.stringify(this.resData) +
          '________________________________________________________*********************************************_______________________________________________*********************************************' +
          JSON.stringify(this.UA_Info)
        )
      },
    },
  }
</script>
<style lang="scss" scoped>
  p {
    margin: 0;
  }
  section {
    position: relative;
    top: 0;
    border-radius: 8px;
    background: #fff;
    box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.1);
  }
  .flex-box {
    display: flex;
    align-items: center;
  }
  .flex-info {
    display: flex;
    align-items: center;
    & > p {
      margin-right: 20px;
      & > span:first-child {
        font-weight: 600;
        margin-right: 10px;
      }
      & > span:last-child {
        color: #5470c6;
      }
    }
  }
  .tag {
    overflow: hidden;
    height: 24px;
    margin: 4px 6px;
    line-height: 22px;
    background-color: #eef1f9;
    border: 1px solid #dde2f4;
    color: #5470c6;
    font-size: 12px;
    color: #5470c6;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    display: inline-flex;
    align-content: center;
    & > span:first-child {
      background-color: #fff;
      color: #2f2936;
      padding: 0 8px;
    }
    & > span:last-child {
      padding: 0 8px;
    }
  }
  .icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }
  .issue-detail-container {
    padding: 20px 10px 20px 10px !important;
    margin: 0 !important;
    background: #f5f7f8 !important;
  }
  .error-info {
    margin-bottom: 40px;
    padding: 20px 10px;
    .error-icon {
      background: url('../../assets/icons/error.png') no-repeat;
      background-position: center;
      background-size: 100% 100%;
      margin-right: 15px;
    }
    .error-type {
      font-size: 20px;
      font-weight: 600;
    }
    .error-desc {
      position: relative;
      top: 0;
      padding: 0 10px;
      line-height: 30px;
      font-weight: 600;
      font-size: 26px;
    }
    .tags {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .device-info {
    padding: 20px 10px;
    margin-bottom: 40px;
    .browser-info,
    .system-info {
      display: flex;
      align-items: center;
      margin-right: 60px;
      .browser_icon,
      .system_icon {
        background-position: center !important;
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        margin-right: 15px;
      }
      .system_verison,
      .browser_version {
        font-size: 16px;
        line-height: 18px;
        font-weight: 600;
        span {
          font-size: 13px;
          font-weight: normal;
        }
      }
    }
    .tags {
      margin-top: 10px;
    }
  }
  .other-info {
    padding: 20px 10px;
    .screen-info {
      display: flex;
      align-items: center;
      .screen-icon {
        margin-right: 15px;
        background: url('../../assets/icons/screen.png') no-repeat center / 100% 100%;
      }
    }
    .ip-info {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .ip-icon {
        margin-right: 15px;
        background: url('../../assets/icons/IP.png') no-repeat center / 100% 100%;
      }
    }
    .cookie-info {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .cookie-icon {
        margin-right: 15px;
        background: url('../../assets/icons/cookies.png') no-repeat center / 100% 100%;
      }
    }
    .header-info {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .header-icon {
        margin-right: 15px;
        background: url('../../assets/icons/header.png') no-repeat center / 100% 100%;
      }
    }
  }

  .default_browse {
    background: url('../../assets/icons/default_browse.png');
  }
  .safari {
    background: url('../../assets/icons/safari.png');
  }
  .chrome {
    background: url('../../assets/icons/chrome.png');
  }
  .edge {
    background: url('../../assets/icons/Edge.png');
  }
  .firefox {
    background: url('../../assets/icons/firefox.png');
  }
  .ie {
    background: url('../../assets/icons/ie.png');
  }
  // .MicroMessenger {}
  // .qqbrowser{}

  .default_system {
    background: url('../../assets/icons/default_system.png');
  }
  .android {
    background: url('../../assets/icons/Android.png');
  }
  .apple {
    background: url('../../assets/icons/apple.png');
  }
  .windows {
    background: url('../../assets/icons/windows.png');
  }
</style>
