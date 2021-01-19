import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './component.user-info-view.module.less';
import { CustomIcon } from '@/components';
import { userInfoViewService } from './service';
import { PopoverDataDto } from './types';

@Component({
  components: { CustomIcon },
})
export class UserInfoView extends Vue {
  @Prop() title!: string;
  @Prop() value!: string;

  private popoverData!: PopoverDataDto;
  private visible = false;
  private loading = false;

  private handleClickChange(visible: boolean) {
    this.visible = visible;
    if (visible) {
      this.loading = true;
      userInfoViewService.getUserInfo(this.value).subscribe(data => {
        this.loading = false;
        this.popoverData = data;
        this.$forceUpdate();
      });
    }
  }

  private getTile() {
    return this.popoverData ? (
      <div class={styles.title}>
        <div class={styles.topic}>
          <span class={styles.name}>{this.popoverData.name}</span>
          <p>
            <span>{this.popoverData.positionLevelName}</span>
          </p>
        </div>
        <div class={styles.avatar_container}>
          <a-avatar src={this.popoverData.avatar} class={styles.avatar}>
            <custom-icon slot='icon' type='user' />
          </a-avatar>
        </div>
      </div>
    ) : (
      <a-skeleton />
    );
  }

  private getContent() {
    return this.popoverData ? (
      <div class={styles.content}>
        <p>
          <span>{this.$t('user.phone-number')}：</span>
          <span>{this.popoverData.phoneNumber}</span>
        </p>
        <p>
          <span>{this.$t('user.department-name')}：</span>
          <span>{this.popoverData.departmentName}</span>
        </p>
        <p>
          <span>{this.$t('user.email')}：</span>
          <span>{this.popoverData.email}</span>
        </p>
        <p>
          <span>{this.$t('user.organization')}：</span>
          <span>{this.popoverData.organizationPath}</span>
        </p>
      </div>
    ) : (
      <a-skeleton />
    );
  }
  render() {
    return (
      <span class={styles.sub_title}>
        {this.title}
        <a-popover
          placement='rightTop'
          trigger='click'
          visible={this.visible}
          overlayClassName={styles.offset_fix}
          on-visibleChange={this.handleClickChange}
          title={this.getTile()}
          content={this.getContent()}
          loading={this.loading}
        >
          <a-icon type='info-circle' theme='filled' />
        </a-popover>
      </span>
    );
  }
}
