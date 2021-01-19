import { Component, Vue } from 'vue-property-decorator';

import styles from './authorization.module.less';
import { ValueLabelPair } from '@/common/defines';
import { toCasedStyleObject } from '@/common/utils';
import { processService } from '@/services/process';
import { authService } from '@/services/auth';
import { UserTreeSelect } from '../../OrganizationUser/UserTreeSelect';
import { UserTransferInput } from '../../OrganizationUser/UserTransferInput';
import { DepartmentTreeSelect } from '../../OrganizationUser/DepartmentTreeSelect';
import { authorizationService } from './service';
import { AuthorizationDto, TreeDto } from './authorization.types';
import { AuthorizationDetailDto } from './authorization-detail.types';
import { UserItemDto } from '@/components/OrganizationUser/types';

@Component({
  components: { UserTreeSelect, DepartmentTreeSelect, UserTransferInput },
})
export class Authorization extends Vue {
  // private user!: ValueLabelPair | undefined | null;
  private user!: UserItemDto[];
  // private authorizatedUser!: ValueLabelPair | undefined | null;
  private authorizatedUser!: UserItemDto[];
  private formAuthorizatedUser!: UserItemDto[];
  // private formAuthorizatedUser!: ValueLabelPair | undefined | null;
  private formUser!: ValueLabelPair | undefined | null;
  private dataItems: any[] = [];
  private fieldsSlotMap: any = {};
  private visible = false;
  private cacheTreeData: { [key: string]: TreeDto[] } = {};
  private treeData: TreeDto[] = [];
  private detailId = '';
  private searchData = new AuthorizationDto();
  private detailData = new AuthorizationDetailDto();
  private department = '';
  private searchLoading = false;
  private detailStartDate: any = null;
  private detailEndDate: any = null;
  private pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    size: 'small',
    showTotal: (total: string) =>
      `${this.$l.getLocale('framework.prepositions.total')} ${total}  ${this.$l.getLocale('framework.prepositions.items')}`,
  };
  private columns = [
    { title: this.$l.getLocale('authorization-helper.user'), dataIndex: 'userName', width: '100px' },
    { title: this.$l.getLocale('authorization-helper.authorizated-user'), dataIndex: 'authorizedUserName', width: '100px' },
    { title: this.$l.getLocale('authorization-helper.authorizated-process'), dataIndex: 'processName' },
    { title: this.$l.getLocale('authorization-helper.start-time'), dataIndex: 'startDate', width: '120px' },
    { title: this.$l.getLocale('authorization-helper.end-time'), dataIndex: 'endDate', width: '120px' },
    { title: this.$l.getLocale('framework.operate'), width: '150px', scopedSlots: { customRender: 'action' } },
  ];

  getFormData(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  created() {
    this.load(1);
    this.fieldsSlotMap['action'] = (cell: string, row: any) => {
      return [
        <div>
          <a-button size='small' type='primary' class='mr-1' on-click={this.onEdit.bind(this, row)}>
            {this.$t('components.edit')}
          </a-button>
          <a-popconfirm placement='top' on-confirm={this.onDelete.bind(this, row)} title={this.$t('framework.delete-info')}>
            <a-button size='small' type='danger' loading={row.loading}>
              {this.$t('components.cancel')}
            </a-button>
          </a-popconfirm>
        </div>,
      ];
    };
  }

  load(pageIndex?: number) {
    if (pageIndex) {
      this.pagination.current = pageIndex;
    }

    const param = { ...this.searchData, pageSize: this.pagination.pageSize, pageIndex: this.pagination.current };
    authorizationService.getAuthorizations(toCasedStyleObject(param)).subscribe(s => {
      this.dataItems = s.items;
      this.pagination.total = s.total;
      this.searchLoading = false;
    });
  }

  getProcesses(organization: string = '') {
    processService.getGroupedProcesses({ organizationPath: organization }, this.convertTreeKey).subscribe(s => {
      this.treeData = s;
      if (!organization) {
        this.cacheTreeData[organization] = s;
      }

      this.detailData.processIds = [...(this.detailData.processIds || [])];
    });
  }

  onEdit(row: any) {
    this.detailId = row.id;
    this.formUser = null;
    this.formAuthorizatedUser = [];
    this.detailData = new AuthorizationDetailDto();
    if (this.cacheTreeData[this.department]) {
      this.treeData = [...this.cacheTreeData[this.department]];
    } else {
      this.getProcesses();
    }
    authorizationService.getAuthorization(row.id).subscribe(s => {
      this.detailData = Object.assign(this.detailData, s);
      this.detailStartDate = s.startDate;
      this.detailEndDate = s.endDate;
      this.formUser = { value: s.userId, label: s.userName };
      this.formAuthorizatedUser = [{ userId: s.authorizedUserId, userName: s.authorizedUserName }];
    });
    this.visible = true;
  }

  onAdd() {
    this.detailId = '';
    this.formUser = null;
    this.formAuthorizatedUser = [];
    this.detailData = new AuthorizationDetailDto();
    this.detailData.userId = authService.user.id;
    this.detailData.userName = authService.user.name;
    if (authService.user.id) {
      this.formUser = { label: authService.user.name || '', value: authService.user.id || '' };
    }

    if (this.cacheTreeData[this.department]) {
      this.treeData = [...this.cacheTreeData[this.department]];
    } else {
      this.getProcesses();
    }
    this.visible = true;
  }

  onDelete(row: any) {
    authorizationService.deleteAuthorization(row.id).subscribe(s => {
      this.load(1);
    });
  }

  saveData() {
    if (this.detailId) {
      authorizationService.updateAuthorization(this.detailId, this.detailData).subscribe(s => {
        this.visible = false;
        this.load(1);
      });
    } else {
      authorizationService.addAuthorization(this.detailData).subscribe(s => {
        this.visible = false;
        this.load(1);
      });
    }
  }

  private convertTreeKey(originData: any[]): any[] {
    const result: any[] = [];
    originData.forEach((d, i) => {
      d.title = d.groupName;
      d.key = d.groupId;
      delete d.groupName;
      delete d.groupId;
      if (d.children && d.children.length > 0) {
        d.children = this.convertTreeKey(d.children);
      }

      if ((d.children || []).length > 0 || (d.processes || []).length > 0) {
        d.children = [...d.children, ...(d.processes || []).map((p: any) => ({ key: p.id, title: p.name, isProcess: true }))];
        result.push(d);
      }
    });

    return result;
  }

  private disabledEndDate(endValue: any) {
    const startValue = this.detailStartDate;
    if (!endValue || !startValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  }

  private disabledStartDate(startValue: any) {
    const endValue = this.detailEndDate;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  render() {
    return (
      <div class={styles.condition}>
        <a-row>
          <a-col span='8'>
            <a-form-item label={this.$t('authorization-helper.user')} label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
              <user-transfer-input
                multiple={false}
                value={this.user}
                placeholder={this.$l.getLocale(['components.select', 'framework.prepositions.space', 'authorization-helper.user'])}
                on-user-change={(user: any) => {
                  this.user = [user];
                  this.searchData.user = user ? user.userId + '' : '';
                  // Object.assign(this.data, { targetUserId: user.userId, targetUserName: user.userName });
                }}
              />
              {/* <user-tree-select
                value={this.user}
                multiple={false}
                placeholder={this.$l.getLocale(['components.select', 'framework.prepositions.space', 'authorization-helper.user'])}
                on-change={(value: ValueLabelPair) => {
                  this.user = value;
                  this.searchData.user = value ? value.value + '' : '';
                }}
              /> */}
            </a-form-item>
          </a-col>
          <a-col span='8'>
            <a-form-item label={this.$t('authorization-helper.authorizated-user')} label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
              <user-transfer-input
                multiple={false}
                value={this.authorizatedUser}
                placeholder={this.$l.getLocale([
                  'components.select',
                  'framework.prepositions.space',
                  'authorization-helper.authorizated-user',
                ])}
                on-user-change={(user: any) => {
                  this.authorizatedUser = [user];
                  this.searchData.authorizedUser = user ? user.userId + '' : '';
                  // Object.assign(this.data, { targetUserId: user.userId, targetUserName: user.userName });
                }}
              />
              {/* <user-tree-select
                value={this.authorizatedUser}
                multiple={false}
                placeholder={this.$l.getLocale([
                  'components.select',
                  'framework.prepositions.space',
                  'authorization-helper.authorizated-user',
                ])}
                on-change={(value: ValueLabelPair) => {
                  this.authorizatedUser = value;
                  this.searchData.authorizedUser = value ? value.value + '' : '';
                }}
              /> */}
            </a-form-item>
          </a-col>
          <a-col span='8'>
            <a-form-item label={this.$t('authorization-helper.authorizated-process')} label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
              <a-input
                placeholder={this.$l.getLocale([
                  'components.select',
                  'framework.prepositions.space',
                  'authorization-helper.authorizated-process',
                ])}
                allowClear
                value={this.searchData.processName}
                on-change={(e: any) => {
                  this.searchData.processName = e.target.value;
                }}
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span='8'>
            <a-form-item label={this.$t('authorization-helper.start-time')} label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
              <a-date-picker
                value={this.searchData.startDate}
                format='YYYY-MM-DD'
                on-change={(value: any, dateStr: string) => {
                  this.searchData.startDate = dateStr;
                }}
              />
            </a-form-item>
          </a-col>
          <a-col span='8'>
            <a-form-item label={this.$t('authorization-helper.end-time')} label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
              <a-date-picker
                value={this.searchData.endDate}
                format='YYYY-MM-DD'
                on-change={(value: any, dateStr: string) => {
                  this.searchData.endDate = dateStr;
                }}
              />
            </a-form-item>
          </a-col>
          <div class={styles.button}>
            <a-button type={'primary'} on-click={this.onAdd}>
              {this.$t('components.add')}
            </a-button>
            <a-button
              type={'primary'}
              loading={this.searchLoading}
              on-click={() => {
                this.searchLoading = true;
                this.load(1);
              }}
            >
              {this.$t('components.search')}
            </a-button>
            <a-button
              on-click={() => {
                this.searchData = new AuthorizationDto();
                this.user = [];
                this.searchData.authorizedUser = '';
                this.searchData.user = '';
                this.authorizatedUser = [];
                this.pagination.current = 1;
                this.load(1);
              }}
            >
              {this.$t('components.reset')}
            </a-button>
          </div>
        </a-row>
        <a-table
          rowKey='id'
          class={styles.table}
          pagination={this.pagination}
          on-change={(pagination: any) => {
            this.pagination = pagination;
            this.load();
          }}
          columns={this.columns}
          dataSource={this.dataItems}
          scopedSlots={this.fieldsSlotMap}
        />
        <template>
          <a-modal
            width={800}
            destroyOnClose={true}
            title={this.$t('authorization-helper.detail')}
            visible={this.visible}
            on-ok={() => {
              this.saveData();
            }}
            on-cancel={() => {
              this.visible = false;
            }}
          >
            <div class={styles.detail}>
              <div class={styles.process}>
                <a-row>
                  <a-col span='6'>所属组织：</a-col>
                  <a-col span='18'>
                    <department-tree-select
                      value={this.department}
                      multiple={false}
                      on-node-change={(value: any) => {
                        if (value && value.length > 0) {
                          this.getProcesses(value[0].organizationPath);
                        }
                      }}
                      on-change={(value: string) => {
                        this.department = value;
                      }}
                    />
                  </a-col>
                </a-row>
                <a-card class={styles.tree + ' mt-1'}>
                  <a-tree
                    multiple
                    checkable
                    checkedKeys={this.detailData.processIds}
                    treeData={this.treeData}
                    on-check={(value: string[], e: { checked: boolean; checkedNodes: any[] }) => {
                      const ids: string[] = [];
                      e.checkedNodes.forEach(f => {
                        if (!!f.data.props.dataRef.isProcess) {
                          ids.push(f.data.props.dataRef.key);
                        }
                      });
                      this.detailData.processIds = ids;
                    }}
                  />
                </a-card>
              </div>
              <div class={styles.form}>
                <a-card>
                  <a-row>
                    <a-col span='24'>
                      <a-form-item
                        label={this.$t('authorization-helper.user')}
                        required={true}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <user-tree-select
                          multiple={false}
                          value={this.formUser}
                          allowClear={false}
                          disabled={true}
                          placeholder={this.$l.getLocale([
                            'components.select',
                            'framework.prepositions.space',
                            'authorization-helper.user',
                          ])}
                          on-change={(value: ValueLabelPair) => {
                            this.formUser = value;
                            this.detailData.userId = value ? value.value + '' : '';
                            this.detailData.userName = value ? value.label : '';
                          }}
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col span='24'>
                      <a-form-item
                        label={this.$t('authorization-helper.authorizated-user')}
                        label-col={{ span: 8 }}
                        required={true}
                        wrapper-col={{ span: 16 }}
                      >
                        <user-transfer-input
                          multiple={false}
                          placeholder={this.$l.getLocale([
                            'components.select',
                            'framework.prepositions.space',
                            'authorization-helper.authorizated-user',
                          ])}
                          value={this.formAuthorizatedUser}
                          on-user-change={(user: any) => {
                            this.formAuthorizatedUser = [user];
                            this.detailData.authorizedUserId = user.userId;
                            this.detailData.authorizedUserName = user.userName;
                            // Object.assign(this.data, { targetUserId: user.userId, targetUserName: user.userName });
                          }}
                        />
                        {/* <user-tree-select
                          value={this.formAuthorizatedUser}
                          placeholder={this.$l.getLocale([
                            'components.select',
                            'framework.prepositions.space',
                            'authorization-helper.authorizated-user',
                          ])}
                          multiple={false}
                          on-change={(value: ValueLabelPair) => {
                            this.formAuthorizatedUser = value;
                            this.detailData.authorizedUserId = value.value + '';
                            this.detailData.authorizedUserName = value.label;
                          }}
                        /> */}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col span='24'>
                      <a-form-item
                        label={this.$t('authorization-helper.start-time')}
                        required={true}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <a-date-picker
                          value={this.detailStartDate}
                          format='YYYY-MM-DD'
                          disabled-date={this.disabledStartDate}
                          on-change={(value: any, dateStr: string) => {
                            this.detailStartDate = value;
                            this.detailData.startDate = dateStr;
                          }}
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col span='24'>
                      <a-form-item
                        label={this.$t('authorization-helper.end-time')}
                        required={true}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <a-date-picker
                          value={this.detailEndDate}
                          format='YYYY-MM-DD'
                          disabled-date={this.disabledEndDate}
                          on-change={(value: any, dateStr: string) => {
                            this.detailEndDate = value;
                            this.detailData.endDate = dateStr;
                          }}
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col span='24'>
                      <a-form-item label={this.$t('authorization-helper.description')} label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
                        <a-textarea
                          placeholder={this.$l.getLocale([
                            'components.text',
                            'framework.prepositions.space',
                            'authorization-helper.description',
                          ])}
                          value={this.detailData.remark}
                          on-change={(e: any) => {
                            this.detailData.remark = e.target.value;
                          }}
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-card>
              </div>
            </div>
          </a-modal>
        </template>
      </div>
    );
  }
}
