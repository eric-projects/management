import { Component, Vue } from 'vue-property-decorator';

import styles from './component.proxy.module.less';
import { FormHelper } from '@/common/utils';
import { ValueLabelPair } from '@/common/defines';
import { authService } from '@/services/auth';
import { UserTreeSelect } from '../../OrganizationUser/UserTreeSelect';
import { proxyService } from './service';

@Component({
  components: { UserTreeSelect },
})
export class Proxy extends Vue {
  private formHelper = new FormHelper();
  private users: ValueLabelPair[] = [];
  private userStr = '';
  private enabled = false;

  created() {
    proxyService.getAgents().subscribe(s => {
      this.users = s.users;
      this.enabled = s.enabled;
    });
  }

  getFormData(): Promise<any> {
    return new Promise((resolve, reject) => {
      proxyService.updateAgent({ users: this.users, enabled: this.enabled }).subscribe(
        () => {
          resolve();
        },
        error => {
          reject();
        }
      );
    });
  }

  render() {
    return (
      <div>
        <a-row>
          <a-col span='20'>
            <a-form-item label={this.$t('authorization-helper.current-user')} label-col={{ span: 5 }} wrapper-col={{ span: 19 }}>
              <span class='ant-form-text'>{authService.user.name}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span='20'>
            {this.formHelper
              .validate(
                this.userStr,
                this.$l.getLocale(['components.select', 'framework.prepositions.space', 'authorization-helper.my-angents'])
              )
              .touch(validation => (
                <a-form-item
                  label={this.$t('authorization-helper.my-angents')}
                  label-col={{ span: 5 }}
                  wrapper-col={{ span: 19 }}
                  required={true}
                  validateStatus={validation.validateStatus}
                  help={validation.help}
                >
                  <user-tree-select
                    value={this.users}
                    on-change={(value: ValueLabelPair[]) => {
                      this.users = value;
                      this.userStr = this.users
                        .map(m => {
                          return m.value;
                        })
                        .join(';');
                    }}
                  />
                </a-form-item>
              ))}
          </a-col>
        </a-row>
        <a-row>
          <a-col span='20'>
            <a-form-item label={this.$t('authorization-helper.enable')} label-col={{ span: 5 }} wrapper-col={{ span: 19 }}>
              <a-switch
                checked={this.enabled}
                on-change={(checked: boolean) => {
                  this.enabled = checked;
                }}
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    );
  }
}
