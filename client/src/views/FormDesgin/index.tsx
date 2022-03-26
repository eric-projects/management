import { guidHelper, notificationHelper } from '@/common/utils';
import { Component, Vue } from 'vue-property-decorator';
import { componentsList, components } from './components';
import styles from './form-desgin.module.less';
import { formDesginService } from './service';
import * as controls from './component/Controls';
import * as configs from './component/Configs';
import { FormRules } from '../FormDesgin/component/Common/FormRules';
import { FormPreview } from '../FormDesgin/component/Common/FormPreview';
import Draggable from 'vuedraggable';
// import { BaseInfo } from '../Process/ProcessSettings/OneStop/BaseInfo';

@Component({
    components: {
        Draggable, FormRules, FormPreview, ...controls, ...configs,
    }
})
export class extends Vue {
    private currentCheckedTab = 'page';
    private formRuleVisible = false;
    private formDesginSchema: any = {
        formDesignId: '',
        info: {
            title: '',
            dataKey: '',
            formCode: '',
            description: '',
            isColon: 2,
            businessTypeId: '',
            businessObjectCode: ''
        },
        gridList: [],
        ruleList: {
            checkRules: [],
            displayRules: [],
            emptyRules: [],
            editRules: [],
            calculationRules: [],
            styleRules: [],
            submitRules: []
        }
    };
    private currentCheckedItemId = '';
    private currentCheckedItem: any = {};
    private parentCheckedItem: any = {};
    private tempComponentsList: any = [];
    private isPublish = false;
    private previewVisible = false;
    get getCurrentCheckedItemHtml() {
        const customConfig = `mmt-${this.currentCheckedItem.info.type}-config`;
        return <customConfig
            item={this.currentCheckedItem}
            fieldKey={this.parentCheckedItem && this.parentCheckedItem.info.type === 'table' ?
                this.parentCheckedItem.config.dataKey :
                this.formDesginSchema.info.dataKey}
            formDetailTable={this.parentCheckedItem && this.parentCheckedItem.info.type === 'table' ? true :
                false}
        ></customConfig>;
    }
    private onCheckedItem(item: any, parentItem: any) {
        this.currentCheckedTab = 'control';
        this.currentCheckedItemId = item.info.id;
        this.currentCheckedItem = item;
        this.parentCheckedItem = parentItem;
    }
    private onAddItem(newIndex: number, items: any) {
        const newItem = JSON.parse(JSON.stringify(items[newIndex]));
        newItem.info.id = guidHelper.generate();
        if (newItem.info.type === 'collapse-panel' ||
            newItem.info.type === 'layout') {
            newItem.info.columns.map((m: any) => m.id = guidHelper.generate());
        } else if (newItem.info.type === 'tab-panel') {
            const guid = guidHelper.generate();
            newItem.info.columns.map((m: any) => m.id = guid);
            newItem.config.options.map((m: any) => m.value = guid);
        } else if (newItem.info.type === 'table') {
            newItem.info.columns.map((m: any) => {
                m.id = guidHelper.generate();
                m.list.map((l: any) => l.info.id = guidHelper.generate());
            });
        } else if (newItem.info.type === 'base-info') {
            newItem.info.columns[0].id = guidHelper.generate();
            newItem.info.columns[0].list.map((m: any) => {
                if (m.info.type === 'form-item') {
                    m.info.id = guidHelper.generate();
                } else if (m.info.type === 'layout') {
                    m.info.id = guidHelper.generate();
                    m.info.columns.map((c: any) => {
                        c.id = guidHelper.generate();
                        c.list[0].info.id = guidHelper.generate();
                    });
                }
            });
        }
        items.splice(newIndex, 1, newItem);
        this.onCheckedItem(items[newIndex], null);
    }
    private onAddLayoutItem(newIndex: number, items: any) {
        const newItem = JSON.parse(JSON.stringify(items[newIndex]));
        newItem.info.id = guidHelper.generate();
        items.splice(0, items.length);
        items.splice(0, 0, newItem);
        newIndex = 0;
        this.onCheckedItem(items[newIndex], null);
    }
    private onAddTableColumnItem(newIndex: number, tableItem: any) {
        const newItem = JSON.parse(JSON.stringify(tableItem.info.columns[newIndex]));
        newItem.info.id = guidHelper.generate();
        newItem.config.vshow = false;
        tableItem.info.columns.splice(newIndex, 1, {
            id: newItem.info.id,
            list: [newItem]
        });
        this.onCheckedItem(tableItem.info.columns[newIndex].list[0], tableItem);
    }
    private onDeleteItem(index: number, parentItems: any) {
        if (!parentItems) {
            this.formDesginSchema.gridList.splice(index, 1);
        } else {
            parentItems.splice(index, 1);
        }
        this.currentCheckedItemId = '';
        this.currentCheckedItem = null;
        this.parentCheckedItem = null;
    }
    private generateControl(item: any) {
        if (!item.info.id) {
            return '';
        }
        const customComponent = item.info.key;
        return <customComponent
            item={item}
        ></customComponent>;
    }
    private generateFormItem(item: any, index: number, parentDeleteItems: any, parentSelectItem: any, isAction: boolean = true) {
        if (!item.info.id) {
            return '';
        }
        const customComponent = item.info.key;
        const noneBorder = parentSelectItem && parentSelectItem.info.type === 'layout' ?
            ` ${styles.border_none}` : '';
        return <div class={parentSelectItem && parentSelectItem.info.type === 'layout' ?
            styles.layout_div : styles.div} key={item.info.id} id={`${item.info.type}_${guidHelper.generate()}`}>
            <a-form-item
                class={styles.form_item + ` ${this.currentCheckedItemId === item.info.id
                    ? styles.active : null}` + noneBorder}
                required={item.config.required}
                label={item.config.vshow ? item.config.label : ''}
                nativeOnClick={(e: any) => {
                    this.onCheckedItem(item, parentSelectItem);
                    e.stopPropagation();
                }}
            >
                <customComponent
                    item={item}
                ></customComponent>
            </a-form-item>
            {
                this.currentCheckedItemId === item.info.id && isAction ? [
                    <div class={styles.form_item_action}>
                        <a-icon type='delete' title='删除'
                            nativeOnClick={(e: any) => {
                                this.onDeleteItem(index, parentDeleteItems);
                                e.stopPropagation();
                            }}
                        />
                    </div>,
                    <div class={styles.form_item_drag}>
                        <a-icon type='drag' class='drag-widget' />
                    </div>
                ] : ''
            }
        </div>;
    }
    private generateCollapsePanel(item: any, index: number, parentDeleteItems: any, parentSelectItem: any) {
        if (!item.info.id) {
            return '';
        }
        return <div class={styles.div + ` ${this.currentCheckedItemId === item.info.id
            ? styles.active : null}`} key={item.info.id}>
            <a-collapse
                default-active-key={item.info.id}
            >
                <a-collapse-panel
                    key={item.info.id}
                    header={item.config.label}
                    show-arrow={false}
                >
                    <draggable
                        v-model={item.info.columns[0].list}
                        group={{ name: 'people' }}
                        animation={200}
                        ghostClass={styles.ghost}
                        handle='.drag-widget'
                        class={styles.form_draggable}
                        on-add={(event: any) => this.onAddItem(event.newIndex, item.info.columns[0].list)}
                    >
                        <transition-group
                            name='fade'
                            tag='div'
                            class={styles.collapse_draggable}
                        >
                            {
                                item.info.columns[0].list.map((m: any, i: number) => [
                                    m.info.type === 'form-item' ?
                                        this.generateFormItem(m, i, item.info.columns[0].list, parentSelectItem) : '',
                                    m.info.type === 'collapse-panel' ?
                                        this.generateCollapsePanel(m, i, item.info.columns[0].list, parentSelectItem) : '',
                                    m.info.type === 'tab-panel' ?
                                        this.generateTabPanel(m, i, item.info.columns[0].list, parentSelectItem) : '',
                                    m.info.type === 'layout' ?
                                        this.generateLayout(m, i, item.info.columns[0].list, parentSelectItem) : '',
                                    m.info.type === 'table' ?
                                        this.generateTable(m, i, item.info.columns[0].list, parentSelectItem) : ''
                                ])
                            }
                        </transition-group>
                    </draggable>
                </a-collapse-panel>
            </a-collapse>
            {
                <div class={styles.form_item_down_action}>
                    <a-icon type='edit' title='属性设置'
                        nativeOnClick={(e: any) => {
                            this.onCheckedItem(item, parentSelectItem);
                            e.stopPropagation();
                        }}
                    />
                    {
                        this.currentCheckedItemId === item.info.id ? (
                            <a-icon type='delete' title='删除'
                                nativeOnClick={(e: any) => {
                                    this.onDeleteItem(index, parentDeleteItems);
                                    e.stopPropagation();
                                }}
                            />
                        ) : ''
                    }
                </div>
            }
            {
                this.currentCheckedItemId === item.info.id ? (
                    <div class={styles.form_item_drag}>
                        <a-icon type='drag' class='drag-widget' />
                    </div>
                ) : ''
            }
        </div>;
    }
    private generateTabPanel(item: any, index: number, parentDeleteItems: any, parentSelectItem: any) {
        if (!item.info.id) {
            return '';
        }
        return <div class={styles.div + ` ${this.currentCheckedItemId === item.info.id
            ? styles.active : null}`} key={item.info.id}>
            <a-tabs
                default-active-key={item.info.columns[0].id}
                tab-position={item.config.tabPosition}
            >
                {
                    item.info.columns.map((m: any, i: number) => (
                        <a-tab-pane key={m.id} tab={item.config.options[i].label}>
                            <draggable
                                v-model={m.list}
                                group={{ name: 'people' }}
                                animation={200}
                                ghostClass={styles.ghost}
                                handle='.drag-widget'
                                class={styles.form_draggable}
                                on-add={(event: any) => this.onAddItem(event.newIndex, m.list)}
                            >
                                <transition-group
                                    name='fade'
                                    tag='div'
                                    class={styles.tab_draggable}
                                >
                                    {
                                        m.list.map((c: any, ci: number) => [
                                            c.info.type === 'form-item' ?
                                                this.generateFormItem(c, ci, m.list, parentSelectItem) : '',
                                            c.info.type === 'collapse-panel' ?
                                                this.generateCollapsePanel(c, ci, m.list, parentSelectItem) : '',
                                            c.info.type === 'tab-panel' ?
                                                this.generateTabPanel(c, ci, m.list, parentSelectItem) : '',
                                            c.info.type === 'layout' ?
                                                this.generateLayout(c, ci, m.list, parentSelectItem) : '',
                                            c.info.type === 'table' ?
                                                this.generateTable(c, ci, m.list, parentSelectItem) : ''
                                        ])
                                    }
                                </transition-group>
                            </draggable>
                        </a-tab-pane>
                    ))
                }
            </a-tabs>
            {
                <div class={styles.form_item_down_action}>
                    <a-icon type='edit' title='属性设置'
                        nativeOnClick={(e: any) => {
                            this.onCheckedItem(item, parentSelectItem);
                            e.stopPropagation();
                        }}
                    />
                    {
                        this.currentCheckedItemId === item.info.id ? (
                            <a-icon type='delete' title='删除'
                                nativeOnClick={(e: any) => {
                                    this.onDeleteItem(index, parentDeleteItems);
                                    e.stopPropagation();
                                }}
                            />
                        ) : ''
                    }
                </div>
            }
            {
                this.currentCheckedItemId === item.info.id ? (
                    <div class={styles.form_item_drag}>
                        <a-icon type='drag' class='drag-widget' />
                    </div>
                ) : ''
            }
        </div>;
    }
    private generateLayout(item: any, index: number, parentDeleteItems: any, parentSelectItem: any, isAction: boolean = true) {
        if (!item.info.id) {
            return '';
        }
        return <div class={styles.div + ` ${this.currentCheckedItemId === item.info.id
            ? styles.active : null}`} key={item.info.id}>
            <a-row>
                {
                    item.info.columns.map((m: any, i: number) => (
                        <a-col
                            span={m.span}
                            class={styles.col}
                        >
                            <draggable
                                v-model={m.list}
                                group={{
                                    name: 'people', put: (a: any, b: any, c: any, d: any) => {
                                        const cs = c.id.split('_')[0];
                                        return cs === 'form-item' ? true : false;
                                    }
                                }}
                                animation={200}
                                ghostClass={styles.ghost}
                                on-add={(event: any) => this.onAddLayoutItem(event.newIndex, m.list)}
                            >
                                <transition-group
                                    name='fade'
                                    tag='div'
                                    class={styles.col_component}
                                >
                                    {m.list.length === 1 && m.list[0].info.id ? (
                                        this.generateFormItem(m.list[0], 0, m.list, item, isAction)
                                    ) : null}
                                </transition-group>
                            </draggable>
                        </a-col>
                    ))
                }
            </a-row>
            {
                isAction ? <div class={styles.form_item_down_action}>
                    <a-icon type='edit' title='属性设置'
                        nativeOnClick={(e: any) => {
                            this.onCheckedItem(item, parentSelectItem);
                            e.stopPropagation();
                        }}
                    />
                    {
                        this.currentCheckedItemId === item.info.id ? (
                            <a-icon type='delete' title='删除'
                                nativeOnClick={(e: any) => {
                                    this.onDeleteItem(index, parentDeleteItems);
                                    e.stopPropagation();
                                }}
                            />
                        ) : ''
                    }
                </div> : ''
            }
            {
                this.currentCheckedItemId === item.info.id && isAction ? (
                    <div class={styles.form_item_drag}>
                        <a-icon type='drag' class='drag-widget' />
                    </div>
                ) : ''
            }
        </div>;
    }
    private getCustomWidth(item: any) {
        let width = 100;
        item.info.columns.map((m: any) => {
            if (m.list) {
                width += m.list[0].config.columnWidth ? m.list[0].config.columnWidth : 100;
            }
        });
        return width;
    }
    private generateTable(item: any, index: number, parentDeleteItems: any, parentSelectItem: any) {
        if (!item.info.id) {
            return '';
        }
        return <div class={styles.div + ` ${this.currentCheckedItemId === item.info.id
            ? styles.active : null}`} key={item.info.id}>
            <div class={styles.table_content}>
                {
                    item.config.hasSerialColumn ? (
                        <div class={styles.system_column}>
                            <div class={styles.column_header}>
                                #
                            </div>
                            <div class={styles.column_content}>
                                1
                            </div>
                        </div>
                    ) : ''
                }
                <draggable
                    v-model={item.info.columns}
                    group={{
                        name: 'people', put: (a: any, b: any, c: any, d: any) => {
                            const cs = c.id.split('_')[0];
                            return cs === 'form-item' ? true : false;
                        }
                    }}
                    animation={200}
                    ghostClass={styles.column_ghost}
                    class={styles.draggable}
                    style={{
                        'margin-left': `${item.config.hasSerialColumn ? 50 : 0}px`,
                        'min-width': `${this.getCustomWidth(item)}px`
                    }}
                    on-add={(event: any) => this.onAddTableColumnItem(event.newIndex, item)}
                >
                    {
                        item.info.columns.map((c: any, i: number) => (
                            c.list ? <div class={styles.custom_column
                                + ` ${this.currentCheckedItemId === c.list[0].info.id
                                    ? styles.active : null}`}
                                style={{ width: `${c.list[0].config.columnWidth ? c.list[0].config.columnWidth : 100}px` }}
                                on-click={(e: any) => {
                                    this.onCheckedItem(c.list[0], item);
                                    e.stopPropagation();
                                }}
                            >
                                <div class={styles.column_header}
                                    style={{ 'text-align': c.list[0].config.columnAlign }}
                                >
                                    {c.list[0].config.label}
                                </div>
                                <div class={styles.column_content}>
                                    {
                                        this.generateControl(c.list[0])
                                    }
                                </div>
                                {
                                    this.currentCheckedItemId === c.list[0].info.id ? (
                                        <div class={styles.form_item_down_action}>
                                            <a-icon type='delete' title='删除'
                                                nativeOnClick={(e: any) => {
                                                    this.onDeleteItem(i, item.info.columns);
                                                    e.stopPropagation();
                                                }}
                                            />
                                        </div>
                                    ) : ''
                                }
                            </div> : ''
                        ))
                    }</draggable>
            </div>
            <div class={styles.form_item_down_action}>
                <a-icon type='edit' title='属性设置'
                    nativeOnClick={(e: any) => {
                        this.onCheckedItem(item, parentSelectItem);
                        e.stopPropagation();
                    }}
                />
                {
                    this.currentCheckedItemId === item.info.id ? (
                        <a-icon type='delete' title='删除'
                            nativeOnClick={(e: any) => {
                                this.onDeleteItem(index, parentDeleteItems);
                                e.stopPropagation();
                            }}
                        />
                    ) : ''
                }
            </div>
            {
                this.currentCheckedItemId === item.info.id ? (
                    <div class={styles.form_item_drag}>
                        <a-icon type='drag' class='drag-widget' />
                    </div>
                ) : ''
            }
        </div>;
    }
    private generateBaseInfo(item: any, index: number, parentDeleteItems: any, parentSelectItem: any) {
        if (!item.info.id) {
            return '';
        }
        return <div class={styles.baseInfo + ` ${this.currentCheckedItemId === item.info.id
            ? styles.active : null}`} key={item.info.id}>
            {
                item.info.columns[0].list.map((m: any, i: number) => [
                    m.info.type === 'form-item' ?
                        this.generateFormItem(m, i, item.info.columns[0].list, parentSelectItem, false) : '',
                    m.info.type === 'layout' ?
                        this.generateLayout(m, i, item.info.columns[0].list, parentSelectItem, false) : '',
                ])
            }
            {
                <div class={styles.form_item_down_action}>
                    <a-icon type='edit' title='属性设置'
                        nativeOnClick={(e: any) => {
                            this.onCheckedItem(item, parentSelectItem);
                            e.stopPropagation();
                        }}
                    />
                    {
                        this.currentCheckedItemId === item.info.id ? (
                            <a-icon type='delete' title='删除'
                                nativeOnClick={(e: any) => {
                                    this.onDeleteItem(index, parentDeleteItems);
                                    e.stopPropagation();
                                }}
                            />
                        ) : ''
                    }
                </div>
            }
            {
                this.currentCheckedItemId === item.info.id ? (
                    <div class={styles.form_item_drag}>
                        <a-icon type='drag' class='drag-widget' />
                    </div>
                ) : ''
            }
        </div>;
    }
    private onSave() {
        if (this.verificationDataKeyLoop(this.formDesginSchema.gridList)) {
            notificationHelper.error('当前表单存在未绑定字段的控件,请检查');
            return;
        }
        this.formDesginSchema.formDesignId = this.$route.query['id'];
        formDesginService.saveFormDesgin(this.formDesginSchema).subscribe(data => {
            notificationHelper.success('保存成功');
        });
    }
    private onPublish() {
        if (this.verificationDataKeyLoop(this.formDesginSchema.gridList)) {
            notificationHelper.error('当前表单存在未绑定字段的控件,请检查');
            return;
        }
        this.formDesginSchema.formDesignId = this.$route.query['id'];
        formDesginService.publishFormDesgin(this.formDesginSchema).subscribe(data => {
            this.isPublish = true;
            notificationHelper.success('发布成功');
        });
    }
    private onPreview() {
        if (this.verificationDataKeyLoop(this.formDesginSchema.gridList)) {
            notificationHelper.error('当前表单存在未绑定字段的控件,请检查');
            return;
        }
        this.previewVisible = true;
    }
    private onFormRules() {
        this.formRuleVisible = true;
    }
    private onFormRuleChange(value: boolean, data: any) {
        this.formRuleVisible = false;
        if (value) {
            this.formDesginSchema.ruleList.checkRules = data.checkRules;
            this.formDesginSchema.ruleList.displayRules = data.displayRules;
            this.formDesginSchema.ruleList.emptyRules = data.emptyRules;
            this.formDesginSchema.ruleList.editRules = data.editRules;
            this.formDesginSchema.ruleList.calculationRules = data.calculationRules;
            this.formDesginSchema.ruleList.styleRules = data.styleRules;
            this.formDesginSchema.ruleList.submitRules = data.submitRules;
        }
    }
    private verificationDataKeyLoop(items: any): boolean {
        let isError = false;
        for (const item of items) {
            if (item.info.type === 'form-item') {
                if (!item.config.dataKey) {
                    isError = true;
                }
            } else if (item.info.type === 'layout') {
                for (const column of item.info.columns) {
                    isError = this.verificationDataKeyLoop(column.list);
                    if (isError) {
                        break;
                    }
                }
            } else if (item.info.type === 'collapse-panel') {
                isError = this.verificationDataKeyLoop(item.info.columns[0].list);
            } else if (item.info.type === 'tab-panel') {
                for (const column of item.info.columns) {
                    isError = this.verificationDataKeyLoop(column.list);
                    if (isError) {
                        break;
                    }
                }
            } else if (item.info.type === 'table') {
                for (const column of item.info.columns) {
                    isError = this.verificationDataKeyLoop(column.list);
                    if (isError) {
                        break;
                    }
                }
            } else if (item.info.type === 'base-info') {
                isError = this.verificationDataKeyLoop(item.info.columns[0].list);
            }
            if (isError) {
                break;
            }
        }
        return isError;
    }
    private getBusinessComponents(items: any) {
        const tempBusinessComponents: any = [];
        items.map((m: any) => {
            switch (m.type) {
                case 'text':
                    const input = JSON.parse(JSON.stringify(components.input));
                    input.info.id = '';
                    input.info.name = m.label;
                    input.config.label = m.label;
                    input.config.dataKey = m.value;
                    input.config.placeholder = `请输入${m.label}`;
                    input.cdata = m.defaultValue;
                    tempBusinessComponents.splice(tempBusinessComponents.length, 0, input);
                    break;
                case 'number':
                    const inputNumber = JSON.parse(JSON.stringify(components.inputNumber));
                    inputNumber.info.id = '';
                    inputNumber.info.name = m.label;
                    inputNumber.config.label = m.label;
                    inputNumber.config.dataKey = m.value;
                    inputNumber.config.placeholder = `请输入${m.label}`;
                    inputNumber.cdata = m.defaultValue ? Number(m.defaultValue) : null;
                    tempBusinessComponents.splice(tempBusinessComponents.length, 0, inputNumber);
                    break;
                case 'table':
                    const table = JSON.parse(JSON.stringify(components.table));
                    table.info.id = '';
                    table.info.name = m.label;
                    table.config.label = m.label;
                    table.config.dataKey = m.value;
                    const children = this.getBusinessComponents(m.children);
                    children.map((c: any) => {
                        table.info.columns.splice(table.info.columns.length, 0,
                            {
                                id: c.info.id,
                                list: [c]
                            });
                    });
                    tempBusinessComponents.splice(tempBusinessComponents.length, 0, table);
                    break;
            }
        });
        return tempBusinessComponents;
    }
    private getSystemComponents(items: any) {
        const tempSystemComponents: any = [];
        items.map((m: any) => {
            const label = JSON.parse(JSON.stringify(components.label));
            label.info.id = '';
            label.info.name = m.parName;
            label.config.label = m.parName;
            label.config.dataKey = 'systemField' + m.parCode;
            label.config.systemField = true;
            label.config.systemFieldType = m.order;
            tempSystemComponents.splice(tempSystemComponents.length, 0, label);
        });
        return tempSystemComponents;
    }
    private onInitLayout() {
        this.formDesginSchema.gridList = [];
        let index = 0;
        const business = this.tempComponentsList.find((f: any) => f.group === 'business');
        business.components.map((m: any) => {
            switch (m.info.type) {
                case 'form-item':
                    const newFormItem = JSON.parse(JSON.stringify(m));
                    newFormItem.info.id = guidHelper.generate();
                    if (index === 0) {
                        const grid = JSON.parse(JSON.stringify(components.layout));
                        grid.info.id = guidHelper.generate();
                        grid.info.columns.map((c: any) => {
                            c.id = guidHelper.generate();
                        });
                        this.formDesginSchema.gridList.splice(this.formDesginSchema.gridList.length, 0, grid);
                    }
                    const lastGrid = this.formDesginSchema.gridList[this.formDesginSchema.gridList.length - 1];
                    if (index === 0) {
                        lastGrid.info.columns[0].list = [newFormItem];
                        index++;
                    } else if (index === 1) {
                        lastGrid.info.columns[1].list = [newFormItem];
                        index = 0;
                    } else {
                        index = 0;
                    }
                    break;
                case 'table':
                    const newTable = JSON.parse(JSON.stringify(m));
                    newTable.info.id = guidHelper.generate();
                    newTable.info.columns.map((c: any) => {
                        c.id = guidHelper.generate();
                        c.list.map((l: any) => l.info.id = guidHelper.generate());
                    });
                    this.formDesginSchema.gridList.splice(this.formDesginSchema.gridList.length, 0, newTable);
                    index = 0;
                    break;
            }
        });
    }
    created(): void {
        this.tempComponentsList = JSON.parse(JSON.stringify(componentsList));
        const id = this.$route.query['id'];
        const bizTypeId = this.$route.query['business-type-id'];
        const bizObjectCode = this.$route.query['business-object-code'];
        formDesginService.getFormDesginInfo(id).subscribe(data => {
            this.isPublish = data.status && data.status === 1 ? true : false;
            const saveSchma = JSON.parse(data.schema);
            if (saveSchma) {
                this.formDesginSchema = saveSchma;
                Object.keys(this.formDesginSchema.ruleList).map((r: any) => {
                    if (!this.formDesginSchema.ruleList[r]) {
                        this.formDesginSchema.ruleList[r] = [];
                    }
                });
            } else {
                this.formDesginSchema.info.title = data.name;
                this.formDesginSchema.info.formCode = data.code;
                this.formDesginSchema.info.description = data.name;
                this.formDesginSchema.info.isColon = 2;
                this.formDesginSchema.info.dataKey = bizObjectCode;
                this.formDesginSchema.info.businessTypeId = bizTypeId;
                this.formDesginSchema.info.businessObjectCode = bizObjectCode;
            }
        });
        formDesginService.getBusinessObjectFields(bizObjectCode).subscribe(data => {
            Vue.prototype.$tableFields = {};
            Vue.prototype.$ruleFieldsOptions = [];
            const mainFields = data.filter((d: any) => d.type !== 'table');
            Vue.prototype.$tableFields[bizObjectCode as string] = {
                value: bizObjectCode,
                type: '主表',
                label: '主表',
                children: mainFields.map((item: any) => ({
                    value: item.value,
                    label: item.label,
                }))
            };
            Vue.prototype.$ruleFieldsOptions.push({
                label: '主表字段',
                value: 'mainField',
                children: mainFields.map((item: any) => ({
                    value: item.value,
                    label: item.label,
                }))
            });
            const detail: any = [];
            const detailChildren: any = [];
            const detailFields = data.filter((d: any) => d.type === 'table');
            detailFields.forEach((df: any) => {
                Vue.prototype.$tableFields[df.value] = {
                    value: df.value,
                    type: '明细表',
                    label: df.label,
                    children: df.children.map((item: any) => ({
                        value: item.value,
                        label: item.label,
                    })),
                };
                detail.push({
                    label: df.label,
                    value: df.value
                });
                detailChildren.push({
                    label: df.label,
                    value: df.value,
                    children: df.children.map((item: any) => ({
                        value: item.value,
                        label: item.label,
                    })),
                });
            });
            if (detail.length > 0) {
                Vue.prototype.$ruleFieldsOptions.push({
                    label: '子表',
                    value: 'detail',
                    children: detail
                });
            }
            if (detailChildren.length > 0) {
                Vue.prototype.$ruleFieldsOptions.push({
                    label: '子表字段',
                    value: 'detailField',
                    children: detailChildren
                });
            }
            // 增加业务组件
            const business = this.tempComponentsList.find((f: any) => f.group === 'business');
            business.components = [...business.components, ...this.getBusinessComponents(data)];
        });
        formDesginService.getDataDictionay().subscribe(data => {
            Vue.prototype.$dataDictionary = data || [];
        });
        formDesginService.getIdocView().subscribe(data => {
            Vue.prototype.$idocview = data || '';
        });
        formDesginService.getSystemFields().subscribe(data => {
            const system = this.tempComponentsList.find((f: any) => f.group === 'system');
            system.components = [...system.components, ...this.getSystemComponents(data)];
        });
    }
    render() {
        return (
            <a-layout class={styles.layout}>
                <a-layout-sider
                    width='250px'
                    collapsible
                    collapsedWidth={0}
                    zeroWidthTriggerStyle={{ top: '0px', height: '40px', background: '#1890ff' }}
                >
                    <a-layout class={styles.layout}>
                        <a-layout-content class={styles.layout_components_content}>
                            <div class={styles.components}>
                                {this.tempComponentsList.map((f: any) => {
                                    return f.components.length > 0 ?
                                        [<div class={styles.group_title}>{f.title}</div>,
                                        <draggable
                                            tag='ul'
                                            list={f.components}
                                            group={{ name: 'people', pull: 'clone', put: false }}
                                            sort={false}
                                            ghostClass='ghost'
                                            move={() => true}
                                        >
                                            {f.components.map((m: any) => (
                                                <li class={styles.item_layout} id={`${m.info.type}_${guidHelper.generate()}`}>
                                                    <a>
                                                        <i class={`icon iconfont ${m.info.icon}`}></i>
                                                        <span>{m.info.name}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </draggable>] : '';
                                })}
                            </div>
                        </a-layout-content>
                    </a-layout>
                </a-layout-sider>
                <a-layout-content>
                    <a-layout class={styles.layout}>
                        <a-layout-content class={styles.layout_content}>
                            <a-layout-header class={styles.header}>
                                <a-popconfirm
                                    title='是否确定初始化布局，确定后将清空现有布局？'
                                    on-confirm={this.onInitLayout}
                                >
                                    <a-button type='link' icon='reload' size='small'>
                                        初始化布局
                                    </a-button>
                                </a-popconfirm>
                                <a-button type='link' icon='setting' size='small'
                                    on-click={this.onFormRules}>
                                    表单规则
                                </a-button>
                                <a-button type='link' icon='eye' size='small'
                                    on-click={this.onPreview}>
                                    预览
                                </a-button>
                                {
                                    !this.isPublish ? (
                                        <a-button type='link' icon='save' size='small'
                                            on-click={this.onSave}
                                        >
                                            保存
                                        </a-button>
                                    ) : ''
                                }
                                <a-button type='link' icon='save' size='small'
                                    on-click={this.onPublish}
                                >
                                    发布
                                </a-button>
                                <a-button type='link' icon='save' size='small'
                                    on-click={() => {
                                        this.formDesginSchema.gridList = [];
                                        Object.keys(this.formDesginSchema.ruleList).map((r: any) => {
                                            if (this.formDesginSchema.ruleList[r]) {
                                                this.formDesginSchema.ruleList[r] = [];
                                            }
                                        });
                                    }}
                                >
                                    清空
                                </a-button>
                                <form-rules
                                    item={this.formDesginSchema.ruleList}
                                    visible={this.formRuleVisible}
                                    on-change={this.onFormRuleChange}
                                ></form-rules>
                                <form-preview
                                    data={this.formDesginSchema}
                                    visible={this.previewVisible}
                                    on-change={() => this.previewVisible = false}
                                ></form-preview>
                            </a-layout-header>
                            <a-layout-content class={styles.content}>
                                <div class={styles.form}>
                                    {
                                        this.formDesginSchema.gridList.length === 0 ? (
                                            <div class={styles.form_empty}>拖入添加左侧控件绘制表单</div>
                                        ) : null
                                    }
                                    <a-form
                                        label-lign='right'
                                        label-col={{ style: `flex:0 0 150px` }}
                                        wrapper-col={{ style: 'flex:1 1 auto' }}
                                    >
                                        <draggable
                                            v-model={this.formDesginSchema.gridList}
                                            group={{
                                                name: 'people', put: (a: any, b: any, c: any, d: any) => {
                                                    const cs = c.id.split('_')[0];
                                                    return cs ? true : false;
                                                }
                                            }}
                                            animation={200}
                                            ghostClass={styles.ghost}
                                            handle='.drag-widget'
                                            class={styles.form_draggable}
                                            on-add={(event: any) => this.onAddItem(event.newIndex, this.formDesginSchema.gridList)}
                                        >
                                            <transition-group
                                                name='fade'
                                                tag='div'
                                                class={styles.form_transition}
                                            >
                                                {
                                                    this.formDesginSchema.gridList.map((m: any, i: number) => [
                                                        m.info.type === 'form-item' ?
                                                            this.generateFormItem(m, i, null, null) : '',
                                                        m.info.type === 'collapse-panel' ?
                                                            this.generateCollapsePanel(m, i, null, null) : '',
                                                        m.info.type === 'tab-panel' ?
                                                            this.generateTabPanel(m, i, null, null) : '',
                                                        m.info.type === 'layout' ?
                                                            this.generateLayout(m, i, null, null) : '',
                                                        m.info.type === 'table' ?
                                                            this.generateTable(m, i, null, null) : '',
                                                        m.info.type === 'base-info' ?
                                                            this.generateBaseInfo(m, i, null, null) : ''
                                                    ])
                                                }
                                            </transition-group>
                                        </draggable>
                                    </a-form>
                                </div>
                            </a-layout-content>
                        </a-layout-content>
                        <a-layout-sider
                            width='250px'
                            collapsible
                            reverseArrow
                            collapsedWidth={0}
                            zeroWidthTriggerStyle={{ top: '0px', height: '40px', background: '#1890ff' }}
                        >
                            <a-layout class={styles.layout}>
                                <a-layout-content class={styles.layout_config_content}>
                                    <div class={styles.config}>
                                        <div class={styles.config_header}>
                                            <div
                                                class={styles.config_tab +
                                                    ` ${this.currentCheckedTab === 'control' ?
                                                        styles.active : ''}`}
                                                on-click={() => this.currentCheckedTab = 'control'}
                                            >控件属性</div>
                                            <div
                                                class={styles.config_tab +
                                                    ` ${this.currentCheckedTab === 'page' ?
                                                        styles.active : ''}`}
                                                on-click={() => this.currentCheckedTab = 'page'}
                                            >表单属性</div>
                                        </div>
                                        <div class={styles.config_content}>
                                            {
                                                this.currentCheckedTab === 'page' ? (
                                                    <a-form-item label='表单名称'>
                                                        <a-input
                                                            v-model={this.formDesginSchema.info.title}
                                                            disabled />
                                                    </a-form-item>
                                                ) : (
                                                    this.currentCheckedItemId ?
                                                        this.getCurrentCheckedItemHtml :
                                                        (
                                                            <a-alert
                                                                message='请先选择控件'
                                                                type='warning'
                                                                show-icon
                                                                closable={false}
                                                            ></a-alert>
                                                        )
                                                )
                                            }
                                        </div>
                                    </div>
                                </a-layout-content>
                            </a-layout>
                        </a-layout-sider>
                    </a-layout>
                </a-layout-content>
            </a-layout>
        );
    }
}
