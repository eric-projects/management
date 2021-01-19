import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import styles from './component.favorite-processes.module.less';
import { ProcessGroup } from '../ProcessGroup';
import { ProcessGroupDto } from '../ProcessGroup/types';

@Component({
  components: { ProcessGroup }
})
export class FavoriteProcesses extends Vue {
  @Prop({ default: () => [] }) data!: ProcessGroupDto[];

  @Emit('favorite-enable')
  private onFavoriteEnable() {}

  @Emit('favorite-disable')
  private onFavoriteDsiable() {}

  render() {
    return <process-group data={this.data} on-favorite-enable={this.onFavoriteEnable} on-favorite-disable={this.onFavoriteDsiable} />;
  }
}
