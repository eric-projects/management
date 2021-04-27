import { Component, Vue } from 'vue-property-decorator';

import { formHelper, guidHelper, notificationHelper } from '@/common/utils';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { from, Observable } from 'rxjs';

@Component
export class CompFormBox extends Vue {
  private form!: WrappedFormUtils;

  validate(): Observable<void> {
    return from(
      new Promise((resolve: (value: void) => void, reject: (value: void) => void) => {
        const msgs = formHelper.validateForm(this.form);
        if (msgs.length > 0) {
          notificationHelper.error(msgs);
          reject();
        } else {
          resolve();
        }
      })
    );
  }

  resetFormId() {
    this.form = this.$form.createForm(this, { name: guidHelper.generate() });
  }

  created() {
    this.resetFormId();
  }

  render() {
    return <a-form form={this.form}>{this.$slots.default}</a-form>;
  }
}
