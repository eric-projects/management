import { guidHelper } from '@/common/utils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';
import styles from './tab-panel.module.less';

@Component({
})
export class MmtTableConfig extends BaseConfig {
    private onDisabledChange() {
        this.item.config.hasAdd = this.item.config.disabled;
        this.item.config.hasDelete = this.item.config.disabled;
    }
    created(): void {
    }
    render() {
        const fieldList: any = [];
        Object.keys(this.$tableFields).map((m: any) => {
            if (this.$tableFields[m].type === '明细表') {
                fieldList.push({ label: this.$tableFields[m].label, value: m });
            }
        });
        let columns: any = [];
        if (this.$tableFields[this.item.config.dataKey]) {
            columns = this.$tableFields[this.item.config.dataKey].children;
        }
        return (
            <div>
                <a-form-item label='字段绑定'>
                    <a-select
                        v-model={this.item.config.dataKey}
                        style={{ width: '100%' }}
                        options={fieldList}
                    >
                    </a-select>
                </a-form-item>
                <a-form-item label='可编辑'>
                    <a-switch v-model={this.item.config.disabled}
                        on-change={this.onDisabledChange}
                        checked-children='是'
                        un-checked-children='否'></a-switch>
                </a-form-item>
                <a-form-item label='显示序号列'>
                    <a-switch v-model={this.item.config.hasSerialColumn}
                        checked-children='是'
                        un-checked-children='否'></a-switch>
                </a-form-item>
                <a-form-item label='合计列'>
                    <a-select
                        v-model={this.item.config.totalColumn}
                        mode='multiple'
                        style={{ width: '100%' }}
                        options={columns}
                    >
                    </a-select>
                </a-form-item>
                {
                    this.item.config.disabled ? [
                        <a-form-item label='显示新增行按钮'>
                            <a-switch v-model={this.item.config.hasRowAddButton}
                                checked-children='是'
                                un-checked-children='否'></a-switch>
                        </a-form-item>,
                        <a-form-item label='显示删除行按钮'>
                            <a-switch v-model={this.item.config.hasRowDeleteButton}
                                checked-children='是'
                                un-checked-children='否'></a-switch>
                        </a-form-item>
                    ] : ''
                }
            </div>
        );
    }
}
