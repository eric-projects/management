import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { getComponentFromProp } from '@/common/utils';
import styles from './component.table-header.module.less';

@Component
export class CompTableHeader extends Vue {
  @Prop() advanced!: boolean;
  pageActions: string[] = [];
  private _advanced = false;

  created() {}

  @Emit('search') onSearch() {}
  @Emit('reset') onReset() {}
  render() {
    const baseSearchDom = getComponentFromProp(this, 'base');
    const moreSearchDom = getComponentFromProp(this, 'more');
    return (
      <div class={styles.condition + ' bg-primary-0'}>
        <a-row justify='space-between'>
          <a-col span='18'>{baseSearchDom}</a-col>
          <a-col span='6' class={styles.float_button}>
            <a-row>
              {this.advanced ? (
                <a-col span='6'>
                  <a-button
                    type='link'
                    on-click={() => {
                      this._advanced = !this._advanced;
                      this.$forceUpdate();
                    }}
                  >
                    高级筛选 <a-icon type={this._advanced ? 'up' : 'down'} />
                  </a-button>
                </a-col>
              ) : null}
              <a-col span='18' style='float:right'>
                <a-button-group>
                  <a-button
                    size='middle'
                    type='primary'
                    icon='search'
                    on-click={() => {
                      this.onSearch();
                    }}
                  >
                    查询
                  </a-button>
                  <a-button
                    size='middle'
                    icon='reload'
                    on-click={() => {
                      this.onReset();
                    }}
                  >
                    重置
                  </a-button>
                </a-button-group>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        {this._advanced ? <div class='mt-2'>{moreSearchDom} </div> : null}
      </div>
    );
  }
}
