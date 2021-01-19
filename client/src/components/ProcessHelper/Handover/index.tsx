import { Component, Vue } from 'vue-property-decorator';
import { TreeNode } from 'ant-design-vue/types/tree-node';

import { ValueLabelPair } from '@/common/defines';
import styles from './component.handover.module.less';
import { UserTreeSelect } from '../../OrganizationUser/UserTreeSelect';
import { handoverService } from './service';
import { GroupProcessDto } from './handover.types';

@Component({
  components: { UserTreeSelect },
})
export class Handover extends Vue {
  private user!: ValueLabelPair;
  private cacheKeys: string[] = [];
  private treeData: any[] = [];

  created() {
    handoverService.getProcesses().subscribe(s => {
      const groupProcessData: any[] = [];
      s.forEach((data, i) => {
        const index = groupProcessData.findIndex(f => f.title === data.group);
        if (index === -1) {
          groupProcessData.push({ title: data.group, key: `group${i}`, children: [{ key: data.id, title: data.name }] });
        } else {
          groupProcessData[index].children.push({ key: data.id, title: data.name });
        }
      });

      this.treeData = groupProcessData;
    });
  }

  getFormData(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cacheKeys.length === 0) {
        this.$notify.error(this.$l.getLocale(['components.select', 'framework.prepositions.space', 'components.process']));
        reject();
      }
      if (!this.user) {
        this.$notify.error(this.$l.getLocale(['components.select', 'framework.prepositions.space', 'components.user']));
        reject();
      } else {
        handoverService.AddHandoverProcesses({ UserId: this.user.value, processIds: this.cacheKeys }).subscribe(
          () => {
            resolve();
          },
          error => {
            reject();
          }
        );
      }
    });
  }

  render() {
    return (
      <div>
        <user-tree-select
          value={this.user}
          multiple={false}
          on-change={(value: ValueLabelPair) => {
            this.user = value;
          }}
        />
        <a-card>
          <a-tree
            multiple
            checkable
            treeData={this.treeData}
            on-check={(value: string[]) => {
              this.cacheKeys = value.filter(f => !f.startsWith('group'));
            }}
            on-select={(value: any) => {
              console.log(value);
            }}
          />
        </a-card>
      </div>
    );
  }
}
