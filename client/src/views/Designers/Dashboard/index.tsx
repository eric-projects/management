import { Component, Vue } from 'vue-property-decorator';

import styles from './dashboard.module.less';

@Component
export class Dashboard extends Vue {
  private jumpDesigner(type: string) {
    this.$router.push(`/designers/form-designer?preset-type=${type}`);
  }

  render() {
    return (
      <div>
        <a-card title={this.$t('designers.form-designer.name')}>
          <a-row type='flex' justify='center' align='top'>
            <a-col span={4} offset={1}>
              <a-card title={this.$t('designers.form-designer.presets.basic')} on-click={this.jumpDesigner.bind(this, 'basic')}>
                <a-skeleton />
              </a-card>
            </a-col>
            <a-col span={4} offset={1}>
              <a-card title={this.$t('designers.form-designer.presets.master')} on-click={this.jumpDesigner.bind(this, 'master')}>
                <a-skeleton />
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </div>
    );
  }
}
