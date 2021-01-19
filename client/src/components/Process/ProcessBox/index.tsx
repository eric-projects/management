import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import styles from './component.process-box.module.less';
import { CustomIcon } from '../../CustomIcon';
import { ProcessDto } from '@/services/process';
import { processBoxService } from './service';

@Component({
  components: { CustomIcon },
})
export class ProcessBox extends Vue {
  @Prop() data!: ProcessDto;

  @Emit('favorite-enable')
  private onFavoriteEnable(id: string): string {
    return id;
  }

  @Emit('favorite-disable')
  private onFavoriteDsiable(id: string): string {
    return id;
  }

  private onFavorite() {
    processBoxService.setFavorite(this.data.id).subscribe(() => {
      this.data.isFavorite = !this.data.isFavorite;
      if (this.data.isFavorite) {
        this.onFavoriteEnable(this.data.id);
      } else {
        this.onFavoriteDsiable(this.data.id);
      }
    });
  }

  render() {
    return (
      <div class={`${styles.container}`}>
        <custom-icon type={this.data.isFavorite ? 'favorite' : 'favorite-copy'} on-click={this.onFavorite} class={styles.pointer} />
        <router-link to={`/start?process-id=${this.data.id}`} class={styles.link}>
          {this.data.name}
        </router-link>
        <a-icon type='info-circle' theme='filled' class={styles.info} />
      </div>
    );
  }
}
