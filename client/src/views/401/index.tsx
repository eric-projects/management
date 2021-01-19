import { Component, Vue } from 'vue-property-decorator';

import styles from './401.module.less';
import { authService } from '@/services/auth';

@Component
export class UnAuthorized extends Vue {
  private getRootPathUrl() {
    return `${window.location.protocol}//${window.location.host}`;
  }

  render() {
    return (
      <div class={styles.container}>
        <p class={styles.title}>401</p>
        <div class={styles.detail}>
          你没有权限访问，
          <a href='/'>回到首页</a> 或 <a href={authService.logoutUri + `?url=${this.getRootPathUrl()}`}>退出</a>
        </div>
      </div>
    );
  }
}
