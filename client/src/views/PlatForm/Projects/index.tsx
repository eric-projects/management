import { Component, Vue } from 'vue-property-decorator';
import { CompCard, CompBaseTable, CompModalForm, CompRich } from '@/components';
import { guidHelper, toCasedStyleObject } from '@/common/utils';
import { commonService } from '@/services/common';
import { ToolDataKeys, ToolDataModule, ToolDataType } from '@/services/common/types';
import { TableValueDto } from '@/components/CompTable';
import { map } from 'rxjs/operators';
import { FetchDataSourceDto } from '@/common/defines';

@Component({ components: { CompCard, CompBaseTable, CompModalForm, CompRich } })
export class ProjectList extends Vue {
  private projectAddData: any = { code: '', name: '', remark: '', tag: '' };
  private projectEditVisible = false;
  private data: TableValueDto = { total: 0, items: [] };
  columns = [
    {
      title: '标签',
      dataIndex: 'tag',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目标识',
      dataIndex: 'code',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'actions' },
    },
  ];

  private addProject() {
    this.projectEditVisible = true;
  }

  private projectEditOk() {
    commonService.postData(ToolDataModule.Projects, ToolDataKeys.List, ToolDataType.Array, this.projectAddData).subscribe(() => {
      (this.$refs.table as CompBaseTable).refreshData();
    });
  }

  private onDeleteRow(row: any) {
    const data: any = {};
    data[commonService.rowKey] = row[commonService.rowKey];
    commonService.deleteData(ToolDataModule.Projects, ToolDataKeys.List, ToolDataType.Array, data).subscribe(() => {
      (this.$refs.table as CompBaseTable).refreshData();
    });
  }

  private loadData(v: FetchDataSourceDto<TableValueDto>) {
    v.callback(
      commonService.getData(ToolDataModule.Projects, ToolDataKeys.List, { ...toCasedStyleObject({}), ...v.params }).pipe(
        map(data => ({
          total: 0,
          items: data,
        }))
      )
    );
  }

  render() {
    return (
      <comp-card>
        <comp-rich></comp-rich>
        <comp-base-table
          ref='table'
          columns={this.columns}
          scoped-slots={{
            actions: (cell: string, row: any) => {
              return (
                <a-popconfirm
                  placement='top'
                  on-confirm={() => {
                    this.onDeleteRow(row);
                  }}
                  title={this.$t('framework.delete-info')}
                >
                  <a-button size='small' type='danger'>
                    删除
                  </a-button>
                </a-popconfirm>
              );
            },
          }}
          on-load-data={this.loadData}
        >
          <template slot='title-right'>
            <a-button type='primary' on-click={this.addProject}>
              添加
            </a-button>
          </template>
        </comp-base-table>

        <comp-modal-form v-model={this.projectEditVisible} title='操作' on-ok={this.projectEditOk}>
          <a-form-item label='标签' required>
            <a-input
              v-decorator={[
                'tag',
                {
                  initialValue: this.projectAddData.tag,
                  rules: [{ required: true, message: `请输入标签` }],
                },
              ]}
              v-model={this.projectAddData.tag}
            />
          </a-form-item>
          <a-form-item label='项目编码' required>
            <a-input
              v-decorator={[
                'code',
                {
                  initialValue: this.projectAddData.code,
                  rules: [{ required: true, message: `请输入项目编码` }],
                },
              ]}
              v-model={this.projectAddData.code}
            />
          </a-form-item>
          <a-form-item label='项目名称' required>
            <a-input
              v-decorator={[
                'name',
                {
                  initialValue: this.projectAddData.name,
                  rules: [{ required: true, message: `请输入项目名称` }],
                },
              ]}
              v-model={this.projectAddData.name}
            />
          </a-form-item>
          <a-form-item label='备注'>
            <a-input v-decorator={['remark', { initialValue: this.projectAddData.remark }]} v-model={this.projectAddData.remark} />
          </a-form-item>
        </comp-modal-form>
      </comp-card>
    );
  }
}
