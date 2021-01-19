import { Component, Vue, Emit, Prop, Watch } from 'vue-property-decorator';

import styles from './component.user-transfer.module.less';
import { TreeItem, UserItemDto } from '../types';
import { UserTree } from '../UserTree';
import { organizationUserService } from '../service';

@Component({ components: { UserTree } })
export class UserTransfer extends Vue {
  @Prop({ default: true }) multiple!: boolean;
  @Prop() value!: UserItemDto[];

  private selectedUsers: TreeItem[] = [];
  private searchUsers: TreeItem[] | undefined = undefined;
  private timer: any;
  private spinning = false;

  @Emit('select') onSelect(value: UserItemDto[] | UserItemDto | undefined) {}

  @Watch('value') onValueChange(v: UserItemDto[]) {
    this.initSelectValue();
  }

  private updateSelectedUsers(data: TreeItem, deleteIndex?: number) {
    const item = this.selectedUsers.find(f => f.value === data.value);
    if (data && (!item || (item && deleteIndex !== undefined))) {
      if (this.multiple) {
        deleteIndex !== undefined ? (this.selectedUsers || []).splice(deleteIndex, 1) : this.selectedUsers.push(data);
      } else {
        // this.selectedUsers = [data];
        deleteIndex !== undefined ? (this.selectedUsers || []).splice(deleteIndex, 1) : this.selectedUsers = [data];
      }
    }

    const transUserData = this.selectedUsers.map(m => ({ userId: m.value + '', userName: m.datum.label || m.title, datum: m }));
    this.onSelect(this.multiple ? transUserData : transUserData.length > 0 ? transUserData[0] : transUserData);
  }

  private onSearch(wk: string) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      if (!wk) {
        this.searchUsers = undefined;
        this.$forceUpdate();
      } else {
        this.spinning = true;
        organizationUserService.searchUsers(wk).subscribe(s => {
          this.searchUsers = s;
          this.$forceUpdate();
          this.spinning = false;
        });
      }
    }, 600);
  }

  private initSelectValue() {
    this.selectedUsers = [];
    (this.value || []).map(m => {
      if (m.datum) {
        this.selectedUsers.push(m.datum);
      } else {
        this.selectedUsers.push({
          id: m.userId + '',
          value: m.userId + '',
          title: m.userName + '',
          datum: { value: m.userId, title: m.userName },
        });
      }
    });
  }

  created() {
    this.initSelectValue();
  }

  render(): JSX.Element {
    return (
      <div class={styles.userTransfer}>
        <a-transfer
          showSearch
          listStyle={{ width: '274px' }}
          dataSource={[]}
          scopedSlots={{
            children: (value: { props: { direction: string } }) => {
              if (value.props.direction === 'right') {
                return this.selectedUsers.map((m, i) => {
                  return (
                    <div>
                      <a-icon class='mr-1' type='user' />
                      {m.title}
                      <a-icon
                        type='close'
                        on-click={() => {
                          this.updateSelectedUsers(m, i);
                        }}
                      />
                    </div>
                  );
                });
              } else {
                return (
                  <a-spin spinning={this.spinning}>
                    {this.searchUsers ? (
                      this.searchUsers.map(m => {
                        return (
                          <div
                            style='padding:5px;cursor: pointer;white-space: nowrap;'
                            on-click={() => {
                              this.updateSelectedUsers(m);
                            }}
                          >
                            <a-icon type='user' /> {m.title}
                          </div>
                        );
                      })
                    ) : (
                      <user-tree
                        multiple={this.multiple}
                        on-change={(v: TreeItem) => {
                          this.updateSelectedUsers(v);
                        }}
                      />
                    )}
                  </a-spin>
                );
              }
            },
          }}
          on-search={(direction: 'left' | 'right', value: string) => {
            this.onSearch(value);
          }}
        />
      </div>
    );
  }
}
