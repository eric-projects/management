import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Container, Draggable } from 'vue-smooth-dnd';

import styles from './common-approval-comment.module.less';
import { ValueLabelPair } from '@/common/defines';
import { guidHelper } from '@/common/utils';
import { commonApprovalCommentService } from './service';

@Component({
  components: {
    Container,
    Draggable,
  },
})
export class CommonApprovalComment extends Vue {
  @Prop({ default: false }) editable!: boolean;

  private commonlyUsedComments: ValueLabelPair[] = [];
  private tableData: any[] = [];
  private modalVisible = false;
  private maxTagNo = 4;

  @Emit('click')
  private onSelect(value: string) {
    return value;
  }

  created() {
    this.loadComments();
  }

  private loadComments() {
    commonApprovalCommentService.get().subscribe(data => {
      this.tableData = data;
      this.commonlyUsedComments = data.map(m => {
        return { label: m.subject, value: m.content };
      });
    });
  }

  private onDefine() {
    this.modalVisible = true;
  }

  private onAdd() {
    const isEdit = this.tableData.some(i => {
      return i.isEdit;
    });
    if (isEdit) {
      this.$notify.error(`${this.$t('instance.approval-comment.needSave')}`);
    } else {
      const addData = {
        approvalCommentId: guidHelper.generate(),
        subject: '',
        content: '',
        isAdd: true,
        isEdit: true,
      };
      this.tableData = [addData, ...this.tableData];
    }
  }

  private onEdit(id: string) {
    const isEdit = this.tableData.some(i => {
      return i.isEdit;
    });
    if (isEdit) {
      this.$notify.error(`${this.$t('instance.approval-comment.needSave')}`);
    } else {
      const editDate = this.tableData.filter(i => {
        return i.approvalCommentId === id;
      });
      if (editDate) {
        editDate[0].isEdit = true;
      }
    }
  }

  private onSave(row: any) {
    if (!row.subject || !row.content) {
      this.$notify.error(() => {
        return <div>{this.$t('components.text')}</div>;
      });
    } else {
      commonApprovalCommentService.save(row).subscribe(() => {
        this.loadComments();
      });
    }
  }

  private onCancel(row: any) {
    if (row['isAdd']) {
      this.tableData = this.tableData.filter(i => {
        return i.approvalCommentId !== row['approvalCommentId'];
      });
    } else {
      this.loadComments();
    }
  }

  private onDelete(id: string): void {
    commonApprovalCommentService.delete(id).scribe(s => {
      this.loadComments();
    });
  }

  private sort(): void {
    commonApprovalCommentService.sort(this.tableData).subscribe(s => {
      this.loadComments();
      this.modalVisible = false;
    });
  }

  private onDrop(dropResult: any) {
    this.tableData = this.applyDrag(this.tableData, dropResult);
  }

  private applyDrag(arr: any, dragResult: any) {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) {
      return arr;
    }

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  }

  render() {
    return this.editable ? (
      <div class={styles.comment}>
        <div class={styles.title}>{this.$l.getLocale('instance.approval-comment.title')}</div>
        <div class={styles.content}>
          {this.commonlyUsedComments.map((tag, i) =>
            i < this.maxTagNo ? (
              <a-tag key={tag.value} on-click={this.onSelect.bind(this, tag.value as string)}>
                {tag.label}
              </a-tag>
            ) : (
              ''
            )
          )}
          {this.commonlyUsedComments.length >= this.maxTagNo ? (
            <a-dropdown
              size='small'
              overlay={
                <a-menu>
                  {this.commonlyUsedComments.map((tag, i) =>
                    i >= this.maxTagNo ? (
                      <a-menu-item key={tag.value} on-click={this.onSelect.bind(this, tag.value as string)}>
                        {tag.label}
                      </a-menu-item>
                    ) : (
                      ''
                    )
                  )}
                </a-menu>
              }
            >
              <a-button clss='ml-1' size='small'>
                {this.$l.getLocale('instance.approval-comment.more')}
                <a-icon type='down' />
              </a-button>
            </a-dropdown>
          ) : (
            ''
          )}
          <a-button class='ml-1' icon='edit' size='small' onClick={this.onDefine}>
            {this.$l.getLocale('instance.approval-comment.define')}
          </a-button>
        </div>
        <template>
          <a-modal
            width={800}
            destroyOnClose={true}
            title={this.$l.getLocale('instance.approval-comment.modalTitle')}
            visible={this.modalVisible}
            on-ok={() => {
              this.sort();
            }}
            on-cancel={() => {
              this.modalVisible = false;
            }}
          >
            <div class={styles.detail}>
              <a-row gutter={8}>
                <a-col class={styles.col} span='6'>
                  <a-button type='primary' class='mr-1 mb-1' icon='plus' on-click={this.onAdd}>
                    {this.$l.getLocale('instance.approval-comment.add')}
                  </a-button>
                </a-col>
              </a-row>
              <table class={styles.table} dataSource={this.tableData}>
                <thead class='ant-table-thead'>
                  <tr>
                    <th>{this.$l.getLocale('instance.approval-comment.info')}</th>
                  </tr>
                </thead>
                <container on-drop={this.onDrop} class='ant-table-tbody' tag='tbody'>
                  {this.tableData.map((row, i) => (
                    <draggable class='ant-table-row ' tag='tr'>
                      <td width={200}>
                        {row.isEdit ? (
                          <a-input
                            placeholder={this.$l.getLocale([
                              'components.text',
                              'framework.prepositions.space',
                              'instance.approval-comment.subject',
                            ])}
                            maxLength={20}
                            value={row.subject}
                            on-change={(e: any) => (row.subject = e.target.value)}
                          />
                        ) : (
                          row.subject
                        )}
                      </td>
                      <td width={400}>
                        {row.isEdit ? (
                          <a-input
                            placeholder={this.$l.getLocale([
                              'components.text',
                              'framework.prepositions.space',
                              'instance.approval-comment.comment',
                            ])}
                            maxLength={200}
                            value={row['content']}
                            on-change={(e: any) => (row['content'] = e.target.value)}
                          />
                        ) : (
                          row.content
                        )}
                      </td>
                      <td width={170}>
                        {row.isEdit ? (
                          <div>
                            <a-button type='primary' size='small' class='mr-1' on-click={this.onSave.bind(this, row)}>
                              {this.$l.getLocale('framework.save')}
                            </a-button>
                            <a-button size='small' on-click={this.onCancel.bind(this, row)}>
                              {this.$l.getLocale('framework.cancel')}
                            </a-button>
                          </div>
                        ) : (
                          <div>
                            <a-button type='primary' size='small' class='mr-1' on-click={this.onEdit.bind(this, row.approvalCommentId)}>
                              {this.$l.getLocale('components.edit')}
                            </a-button>
                            <a-popconfirm
                              placement='top'
                              on-confirm={this.onDelete.bind(this, row.approvalCommentId)}
                              title={this.$t('framework.delete-info')}
                            >
                              <a-button size='small' type='danger' loading={row.loading}>
                                {this.$l.getLocale('components.delete')}
                              </a-button>
                            </a-popconfirm>
                          </div>
                        )}
                      </td>
                    </draggable>
                  ))}
                </container>
              </table>
            </div>
          </a-modal>
        </template>
      </div>
    ) : (
      ''
    );
  }
}
