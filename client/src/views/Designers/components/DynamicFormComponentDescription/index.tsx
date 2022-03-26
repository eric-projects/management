import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './dynamic-form-component-description.module.less';
import { CustomIcon } from '@/components';
import { FormComponentType } from '../types';

@Component({
  components: { CustomIcon }
})
export class DynamicFormComponentDescription extends Vue {
  @Prop() type!: FormComponentType;
  @Prop() name!: string;

  render() {
    return (
      <div class={styles.block}>
        <custom-icon type={this.type} />
        <p>{this.name}</p>
      </div>
    );
  }
}
