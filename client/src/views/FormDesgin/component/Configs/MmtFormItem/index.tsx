import { Component, Prop } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';
import { MmtInputConfig } from '../MmtInput';
import { MmtTextareaConfig } from '../MmtTextarea';
import { MmtInputNumberConfig } from '../MmtInputNumber';
import { MmtCheckBoxConfig } from '../MmtCheckBox';
import { MmtSelectConfig } from '../MmtSelect';
import { MmtRadioConfig } from '../MmtRadio';
import { MmtDatePickerConfig } from '../MmtDatePicker';
import { MmtLabelConfig } from '../MmtLabel';
import { MmtHyperlinkConfig } from '../MmtHyperlink';
import { MmtUploadFilesConfig } from '../MmtUploadFiles';
import { MmtSelectPersonConfig } from '../MmtSelectPerson';
import { MmtSelectOrganizationConfig } from '../MmtSelectOrganization';
import { MmtWangeditorConfig } from '../MmtWangeditor';

@Component({
    components: {
        MmtInputConfig,
        MmtTextareaConfig,
        MmtInputNumberConfig,
        MmtCheckBoxConfig,
        MmtSelectConfig,
        MmtRadioConfig,
        MmtDatePickerConfig,
        MmtLabelConfig,
        MmtHyperlinkConfig,
        MmtUploadFilesConfig,
        MmtSelectPersonConfig,
        MmtSelectOrganizationConfig,
        MmtWangeditorConfig
    }
})
export class MmtFormItemConfig extends BaseConfig {
    private onDataKeyChange(value: any, option: any) {
        this.item.config.label = option.componentOptions.children[0].elm.data.trim();
        if (this.item.info.key === 'mmt-select' ||
            this.item.info.key === 'mmt-select-person' ||
            this.item.info.key === 'mmt-select-organization') {
            this.item.config.placeholder = `请选择${this.item.config.label}`;
        } else {
            this.item.config.placeholder = `请输入${this.item.config.label}`;
        }

    }
    created(): void {
    }
    render() {
        const customConfig = this.item.info.key + '-config';
        const fieldList = this.$tableFields[this.fieldKey] ? this.$tableFields[this.fieldKey] : { children: [] };
        return (
            <div>
                <a-form-item label='文本标题'>
                    <a-input v-model={this.item.config.label}></a-input>
                </a-form-item>
                {
                    !this.formDetailTable ? (
                        <a-form-item label='显示文本标题'>
                            <a-switch v-model={this.item.config.vshow}
                                checked-children='是'
                                un-checked-children='否'></a-switch>
                        </a-form-item>
                    ) : ''
                }
                {
                    this.item.config.systemField ? '' : [
                        <a-form-item label='可编辑'>
                            <a-switch v-model={this.item.config.disabled}
                                checked-children='是'
                                un-checked-children='否'></a-switch>
                        </a-form-item>,
                        <a-form-item label='字段绑定'>
                            <a-select
                                v-model={this.item.config.dataKey}
                                style={{ width: '100%' }}
                                on-change={this.onDataKeyChange}
                                options={fieldList.children}
                            >
                            </a-select>
                        </a-form-item>
                    ]
                }
                {
                    this.formDetailTable ? [
                        <a-form-item label='列宽度(px)'>
                            <a-input-number v-model={this.item.config.columnWidth}
                                precision={0}
                                min={1}
                                max={9999}
                                style={{ width: '100%' }}
                            ></a-input-number>
                        </a-form-item>,
                        <a-form-item label='列对齐方式'>
                            <a-radio-group
                                v-model={this.item.config.columnAlign}
                                button-style='solid' size='small'>
                                <a-radio-button value='left'>左对齐</a-radio-button>
                                <a-radio-button value='center'>居中对齐</a-radio-button>
                                <a-radio-button value='right'>右对齐</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    ] : ''
                }
                <customConfig
                    item={this.item}
                ></customConfig>
            </div>
        );
    }
}
