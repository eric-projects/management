import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import styles from './component.process-group.module.less';
import { ProcessBox } from '../ProcessBox';
import { ProcessGroupDto } from './types';
import { ProcessDto } from '@/services/process';

@Component({
  components: { ProcessBox },
})
export class ProcessGroup extends Vue {
  @Prop({ default: () => [] }) data!: ProcessGroupDto[];

  @Emit('favorite-enable')
  private onFavoriteEnable() {}

  @Emit('favorite-disable')
  private onFavoriteDsiable() {}

  private getSlicedProcesses(processes: ProcessDto[]): ProcessDto[][] {
    const result: ProcessDto[][] = [];
    const glen = Math.ceil(processes.length / 3);
    for (let index = 0; index < glen; index++) {
      const nowIndex = index * 3;
      result.push(processes.slice(nowIndex, nowIndex + 3));
    }

    return result;
  }

  render() {
    return (
      <div>
        {this.data.map((g, i) => (
          <div class={i + 1 < this.data.length && g.processes.length > 0 ? styles.box_group + ' mb-3 pb-3' : ''}>
            {g.level === 0 ? <h3 class='mb-2'>{g.groupName}</h3> : <h4 class='mb-2'>{g.groupName}</h4>}
            {this.getSlicedProcesses(g.processes).map(ps => (
              <a-row gutter={[16, 16]}>
                {ps.map(p => (
                  <a-col span={8} class={styles.aCol}>
                    <process-box data={p} on-favorite-enable={this.onFavoriteEnable} on-favorite-disable={this.onFavoriteDsiable} />
                  </a-col>
                ))}
              </a-row>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
