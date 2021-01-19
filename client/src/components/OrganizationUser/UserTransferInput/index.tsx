import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Modal } from 'ant-design-vue';
import { UserTransfer } from '../UserTransfer';
import { UserItemDto } from '../types';

@Component({
  components: { UserTransfer },
})
export class UserTransferInput extends Vue {
  @Prop({ default: true }) multiple!: boolean;
  @Prop() placeholder!: string;
  @Prop() value!: UserItemDto[] | undefined;

  private inputValue = '';
  private userData: UserItemDto[] = [];

  @Emit('user-change') userChange(data: UserItemDto[] | UserItemDto) {}
  @Watch('value') onValueChange(v: UserItemDto[]) {
    this.inputValue = this.selectedString(v);
  }
  private selectedString(data: UserItemDto[]): string {
    return (data || [])
      .map(m => {
        return m.userName;
      })
      .join('; ');
  }

  private createModal() {
    Modal.confirm({
      title: (
        <div style='font-weight: bold;'>
          {this.$t(`components.user`)}
          <a-divider style='margin:12px 0' />
        </div>
      ),
      content: () => {
        return (
          <div>
            <user-transfer
              value={this.value}
              multiple={this.multiple}
              on-select={(user: any) => {
                this.userData = this.multiple ? user : [user];
              }}
            />
          </div>
        );
      },
      maskClosable: true,
      width: 600,
      icon: () => {
        return null;
      },
      okText: this.$t(`framework.ok`) as string,
      cancelText: this.$t(`framework.cancel`) as string,
      onOk: () => {
        this.inputValue = this.selectedString(this.userData);
        this.userChange(this.multiple ? this.userData : (this.userData || []).length > 0 ? this.userData[0] : {});
      },
    });
  }

  created(): void {
    this.onValueChange(this.value || []);
  }

  render(): JSX.Element {
    return (
      <div>
        <a-input
          placeholder={this.placeholder || ''}
          value={this.inputValue}
          on-click={() => {
            this.createModal();
            console.log('click', this.value);
          }}
          on-change={(e: any) => {
            this.inputValue = e.target.value;
          }}
        >
          <a-icon slot='prefix' type='user' />
        </a-input>
      </div>
    );
  }
}
