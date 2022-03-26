import { guidHelper, notificationHelper } from '@/common/utils';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import styles from './form-rules.module.less';

@Component({
})
export class FormRules extends Vue {
    @Prop() item!: any;
    @Prop() visible!: boolean;
    private copyItem: any = {};
    private checkRuleVisible = false;
    private ruleVisible = false;
    private expressionVisble = false;
    private copyCheckRule: any = {};
    private copyRule: any = {};
    private checkRuleOption = [
        { label: '必填', value: 'empty' },
        { label: 'EMAIL地址', value: 'emailAddress' },
        { label: 'URL地址', value: 'urlAddress' },
        { label: '手机号', value: 'mobileNumber' },
        { label: '身份证号', value: 'idCardNumber' },
        { label: '邮政编码', value: 'postalCode' },
        { label: '文本最小长度', value: 'textMinLength' },
        { label: '文本最大长度', value: 'textMaxLength' },
        { label: '数值最小值', value: 'numberMinLength' },
        { label: '数值最大值', value: 'numberMaxLength' },
        { label: '正则表达式', value: 'regularExpression' },
    ];
    private operatorOptions = [
        { label: '等于', value: '=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' },
        { label: '不等于', value: '!=' },
        { label: '包含', value: 'include' },
        { label: '不包含', value: 'notIncluded' }
    ];
    private displayThenTypeOptions = [
        {
            label: '显示', value: 'show'
        },
        {
            label: '隐藏', value: 'hide'
        }
    ];
    private editThenTypeOptions = [
        {
            label: '可编辑', value: 'edit'
        },
        {
            label: '不可编辑', value: 'notEdit'
        }
    ];
    private emptyThenTypeOptions = [
        {
            label: '必填', value: 'empty'
        },
        {
            label: '非必填', value: 'notEmpty'
        }
    ];
    private styleThenTypeOptions = [
        {
            label: '红色', value: 'red-preview'
        },
        {
            label: '蓝色', value: 'blue-preview'
        },
        {
            label: '黑色', value: 'black-preview'
        },
        {
            label: '黄色', value: 'yellow-preview'
        }
    ];
    private expressionItem: any = {
        index: 0,
        item: {}
    };
    private expressionOperators = [
        '(',
        ')',
        '+',
        '-',
        '*',
        '/',
        '\'',
        'SUM',
        'MAX',
        'MIN',
        'AVG',
        'COUNT',
        'ZhMoney'
    ];
    private copyDetailTableCheckRules = [];
    private selectTab = 'check';
    private defaultExpressionKey: any = [];
    private isEditRule = false;
    private editRuleIndex = -1;
    private sel: any = null;
    private range: any = null;
    private form!: WrappedFormUtils;
    @Watch('visible')
    visibleChange(newVal: boolean) {
        if (newVal) {
            this.copyItem = JSON.parse(JSON.stringify(this.item));
            console.log(this.copyItem);
        }
    }
    @Emit('change')
    private onChange(value: boolean, data: any) {
    }
    private onCancel() {
        this.onChange(false, null);
    }
    private onOk() {
        this.onChange(true, this.copyItem);
    }
    private getFieldCheck(key: string, record: any) {
        const ruleText: any = [];
        if (this.copyItem.checkRules) {
            const currentRules = this.copyItem.checkRules.find((i: any) => i.fieldCode === key + '.' + record.value);
            if (currentRules) {
                (currentRules.fieldRules || []).forEach((f: any) => {
                    ruleText.push(this.getCheckRuleOptionText(f.name));
                });
            }
        }
        return ruleText.join('、');
    }
    private onFieldCheck(key: string, record: any) {
        this.checkRuleVisible = true;
        const {
            form: { resetFields },
        } = this;
        resetFields();
        const currentRules = this.copyItem.checkRules.find((i: any) => i.fieldCode === key + '.' + record.value);
        if (currentRules) {
            this.copyCheckRule = JSON.parse(JSON.stringify(currentRules));
        } else {
            this.copyCheckRule = {
                fieldCode: key + '.' + record.value,
                fieldRules: []
            };
        }
    }
    private onCheckRuleCancel() {
        this.checkRuleVisible = false;
        this.deleteCheckRule();
    }
    private onCheckRuleOk() {
        const {
            form: { validateFields },
        } = this;
        validateFields((errors, values) => {
            if (!errors) {
                this.checkRuleVisible = false;
                const currentRules = this.copyItem.checkRules.find((i: any) => i.fieldCode === this.copyCheckRule.fieldCode);
                if (currentRules) {
                    currentRules.fieldRules = this.copyCheckRule.fieldRules;
                } else {
                    this.copyItem.checkRules.push(this.copyCheckRule);
                }
                this.deleteCheckRule();
            }
        });
    }
    private onCheckRuleAdd() {
        this.copyCheckRule.fieldRules.splice(this.copyCheckRule.fieldRules.length, 0, {
            name: 'empty',
            tips: '{title}-必填项未输入',
            param1: null,
            param2: ''
        });
    }
    private deleteCheckRule() {
        const currentRulesIndex = this.copyItem.checkRules.findIndex((i: any) => i.fieldCode === this.copyCheckRule.fieldCode);
        if (currentRulesIndex > -1 && this.copyCheckRule.fieldRules.length === 0) {
            this.copyItem.checkRules.splice(currentRulesIndex, 1);
        }
    }
    private onCheckRuleOptionChange(value: any, rule: any) {
        rule.tips = value === 'empty' ? '{title}-必填项未输入' : '';
        rule.param1 = null;
        rule.param2 = '';
    }
    private onRuleAdd() {
        this.ruleVisible = true;
        this.isEditRule = false;
        this.editRuleIndex = -1;
        const {
            form: { resetFields },
        } = this;
        resetFields();
        switch (this.selectTab) {
            case 'display':
            case 'empty':
            case 'edit':
            case 'style':
            case 'submit':
                this.copyRule = {
                    when: [
                        {
                            fieldCode: [],
                            condition: '',
                            expressionHtml: '',
                            expressionValue: '',
                            valueFields: []
                        }
                    ],
                    then: [
                        {
                            execType: '',
                            fieldCode: [],
                            tips: ''
                        }
                    ]
                };
                break;
            case 'calculation':
                this.copyRule = {
                    fieldCode: [],
                    expressionHtml: '',
                    expressionValue: '',
                    valueFields: []
                };
                break;
        }
    }
    private onRuleEdit(item: any, index: number) {
        this.ruleVisible = true;
        this.isEditRule = true;
        this.editRuleIndex = index;
        this.copyRule = JSON.parse(JSON.stringify(item));
    }
    private onRuleDelete(items: any, i: number) {
        items.splice(i, 1);
    }
    private onRuleCancel() {
        this.ruleVisible = false;
    }
    private onRuleOk() {
        const {
            form: { validateFields },
        } = this;
        validateFields((errors, values) => {
            if (!errors) {
                this.ruleVisible = false;
                const index = this.isEditRule ? this.editRuleIndex : this.copyItem.displayRules.length;
                const delIndex = this.isEditRule ? 1 : 0;
                switch (this.selectTab) {
                    case 'display':
                        this.copyItem.displayRules.splice(index, delIndex, this.copyRule);
                        break;
                    case 'empty':
                        this.copyItem.emptyRules.splice(index, delIndex, this.copyRule);
                        break;
                    case 'edit':
                        this.copyItem.editRules.splice(index, delIndex, this.copyRule);
                        break;
                    case 'style':
                        this.copyItem.styleRules.splice(index, delIndex, this.copyRule);
                        break;
                    case 'calculation':
                        this.copyItem.calculationRules.splice(index, delIndex, this.copyRule);
                        break;
                    case 'submit':
                        this.copyItem.submitRules.splice(index, delIndex, this.copyRule);
                        break;
                }
            }
        });
    }
    private onWhenAdd() {
        this.copyRule.when.splice(this.copyRule.when.length, 0, {
            fieldCode: [],
            condition: '',
            expressionHtml: '',
            expressionValue: '',
            valueFields: []
        });
    }
    private onThenAdd() {
        this.copyRule.then.splice(this.copyRule.then.length, 0, {
            execType: '',
            fieldCode: [],
            tips: ''
        });
    }
    private onDelete(items: any, index: number) {
        items.splice(index, 1);
    }
    private getFieldOptions(type: string) {
        // if (type === 'commonWhen') {
        //     if (this.selectTab === 'submit') {
        //         return this.$ruleFieldsOptions.filter((m: any) => m.value === 'mainField');
        //     }
        //     return this.$ruleFieldsOptions.filter((m: any) => m.value === 'mainField' || m.value === 'detailField');
        // } else if (type === 'commonThen') {
        //     if (this.selectTab === 'style') {
        //         return this.$ruleFieldsOptions.filter((m: any) => m.value === 'mainField' || m.value === 'detailField');
        //     }
        //     return this.$ruleFieldsOptions;
        // }
    }
    private getCheckRuleOptionText(value: string) {
        const option = this.checkRuleOption.find((f: any) => f.value === value);
        return option ? option.label : '';
    }
    private getFieldOptionText(values: any) {
        let items: any[] = [];//this.$ruleFieldsOptions;
        const text: any = [];
        values.map((m: any) => {
            const item = items.find((f: any) => f.value === m);
            text.push(item.label);
            items = item.children;
        });
        return text.join('/');
    }
    private getOperatorOptionText(value: string) {
        const option = this.operatorOptions.find((f: any) => f.value === value);
        return option ? option.label : '';
    }
    private getThenTypeOptionText(value: string) {
        let option = null;
        if (this.selectTab === 'display') {
            option = this.displayThenTypeOptions.find((f: any) => f.value === value);
        } else if (this.selectTab === 'empty') {
            option = this.emptyThenTypeOptions.find((f: any) => f.value === value);
        } else if (this.selectTab === 'edit') {
            option = this.editThenTypeOptions.find((f: any) => f.value === value);
        } else if (this.selectTab === 'style') {
            option = this.styleThenTypeOptions.find((f: any) => f.value === value);
        }
        return option ? option.label : '';
    }
    private getThenTypeOptions() {
        if (this.selectTab === 'display') {
            return this.displayThenTypeOptions;
        } else if (this.selectTab === 'empty') {
            return this.emptyThenTypeOptions;
        } else if (this.selectTab === 'edit') {
            return this.editThenTypeOptions;
        } else if (this.selectTab === 'style') {
            return this.styleThenTypeOptions;
        }
    }
    private onEditExpression(item: any, index: number) {
        this.expressionVisble = true;
        // Object.keys(this.$tableFields).map((m: any, i: number) =>
        //     this.defaultExpressionKey.push(this.$tableFields[m].value));
        this.expressionItem.index = index;
        this.expressionItem.item = JSON.parse(JSON.stringify(item));
        this.$nextTick(() => {
            (this.$refs.expressionText as any).focus();
            (this.$refs.expressionText as any).innerHTML = item.expressionHtml;
        });
    }
    private onExpressionOk() {
        this.expressionVisble = false;
        this.expressionItem.item.expressionHtml = (this.$refs.expressionText as any).innerHTML;
        const dom = document.createElement('div');
        dom.innerHTML = this.expressionItem.item.expressionHtml;
        let value = '';
        this.expressionItem.item.valueFields = [];
        dom.childNodes.forEach((m: any) => {
            if (m.localName === 'img') {
                value += m.attributes['data-key'].nodeValue;
                this.expressionItem.item.valueFields.push(m.attributes['data-key'].nodeValue);
            } else if (m.localName === undefined) {
                value += m.nodeValue;
            }
        });
        this.expressionItem.item.expressionValue = value;
        if (this.selectTab === 'calculation') {
            this.copyRule = this.expressionItem.item;
        } else {
            this.copyRule.when.splice(this.expressionItem.index, 1, this.expressionItem.item);
        }
    }
    private onExpressionCancel() {
        this.expressionVisble = false;
    }
    private onExpressionFieldAdd(item: any, parentKey: string) {
        const url = this.textBecomeImg(item.label, 20, '#fff');
        const tempKey = `${parentKey}.${item.value}`;
        const htmlStr = `<img data-key='${tempKey}' style='background: #3296fa;margin: 0 10px 0;' src='${url}'>`;
        this.insertExpression(htmlStr);
    }
    private onExpressionOperatorAdd(it: string) {
        if (
            it === 'SUM' ||
            it === 'MAX' ||
            it === 'MIN' ||
            it === 'AVG' ||
            it === 'COUNT' ||
            it === 'ZhMoney'
        ) {
            const url = this.textBecomeImg(it, 20, '#fff');
            const tempKey = `statisticsFunc.${it}`;
            const htmlStr = `<img data-key='${tempKey}' style='background: #3296fa;margin: 0 10px 0;' src='${url}'>`;
            it = htmlStr;
        }
        this.insertExpression(it);
    }
    private onExpressionBlur() {
        this.sel = window.getSelection();
        this.range = this.sel.getRangeAt(0);
        this.range.deleteContents();
    }
    private insertExpression(it: string) {
        if (this.sel === null || this.range === null) {
            (this.$refs.expressionText as any).focus();
            this.onExpressionBlur();
        }
        const doc = document as any;
        if (window.getSelection()) {
            if (this.sel.getRangeAt && this.sel.rangeCount) {
                const el = document.createElement('div');
                el.innerHTML = it;
                const frag: any = document.createDocumentFragment();
                const node: any = el.firstChild;
                const lastNode: any = frag.appendChild(node);
                this.range.insertNode(frag);
                if (lastNode) {
                    this.range = this.range.cloneRange();
                    this.range.setStartAfter(lastNode);
                    this.range.collapse(true);
                    this.sel.removeAllRanges();
                    this.sel.addRange(this.range);
                }
            }
        } else if (doc.selection && doc.selection.type !== 'Control') {
            doc.selection.createRange().pasteHTML(it);
        }
    }
    private getCrad(showType: string) {
        if (showType === 'view') {
            let items: any = [];
            switch (this.selectTab) {
                case 'display':
                    items = this.copyItem.displayRules;
                    break;
                case 'empty':
                    items = this.copyItem.emptyRules;
                    break;
                case 'edit':
                    items = this.copyItem.editRules;
                    break;
                case 'style':
                    items = this.copyItem.styleRules;
                    break;
                case 'calculation':
                    items = this.copyItem.calculationRules;
                    break;
                case 'submit':
                    items = this.copyItem.submitRules;
                    break;
            }
            return items.map((m: any, i: number) => {
                if (this.selectTab === 'calculation') {
                    this.$nextTick(() => {
                        const el = document.createElement('div');
                        el.innerHTML = m.expressionHtml;
                        const pre = this.$refs[`expressionHtmlView_${i}`] as any;
                        if (pre.hasChildNodes()) {
                            pre.removeChild(pre.firstChild);
                        }
                        pre.appendChild(el);
                    });
                    return <a-card style={{ 'margin-top': '8px' }}>
                        <div class={styles.ruleLayout}>
                            <a-form-item
                                wrapper-col={{ span: 24 }}
                                style={{ 'margin-right': '8px' }}
                            >
                                <a-tag class={styles.tag}>
                                    {
                                        this.getFieldOptionText(m.fieldCode)
                                    }
                                </a-tag>
                            </a-form-item>
                            <a-form-item
                                wrapper-col={{ span: 24 }}
                                style={{ 'margin-right': '8px' }}
                            >
                                <a-tag class={styles.tag}>
                                    等于
                                </a-tag>
                            </a-form-item>
                            <a-form-item
                                wrapper-col={{ span: 24 }}
                            >
                                <a-tag class={styles.tag}>
                                    <pre ref={`expressionHtmlView_${i}`}>
                                    </pre>
                                </a-tag>
                            </a-form-item>
                            <div class={styles.ruleAction}>
                                <a-icon type='edit' title='编辑'
                                    on-click={() => this.onRuleEdit(m, i)}
                                />
                                <a-icon type='delete' title='删除'
                                    on-click={() => this.onRuleDelete(items, i)}
                                />
                            </div>
                        </div>
                    </a-card>;
                } else {
                    return <a-card style={{ 'margin-top': '8px' }}>
                        <div class={styles.ruleLayout}>
                            <a-form-item label='如果'>
                            </a-form-item>
                            <div>
                                {
                                    m.when ? (m.when.map((w: any, wi: number) => {
                                        this.$nextTick(() => {
                                            const el = document.createElement('div');
                                            el.innerHTML = w.expressionHtml;
                                            const pre = this.$refs[`expressionHtmlView_${i}${wi}`] as any;
                                            if (pre.hasChildNodes()) {
                                                pre.removeChild(pre.firstChild);
                                            }
                                            pre.appendChild(el);
                                        });
                                        return <div class={styles.ruleLayout}>
                                            <a-form-item
                                                wrapper-col={{ span: 24 }}
                                                style={{ 'margin-right': '8px' }}
                                            >
                                                <a-tag class={styles.tag}>
                                                    {
                                                        this.getFieldOptionText(w.fieldCode)
                                                    }
                                                </a-tag>
                                            </a-form-item>
                                            <a-form-item
                                                wrapper-col={{ span: 24 }}
                                                style={{ 'margin-right': '8px' }}
                                            >
                                                <a-tag class={styles.tag}>
                                                    {
                                                        this.getOperatorOptionText(w.condition)
                                                    }
                                                </a-tag>
                                            </a-form-item>
                                            <a-form-item
                                                wrapper-col={{ span: 24 }}
                                            >
                                                <a-tag class={styles.tag}>
                                                    <pre ref={`expressionHtmlView_${i}${wi}`}>
                                                    </pre>
                                                </a-tag>
                                            </a-form-item>
                                        </div>;
                                    })) : ''
                                }
                            </div>
                        </div>
                        <div class={styles.ruleLayout}>
                            <a-form-item label='那么'>
                            </a-form-item>
                            <div>
                                {
                                    m.then ? (m.then.map((t: any) => {
                                        return <div class={styles.ruleLayout}>
                                            {
                                                this.selectTab !== 'submit' ? [
                                                    <a-form-item
                                                        wrapper-col={{ span: 24 }}
                                                        style={{ 'margin-right': '8px' }}
                                                    >
                                                        <a-tag class={styles.tag}>
                                                            {
                                                                this.getThenTypeOptionText(t.execType)
                                                            }
                                                        </a-tag>
                                                    </a-form-item>,
                                                    <a-form-item
                                                        wrapper-col={{ span: 24 }}
                                                        style={{ 'margin-right': '8px' }}
                                                    >
                                                        <a-tag class={styles.tag}>
                                                            {
                                                                this.getFieldOptionText(t.fieldCode)
                                                            }
                                                        </a-tag>
                                                    </a-form-item>
                                                ] : ''
                                            }
                                            {
                                                (this.selectTab === 'empty' && t.execType === 'empty') ||
                                                    this.selectTab === 'submit' ?
                                                    (
                                                        <a-form-item
                                                            wrapper-col={{ span: 24 }}
                                                            style={{ 'margin-right': '8px' }}
                                                        >
                                                            <a-tag class={styles.tag}>
                                                                {
                                                                    t.tips
                                                                }
                                                            </a-tag>
                                                        </a-form-item>
                                                    ) : ''
                                            }
                                        </div>;
                                    })) : ''
                                }
                            </div>
                        </div>
                        <div class={styles.ruleAction}>
                            <a-icon type='edit' title='编辑'
                                on-click={() => this.onRuleEdit(m, i)}
                            />
                            <a-icon type='delete' title='删除'
                                on-click={() => this.onRuleDelete(items, i)}
                            />
                        </div>
                    </a-card>;
                }
            });
        } else if (showType === 'edit') {
            if (this.selectTab === 'calculation') {
                this.$nextTick(() => {
                    const el = document.createElement('div');
                    el.innerHTML = this.copyRule.expressionHtml;
                    const pre = this.$refs[`expressionHtml_${this.copyRule.length}`] as any;
                    if (pre.hasChildNodes()) {
                        pre.removeChild(pre.firstChild);
                    }
                    pre.appendChild(el);
                });
                return <a-form form={this.form}>
                    <div class={styles.ruleLayout}>
                        <a-form-item
                            label=' '
                            label-col={{ flex: '10px' }}
                            wrapper-col={{ flex: '95%' }}
                            style={{ 'width': '250px', 'margin-right': '8px', 'display': 'flex' }}
                            colon={false}
                        >
                            <a-cascader
                                placeholder=''
                                options={this.getFieldOptions('commonWhen')}
                                v-decorator={
                                    [
                                        `when_left_field_${this.copyRule.length}`, {
                                            initialValue: this.copyRule.fieldCode,
                                            rules: [{
                                                required: true,
                                            }]
                                        }
                                    ]
                                }
                                on-change={(e: any) => this.copyRule.fieldCode = e}
                            ></a-cascader>
                        </a-form-item>
                        <a-form-item
                            label='等于'
                            label-col={{ flex: '95%' }}
                            wrapper-col={{ flex: '10px' }}
                            style={{ 'width': '100px', 'margin-right': '8px', 'display': 'flex' }}
                            colon={false}
                        ></a-form-item>
                        <a-form-item
                            label=' '
                            label-col={{ flex: '10px' }}
                            wrapper-col={{ flex: '95%' }}
                            style={{ 'width': '400px', 'margin-right': '8px', 'display': 'flex' }}
                            colon={false}
                        >
                            <div class={styles.expressionDiv}
                                v-decorator={
                                    [
                                        `expression_${this.copyRule.length}`, {
                                            initialValue: this.copyRule.expressionValue,
                                            rules: [{
                                                required: true,
                                            }]
                                        }
                                    ]
                                }
                            >
                                <pre class={styles.expressionStyle} ref={`expressionHtml_${this.copyRule.length}`}>
                                </pre>
                                <a-icon type='edit' class={styles.icon}
                                    on-click={() => this.onEditExpression(this.copyRule, this.copyRule.length - 1)} />
                            </div>
                        </a-form-item>
                    </div>
                </a-form>;
            } else {
                return <a-form form={this.form}>
                    <div class={styles.ruleLayout}>
                        <a-form-item label='如果'>
                        </a-form-item>
                        <div>
                            {
                                this.copyRule.when ? (this.copyRule.when.map((m: any, i: number) => {
                                    this.$nextTick(() => {
                                        const el = document.createElement('div');
                                        el.innerHTML = m.expressionHtml;
                                        const pre = this.$refs[`expressionHtml_${i}`] as any;
                                        if (pre.hasChildNodes()) {
                                            pre.removeChild(pre.firstChild);
                                        }
                                        pre.appendChild(el);
                                    });
                                    return <div class={styles.ruleLayout}>
                                        <a-form-item
                                            label=' '
                                            label-col={{ flex: '10px' }}
                                            wrapper-col={{ flex: '95%' }}
                                            style={{ 'width': '250px', 'margin-right': '8px', 'display': 'flex' }}
                                            colon={false}
                                        >
                                            <a-cascader
                                                placeholder=''
                                                options={this.getFieldOptions('commonWhen')}
                                                v-decorator={
                                                    [
                                                        `when_left_field_${i}`, {
                                                            initialValue: m.fieldCode,
                                                            rules: [{
                                                                required: true,
                                                            }]
                                                        }
                                                    ]
                                                }
                                                on-change={(e: any) => m.fieldCode = e}
                                            ></a-cascader>
                                        </a-form-item>
                                        <a-form-item
                                            label=' '
                                            label-col={{ flex: '10px' }}
                                            wrapper-col={{ flex: '95%' }}
                                            style={{ 'width': '150px', 'margin-right': '8px', 'display': 'flex' }}
                                            colon={false}
                                        >
                                            <a-select
                                                options={this.operatorOptions}
                                                v-decorator={
                                                    [
                                                        `operator_${i}`, {
                                                            initialValue: m.condition,
                                                            rules: [{
                                                                required: true,
                                                            }]
                                                        }
                                                    ]
                                                }
                                                on-change={(e: any) => m.condition = e}
                                            ></a-select>
                                        </a-form-item>
                                        <a-form-item
                                            label=' '
                                            label-col={{ flex: '10px' }}
                                            wrapper-col={{ flex: '95%' }}
                                            style={{ 'width': '400px', 'margin-right': '8px', 'display': 'flex' }}
                                            colon={false}
                                        >
                                            <div class={styles.expressionDiv}
                                                v-decorator={
                                                    [
                                                        `expression_${i}`, {
                                                            initialValue: m.expressionValue,
                                                            rules: [{
                                                                required: true,
                                                            }]
                                                        }
                                                    ]
                                                }
                                            >
                                                <pre class={styles.expressionStyle} ref={`expressionHtml_${i}`}>
                                                </pre>
                                                <a-icon type='edit' class={styles.icon}
                                                    on-click={() => this.onEditExpression(m, i)} />
                                            </div>
                                        </a-form-item>
                                        {
                                            i > 0 ? (
                                                <a-icon type='minus-circle' class={styles.icon}
                                                    on-click={() => this.onDelete(this.copyRule.when, i)} />
                                            ) : ''
                                        }
                                        <a-icon type='plus-circle' class={styles.icon}
                                            on-click={() => this.onWhenAdd()} />
                                    </div>;
                                })) : ''
                            }
                        </div>
                    </div>
                    <div class={styles.ruleLayout}>
                        <a-form-item label='那么'>
                        </a-form-item>
                        <div>
                            {
                                this.copyRule.then ? (this.copyRule.then.map((m: any, i: number) => {
                                    return <div class={styles.ruleLayout}>
                                        {
                                            this.selectTab !== 'submit' ? [
                                                <a-form-item
                                                    label=' '
                                                    label-col={{ flex: '10px' }}
                                                    wrapper-col={{ flex: '95%' }}
                                                    style={{ 'width': '150px', 'margin-right': '8px', 'display': 'flex' }}
                                                    colon={false}
                                                >
                                                    <a-select
                                                        options={this.getThenTypeOptions()}
                                                        v-decorator={
                                                            [
                                                                `then_options_${i}`, {
                                                                    initialValue: m.execType,
                                                                    rules: [{
                                                                        required: true,
                                                                    }]
                                                                }
                                                            ]
                                                        }
                                                        on-change={(e: any) => m.execType = e}
                                                    ></a-select>
                                                </a-form-item>,
                                                <a-form-item
                                                    label=' '
                                                    label-col={{ flex: '10px' }}
                                                    wrapper-col={{ flex: '95%' }}
                                                    style={{ 'width': '250px', 'margin-right': '8px', 'display': 'flex' }}
                                                    colon={false}
                                                >
                                                    <a-cascader
                                                        placeholder=''
                                                        options={this.getFieldOptions('commonThen')}
                                                        v-decorator={
                                                            [
                                                                `then_field_${i}`, {
                                                                    initialValue: m.fieldCode,
                                                                    rules: [{
                                                                        required: true,
                                                                    }]
                                                                }
                                                            ]
                                                        }
                                                        on-change={(e: any) => m.fieldCode = e}
                                                    ></a-cascader>
                                                </a-form-item>
                                            ] : ''
                                        }
                                        {
                                            (this.selectTab === 'empty' && m.execType === 'empty') ||
                                                this.selectTab === 'submit' ?
                                                (
                                                    <a-form-item
                                                        label=' '
                                                        label-col={{ flex: '10px' }}
                                                        wrapper-col={{ flex: '95%' }}
                                                        style={{ 'width': '150px', 'margin-right': '8px', 'display': 'flex' }}
                                                        colon={false}
                                                    >
                                                        <a-input
                                                            v-decorator={
                                                                [
                                                                    `then_tip_${i}`, {
                                                                        initialValue: m.tips,
                                                                        rules: [{
                                                                            required: true,
                                                                        }]
                                                                    }
                                                                ]
                                                            }
                                                            on-change={(e: any) => m.tips = e.target.value}
                                                        ></a-input>
                                                    </a-form-item>
                                                ) : ''
                                        }
                                        {
                                            i > 0 ? (
                                                <a-icon type='minus-circle' class={styles.icon}
                                                    on-click={() => this.onDelete(this.copyRule.then, i)} />
                                            ) : ''
                                        }
                                        <a-icon type='plus-circle' class={styles.icon}
                                            on-click={() => this.onThenAdd()} />
                                    </div>;
                                })) : ''
                            }
                        </div>
                    </div>
                </a-form>;
            }
        }
    }
    private textBecomeImg(text: string, fontsize: number, fontcolor: string) {
        const canvas = document.createElement('canvas');
        let $buHeight = 0;
        if (fontsize <= 32) {
            $buHeight = 1;
        } else if (fontsize > 32 && fontsize <= 60) {
            $buHeight = 2;
        } else if (fontsize > 60 && fontsize <= 80) {
            $buHeight = 4;
        } else if (fontsize > 80 && fontsize <= 100) {
            $buHeight = 6;
        } else if (fontsize > 100) {
            $buHeight = 10;
        }
        canvas.height = fontsize + $buHeight;
        const context: any = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = fontcolor;
        context.font = fontsize + 'px Arial';
        context.textBaseline = 'middle';
        context.fillText(text, 5, fontsize / 2);

        canvas.width = context.measureText(text).width;
        context.fillStyle = fontcolor;
        context.font = 14 + 'px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillText(text, 5, fontsize / 2);

        const dataUrl = canvas.toDataURL('image/png');
        return dataUrl;
    }
    private getTitle() {
        let title = '';
        switch (this.selectTab) {
            case 'display':
                title = '显示规则';
                break;
            case 'empty':
                title = '必填规则';
                break;
            case 'edit':
                title = '修改规则';
                break;
            case 'style':
                title = '样式规则';
                break;
            case 'calculation':
                title = '计算规则';
                break;
            case 'submit':
                title = '提交规则';
                break;
        }
        return title;
    }
    private onEmptyChange(e: any, item: any, key: string) {
        if (e.target.checked) {
            item = {
                fieldCode: key,
                fieldRules: [
                    {
                        name: 'empty',
                        tips: '{title}-必填项未输入',
                        param1: null,
                        param2: ''
                    }
                ]
            };
            this.copyItem.checkRules.splice(this.copyItem.checkRules.length, 0, item);
        } else {
            const index = this.copyItem.checkRules.findIndex((f: any) => f.fieldCode === key);
            this.copyItem.checkRules.splice(index, 1);
            item = null;
        }
    }
    created(): void {
        this.copyItem = JSON.parse(JSON.stringify(this.item));
        this.form = this.$form.createForm(this, { name: guidHelper.generate() });
    }
    render() {
        return (
            <a-modal
                title='表单规则'
                visible={this.visible}
                width='1000px'
                dialog-style={{ top: '20px' }}
                on-cancel={this.onCancel}
                on-ok={this.onOk}
            >
                <a-tabs v-model={this.selectTab}>
                    <a-tab-pane key='check' tab='校验规则'>
                        <a-tabs default-active-key='check_0'>
                            {
                                // this.$tableFields ? Object.keys(this.$tableFields).map((m: any, i: number) => {
                                //     const field = this.$tableFields[m];
                                //     const columns: any = [
                                //         {
                                //             title: '序号',
                                //             width: 100,
                                //             align: 'center',
                                //             customRender: (text: any, record: any, index: number) => {
                                //                 return index + 1;
                                //             }
                                //         },
                                //         {
                                //             title: '字段',
                                //             dataIndex: 'value'
                                //         },
                                //         {
                                //             title: '标题',
                                //             dataIndex: 'label'
                                //         },
                                //         {
                                //             title: '值校验',
                                //             scopedSlots: { customRender: 'operation' }
                                //         }
                                //     ];
                                //     const scopedSlotMap: any = {
                                //         operation: (text: any, record: any, index: number) => {
                                //             return [<a-button
                                //                 on-click={() => this.onFieldCheck(m, record)}
                                //             >编辑</a-button>,
                                //             this.getFieldCheck(m, record)
                                //             ];
                                //         }
                                //     };
                                //     let item: any = null;
                                //     if (field.type === '明细表') {
                                //         item = this.copyItem.checkRules.find((f: any) => f.fieldCode === `${field.value}.${field.value}`);
                                //     }
                                //     return <a-tab-pane
                                //         key={`check_${i}`}
                                //         tab={field.label}
                                //     >
                                //         {
                                //             field.type === '明细表' ? (
                                //                 <div style={{ 'margin-bottom': '6px' }}>
                                //                     <span class={styles.detail_title}>明细表是否必填</span>
                                //                     <a-checkbox checked={item && item.fieldRules.length > 0 ? true : false}
                                //                         on-change={(e: any) =>
                                //                             this.onEmptyChange(e, item, `${field.value}.${field.value}`)}>
                                //                         必填
                                //                     </a-checkbox>
                                //                     {
                                //                         item && item.fieldRules.length > 0 ? (
                                //                             <a-input v-model={item.fieldRules[0].tips} style={{ width: '150px' }}></a-input>
                                //                         ) : ''
                                //                     }
                                //                 </div>
                                //             ) : ''
                                //         }
                                //         <a-table
                                //             rowKey={(record: any, index: number) => index}
                                //             columns={columns}
                                //             dataSource={field.children}
                                //             scopedSlots={scopedSlotMap}
                                //             pagination={false}
                                //         >
                                //         </a-table>
                                //     </a-tab-pane>;
                                // }) : ''
                            }
                        </a-tabs>
                        <a-modal
                            title='数据有效性'
                            visible={this.checkRuleVisible}
                            width='600px'
                            dialog-style={{ top: '20px' }}
                            on-cancel={this.onCheckRuleCancel}
                            on-ok={this.onCheckRuleOk}
                        >
                            <a-button
                                on-click={this.onCheckRuleAdd}
                            >
                                新增
                            </a-button>
                            <a-form
                                form={this.form}
                                label-col={{ span: 6 }}
                                wrapper-col={{ span: 18 }}
                            >
                                {
                                    this.copyCheckRule.fieldRules ? (
                                        this.copyCheckRule.fieldRules.map((m: any, i: number) => (
                                            <a-card style={{ 'margin-top': '8px' }}>
                                                <a-form-item
                                                    label='有效性检查'
                                                >
                                                    <a-select
                                                        options={this.checkRuleOption}
                                                        v-model={m.name}
                                                        on-change={(value: any) => this.onCheckRuleOptionChange(value, m)}
                                                    >
                                                    </a-select>
                                                </a-form-item>
                                                <a-form-item
                                                    label='校验失败提示'
                                                >
                                                    <a-input
                                                        placeholder='请输入校验失败提示'
                                                        v-decorator={
                                                            [
                                                                `check_${i}`, {
                                                                    initialValue: m.tips,
                                                                    rules: [{
                                                                        required: true,
                                                                        message: '请输入校验失败提示'
                                                                    }]
                                                                }
                                                            ]
                                                        }
                                                        on-change={(e: any) => m.tips = e.target.value}
                                                    ></a-input>
                                                </a-form-item>
                                                {
                                                    m.name === 'textMaxLength' || m.name === 'textMinLength' ||
                                                        m.name === 'numberMaxLength' || m.name === 'numberMinLength' ? (
                                                        <a-form-item
                                                            label={this.getCheckRuleOptionText(m.name)}
                                                        >
                                                            <a-input-number
                                                                precision={0}
                                                                placeholder={`请输入${this.getCheckRuleOptionText(m.name)}`}
                                                                style={{ width: '100%' }}
                                                                v-decorator={
                                                                    [
                                                                        `check_${m.name}_${i}`, {
                                                                            initialValue: m.param1,
                                                                            rules: [{
                                                                                required: true,
                                                                                message: `请输入${this.getCheckRuleOptionText(m.name)}`
                                                                            }]
                                                                        }
                                                                    ]
                                                                }
                                                                on-change={(e: any) => m.param1 = e}
                                                            ></a-input-number>
                                                        </a-form-item>
                                                    ) : ''
                                                }
                                                {
                                                    m.name === 'regularExpression' ? (
                                                        <a-form-item
                                                            label={this.getCheckRuleOptionText(m.name)}
                                                        >
                                                            <a-input
                                                                placeholder={`请输入${this.getCheckRuleOptionText(m.name)}`}
                                                                v-decorator={
                                                                    [
                                                                        `check_${m.name}_${i}`, {
                                                                            initialValue: m.param2,
                                                                            rules: [{
                                                                                required: true,
                                                                                message: `请输入${this.getCheckRuleOptionText(m.name)}`
                                                                            }]
                                                                        }
                                                                    ]
                                                                }
                                                                on-change={(e: any) => m.param2 = e.target.value}
                                                            ></a-input>
                                                        </a-form-item>
                                                    ) : ''
                                                }
                                                <div class={styles.ruleAction}>
                                                    <a-icon type='delete' title='删除'
                                                        on-click={() => this.onRuleDelete(this.copyCheckRule.fieldRules, i)}
                                                    />
                                                </div>
                                            </a-card>)
                                        )
                                    ) : ''
                                }
                            </a-form>
                        </a-modal>
                    </a-tab-pane>
                    <a-tab-pane key='display' tab='显示规则'>
                        <a-button
                            on-click={this.onRuleAdd}
                        >
                            新增
                        </a-button>
                        {
                            this.selectTab === 'display' ? this.getCrad('view') : ''
                        }
                    </a-tab-pane>
                    <a-tab-pane key='empty' tab='必填规则'>
                        <a-button
                            on-click={this.onRuleAdd}
                        >
                            新增
                        </a-button>
                        {
                            this.selectTab === 'empty' ? this.getCrad('view') : ''
                        }
                    </a-tab-pane>
                    <a-tab-pane key='edit' tab='修改规则'>
                        <a-button
                            on-click={this.onRuleAdd}
                        >
                            新增
                        </a-button>
                        {
                            this.selectTab === 'edit' ? this.getCrad('view') : ''
                        }
                    </a-tab-pane>
                    <a-tab-pane key='style' tab='样式规则'>
                        <a-button
                            on-click={this.onRuleAdd}
                        >
                            新增
                        </a-button>
                        {
                            this.selectTab === 'style' ? this.getCrad('view') : ''
                        }
                    </a-tab-pane>
                    <a-tab-pane key='calculation' tab='计算规则'>
                        <a-button
                            on-click={this.onRuleAdd}
                        >
                            新增
                        </a-button>
                        {
                            this.selectTab === 'calculation' ? this.getCrad('view') : ''
                        }
                    </a-tab-pane>
                    <a-tab-pane key='submit' tab='提交规则'>
                        <a-button
                            on-click={this.onRuleAdd}
                        >
                            新增
                        </a-button>
                        {
                            this.selectTab === 'submit' ? this.getCrad('view') : ''
                        }
                    </a-tab-pane>
                </a-tabs>
                {
                    this.ruleVisible ? (
                        <a-modal
                            title={this.getTitle}
                            visible={true}
                            width='1000px'
                            dialog-style={{ top: '20px' }}
                            on-cancel={this.onRuleCancel}
                            on-ok={this.onRuleOk}
                        >
                            {
                                this.getCrad('edit')
                            }
                        </a-modal>
                    ) : ''
                }
                {
                    this.expressionItem && this.expressionVisble ? (
                        <a-modal
                            title='编辑公式'
                            visible={true}
                            width='800px'
                            dialog-style={{ top: '20px' }}
                            on-cancel={this.onExpressionCancel}
                            on-ok={this.onExpressionOk}
                        >
                            <div class={styles.expressionModal}>
                                <div class={styles.expressionLeft}>
                                    <a-collapse v-model={this.defaultExpressionKey}
                                        expand-icon-position='right'>
                                        {
                                            // Object.keys(this.$tableFields).map((m: any, i: number) => {
                                            //     return <a-collapse-panel key={this.$tableFields[m].value}
                                            //         header={this.$tableFields[m].label}>
                                            //         {
                                            //             this.$tableFields[m].children.map((c: any, ci: number) => {
                                            //                 const parentKey = `${this.$tableFields[m].type === '明细表' ? 'detailField' : 'mainField'}.${m}`;
                                            //                 return <div class={styles.expressionField}
                                            //                     on-click={() => this.onExpressionFieldAdd(c, parentKey)}
                                            //                 >
                                            //                     {
                                            //                         c.label
                                            //                     }
                                            //                 </div>;
                                            //             })
                                            //         }
                                            //     </a-collapse-panel>;
                                            // })
                                        }
                                    </a-collapse>
                                </div>
                                <div class={styles.expressionRight}>
                                    <div class={styles.rightHeader}>
                                        {
                                            this.expressionOperators.map((m: any, i: number) => {
                                                return <a-button
                                                    class={styles.button}
                                                    on-click={() => this.onExpressionOperatorAdd(m)}
                                                >
                                                    {
                                                        m
                                                    }
                                                </a-button>;
                                            })
                                        }
                                    </div>
                                    <div class={styles.rightContent}
                                        contenteditable={true}
                                        on-blur={this.onExpressionBlur}
                                        ref='expressionText'
                                    >
                                    </div>
                                </div>
                            </div>
                        </a-modal>
                    ) : ''
                }
            </a-modal>
        );
    }
}
