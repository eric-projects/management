import { Component, Vue } from 'vue-property-decorator';

import styles from './login.module.less';
import banner from '@/assets/images/content_box.png';
import { LoginCaptcha } from '@/components';
import { authService } from '@/services/auth';
import { commonService } from '@/services/common';

@Component({
  components: { LoginCaptcha },
})
export class Login extends Vue {
  private account = '';
  private password = '';
  private code = '';
  private nonce = '';

  login() {
    authService.login(this.account, this.password, this.nonce, this.code).subscribe(
      () => {
        const refererUrl = this.$route.query['referer'] as string;
        this.$router.push(refererUrl || '/');
      },
      () => {
        (this.$refs.captcha as LoginCaptcha).getCaptcha();
      }
    );
  }

  render() {
    return (
      <div class={styles.container}>
        <div class={styles.main_view}>
          <div class={styles.banner_container}>
            <img class={styles.logo} src={commonService.logo} alt='logo' />
            <img class={styles.banner} src={banner} alt='banner' />
            <p class={styles.copyright}>{this.$t('copyright')}</p>
          </div>
          <a-form class={styles.form}>
            <div class={styles.title}>
              <label>{this.$t('boost.layout.login.form.title')}</label>
            </div>
            <div class={styles.sub_title}>
              <label>{this.$t('boost.layout.login.form.user-title')}</label>
            </div>
            <a-form-item>
              <a-input
                defaultValue=''
                scopedSlots={{
                  prefix: () => (
                    <span class={styles.prefix}>
                      <a-icon type='user' />
                      <span class={styles.prompt}>{this.$t('boost.layout.login.form.user-input')}</span>
                    </span>
                  ),
                }}
                on-change={(e: any) => {
                  this.account = e.target.value;
                }}
              />
            </a-form-item>
            <a-form-item>
              <a-input-password
                defaultValue=''
                scopedSlots={{
                  prefix: () => (
                    <span class={styles.prefix}>
                      <a-icon type='lock' />
                      <span class={styles.prompt}>{this.$t('boost.layout.login.form.psd-input')}</span>
                    </span>
                  ),
                }}
                on-change={(e: any) => {
                  this.password = e.target.value;
                }}
              />
            </a-form-item>
            <a-form-item>
              <a-input
                defaultValue=''
                scopedSlots={{
                  prefix: () => (
                    <span class={styles.prefix}>
                      <a-icon type='safety-certificate' />
                      <span class={styles.prompt}> {this.$t('boost.layout.login.form.code')}</span>
                    </span>
                  ),
                  suffix: () => (
                    <login-captcha
                      ref='captcha'
                      on-load={(nonce: string) => {
                        this.nonce = nonce;
                      }}
                    />
                  ),
                }}
                on-change={(e: any) => {
                  this.code = e.target.value;
                }}
              />
            </a-form-item>
            <a-form-item>
              <a-button type='primary' on-click={this.login} class={styles.login_button}>
                {this.$t('boost.layout.login.form.login-btn')}
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class={styles.right_cover}>
          <div class={styles.mask} />
        </div>
      </div>
    );
  }
}
