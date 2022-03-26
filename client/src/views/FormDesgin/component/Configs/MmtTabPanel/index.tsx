import { guidHelper } from '@/common/utils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';
import styles from './tab-panel.module.less';

@Component({
})
export class MmtTabPanelConfig extends BaseConfig {
    private onAdd() {
        const guid = guidHelper.generate();
        this.item.config.options.push({
            label: `Tab面板${this.item.info.columns.length + 1}`,
            value: guid
        });
        this.item.info.columns.push({
            id: guid,
            list: []
        });
    }
    private onDeleted(index: number) {
        this.item.info.columns.splice(index, 1);
        this.item.config.options.splice(index, 1);
    }
    created(): void {
    }
    render() {
        return (
            <div>
                <a-form-item label='面板配置项'>
                    {this.item.config.options.map((m: any, i: number) => (
                        <div class={styles.config}>
                            <a-input
                                v-model={m.label}
                            ></a-input>
                            {
                                this.item.config.options.length > 1 ?
                                    (
                                        <a-icon type='minus-circle'
                                            on-click={() => this.onDeleted(i)} />
                                    ) : null
                            }
                        </div>
                    ))}
                    <a-button type='dashed'
                        on-click={this.onAdd}>添加面板</a-button>
                </a-form-item>
                <a-form-item label='页签位置'>
                    <a-radio-group v-model={this.item.config.tabPosition}>
                        <a-radio value='top'>上</a-radio>
                        <a-radio value='left'>左</a-radio>
                    </a-radio-group>
                </a-form-item>
            </div>
        );
    }
}
