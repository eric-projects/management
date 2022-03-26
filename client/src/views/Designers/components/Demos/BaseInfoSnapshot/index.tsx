import { Component, Vue } from 'vue-property-decorator';

@Component
export class BaseInfoSnapshot extends Vue {
  render() {
    return (
      <div>
        <a-row>
          <a-col span='20'>
            <a-form-item label={this.$t('instance.base-info.topic')} label-col={{ span: 5 }} wrapper-col={{ span: 19 }}>
              <span class='ant-form-text'>{`<${this.$t('instance.base-info.topic')}>`}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span='8'>
            <a-row>
              <a-col span='18' offset='5'>
                <a-form-item label={this.$t('instance.base-info.start-user')} label-col={{ span: 10 }} wrapper-col={{ span: 14 }}>
                  <span class='ant-form-text'>{`<${this.$t('instance.base-info.start-user')}>`}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col span='12'>
            <a-form-item label={this.$t('instance.base-info.organization')} label-col={{ span: 6 }} wrapper-col={{ span: 18 }}>
              <span class='ant-form-text'>{`<${this.$t('instance.base-info.organization')}>`}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span='8'>
            <a-row>
              <a-col span='18' offset='5'>
                <a-form-item label={this.$t('instance.base-info.start-user-position')} label-col={{ span: 10 }} wrapper-col={{ span: 14 }}>
                  <span class='ant-form-text'>{`<${this.$t('instance.base-info.start-user-position')}>`}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col span='12'>
            <a-form-item label={this.$t('instance.base-info.start-time')} label-col={{ span: 6 }} wrapper-col={{ span: 18 }}>
              <span class='ant-form-text'>{`<${this.$t('instance.base-info.start-time')}>`}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    );
  }
}
