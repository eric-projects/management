import { Component, Vue, Emit } from 'vue-property-decorator';
import { interval, Subscription } from 'rxjs';

import { guidHelper } from '@/common/utils';
import { loginCaptchaService } from './service';

@Component
export class LoginCaptcha extends Vue {
  private imgData = '';
  private timer!: Subscription;
  @Emit('load') onLoad(nonce: string) {}

  getCaptcha() {
    if (this.timer) {
      this.timer.unsubscribe();
    }

    const nonce = guidHelper.generate();
    this.onLoad(nonce);
    loginCaptchaService.getCaptchaBase64String(nonce).subscribe(s => {
      this.imgData = s;
      this.timingCaptcha();
    });
  }

  private timingCaptcha() {
    this.timer = interval(59000).subscribe(s => {
      this.getCaptcha();
    });
  }

  created() {
    this.getCaptcha();
  }

  destroyed() {
    this.timer.unsubscribe();
  }

  render() {
    return (
      <div style='display: flex;align-items: center;'>
        <img src={this.imgData} alt='captcha' />
        <span style='cursor: pointer;margin-left:5px;flex:0 0 43px;user-select:none;' on-click={this.getCaptcha}>
          {this.$t('boost.layout.login.form.code-change')}
        </span>
      </div>
    );
  }
}
