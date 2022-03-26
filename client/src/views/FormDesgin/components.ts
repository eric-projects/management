const inputJson = {
    info: {
        id: '',
        name: '单行文本框',
        key: 'mmt-input',
        type: 'form-item',
        icon: 'icon-caidan',
    },
    config: {
        label: '单行文本框',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: ''
};
const textAreaJson = {
    info: {
        id: '',
        name: '多行文本框',
        key: 'mmt-textarea',
        type: 'form-item',
        icon: 'icon-caidan1',
    },
    config: {
        label: '多行文本框',
        vshow: true,
        dataKey: '',
        display: true,
        disabled: true,
        placeholder: '',
        rows: 5,
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: ''
};
const inputNumberJson = {
    info: {
        id: '',
        name: '数字输入框',
        key: 'mmt-input-number',
        type: 'form-item',
        icon: 'icon-shuzi',
    },
    config: {
        label: '数字输入框',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '',
        precision: null,
        thousandths: false,
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: null
};
const selectJson = {
    info: {
        id: '',
        name: '下拉框',
        key: 'mmt-select',
        type: 'form-item',
        icon: 'icon-caidan4',
    },
    config: {
        label: '下拉框',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '',
        sourceType: 'custom',
        options: [],
        dictionaryKey: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: undefined
};
const radioJson = {
    info: {
        id: '',
        name: '单选框',
        key: 'mmt-radio',
        type: 'form-item',
        icon: 'icon-danxuanxuanzhong',
    },
    config: {
        label: '单选框',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '',
        sourceType: 'custom',
        options: [],
        dictionaryKey: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: ''
};
const checkBoxJson = {
    info: {
        id: '',
        name: '复选框',
        key: 'mmt-check-box',
        type: 'form-item',
        icon: 'icon-caidan3',
    },
    config: {
        label: '复选框',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '',
        sourceType: 'custom',
        options: [],
        dictionaryKey: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: []
};
const datePickerJson = {
    info: {
        id: '',
        name: '日期',
        key: 'mmt-date-picker',
        type: 'form-item',
        icon: 'icon-riqi',
    },
    config: {
        label: '日期',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        format: 'YYYY-MM-DD',
        displayModal: 'date',
        placeholder: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: ''
};
const uploadFilesJson = {
    info: {
        id: '',
        name: '文件上传',
        key: 'mmt-upload-files',
        type: 'form-item',
        icon: 'icon-lie4',
    },
    config: {
        label: '文件上传',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: []
};
const labelJson = {
    info: {
        id: '',
        name: '文字',
        key: 'mmt-label',
        type: 'form-item',
        icon: 'icon-caidan7',
    },
    config: {
        label: '文字',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        required: false,
        columnWidth: 200,
        columnAlign: 'left',
        valueType: 'default',
        precision: null,
        thousandths: false,
        options: [],
        format: '',
        systemField: false,
        systemFieldType: 0
    },
    cdata: ''
};
const hyperlinkJson = {
    info: {
        id: '',
        name: '超链接',
        key: 'mmt-hyperlink',
        type: 'form-item',
        icon: 'icon-lie5',
    },
    config: {
        label: '超链接',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        required: false,
        displayModal: 'networkLink',
        hasUnderline: true,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: []
};
const selectPersonJson = {
    info: {
        id: '',
        name: '选择人员',
        key: 'mmt-select-person',
        type: 'form-item',
        icon: 'icon-renyuan',
    },
    config: {
        label: '选择人员',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        isMultiple: false,
        placeholder: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: []
};
const selectOrganizationJson = {
    info: {
        id: '',
        name: '选择组织',
        key: 'mmt-select-organization',
        type: 'form-item',
        icon: 'icon-caidan12',
    },
    config: {
        label: '选择组织',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        isMultiple: false,
        placeholder: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: []
};
const wangeditorJson = {
    info: {
        id: '',
        name: '富文本',
        key: 'mmt-wangeditor',
        type: 'form-item',
        icon: 'icon-lie6',
    },
    config: {
        label: '富文本',
        dataKey: '',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '',
        required: false,
        columnWidth: 200,
        columnAlign: 'left'
    },
    cdata: ''
};
const layoutJson = {
    info: {
        id: '',
        name: '栅格',
        key: 'mmt-layout',
        type: 'layout',
        columns: [
            {
                id: '',
                span: 12,
                list: [],
            },
            {
                id: '',
                span: 12,
                list: [],
            },
        ],
        icon: 'icon-lie',
    },
    config: {
        dataKey: '',
        display: true
    }
};
const tableJson = {
    info: {
        id: '',
        name: '明细子表',
        key: 'mmt-table',
        type: 'table',
        columns: [
        ],
        icon: 'icon-caidan10',
    },
    config: {
        label: '明细子表',
        dataKey: '',
        vshow: true,
        display: true,
        disabled: true,
        required: false,
        hasSerialColumn: true,
        totalColumn: [],
        hasRowAddButton: true,
        hasRowDeleteButton: true
    },
    cdata: []
};
const collapsePanelJson = {
    info: {
        id: '',
        name: '折叠面板',
        key: 'mmt-collapse-panel',
        type: 'collapse-panel',
        columns: [
            {
                id: '',
                list: []
            }
        ],
        icon: 'icon-lie3',
    },
    config: {
        label: '折叠面板',
        dataKey: '',
        display: true
    }
};
const tabPanelJson = {
    info: {
        id: '',
        name: 'Tab面板',
        key: 'mmt-tab-panel',
        type: 'tab-panel',
        columns: [
            {
                id: '',
                list: []
            }
        ],
        icon: 'icon-lie2',
    },
    config: {
        tabPosition: 'top',
        options: [{ label: 'Tab面板1', value: '' }],
        dataKey: '',
        display: true
    }
};

const baseInfoFirstLineJson = {
    info: {
        id: '',
        name: '流程主题',
        key: 'mmt-input',
        type: 'form-item',
        icon: 'icon-caidan',
    },
    config: {
        label: '流程主题',
        dataKey: 'baseInfoTopic',
        vshow: true,
        readOnly: false,
        display: true,
        disabled: true,
        placeholder: '请输入流程主题',
        required: true,
        columnWidth: 200,
        columnAlign: 'left',
        systemField: true
    },
    cdata: ''
};
const baseInfoSecondLineJson = {
    info: {
        id: '',
        name: '栅格',
        key: 'mmt-layout',
        type: 'layout',
        columns: [
            {
                id: '',
                span: 12,
                list: [
                    {
                        info: {
                            id: '',
                            name: '申请人',
                            key: 'mmt-select',
                            type: 'form-item',
                            icon: 'icon-caidan4',
                        },
                        config: {
                            label: '申请人',
                            dataKey: 'baseInfoUserId',
                            vshow: true,
                            readOnly: false,
                            display: true,
                            disabled: true,
                            placeholder: '请选择申请人',
                            sourceType: 'custom',
                            options: [],
                            dictionaryKey: '',
                            required: true,
                            columnWidth: 200,
                            columnAlign: 'left',
                            systemField: true
                        },
                        cdata: undefined
                    }
                ],
            },
            {
                id: '',
                span: 12,
                list: [
                    {
                        info: {
                            id: '',
                            name: '所属组织',
                            key: 'mmt-label',
                            type: 'form-item',
                            icon: 'icon-caidan7',
                        },
                        config: {
                            label: '所属组织',
                            dataKey: 'baseInfoOrganizationPathText',
                            vshow: true,
                            readOnly: false,
                            display: true,
                            disabled: true,
                            required: false,
                            columnWidth: 200,
                            columnAlign: 'left',
                            valueType: 'default',
                            precision: null,
                            thousandths: false,
                            options: [],
                            format: '',
                            systemField: true
                        },
                        cdata: ''
                    }
                ],
            },
        ],
        icon: 'icon-lie',
    },
    config: {
        dataKey: '',
        display: true,
        systemField: true
    }
};
const baseInfoThirdLineJson = {
    info: {
        id: '',
        name: '栅格',
        key: 'mmt-layout',
        type: 'layout',
        columns: [
            {
                id: '',
                span: 12,
                list: [
                    {
                        info: {
                            id: '',
                            name: '申请人职位',
                            key: 'mmt-select',
                            type: 'form-item',
                            icon: 'icon-caidan4',
                        },
                        config: {
                            label: '申请人职位',
                            dataKey: 'baseInfoPositionId',
                            vshow: true,
                            readOnly: false,
                            display: true,
                            disabled: true,
                            placeholder: '请选择申请人职位',
                            sourceType: 'custom',
                            options: [],
                            dictionaryKey: '',
                            required: true,
                            columnWidth: 200,
                            columnAlign: 'left',
                            systemField: true
                        },
                        cdata: undefined
                    }
                ],
            },
            {
                id: '',
                span: 12,
                list: [
                    {
                        info: {
                            id: '',
                            name: '申请时间',
                            key: 'mmt-label',
                            type: 'form-item',
                            icon: 'icon-caidan7',
                        },
                        config: {
                            label: '申请时间',
                            dataKey: 'baseInfoStartDate',
                            vshow: true,
                            readOnly: false,
                            display: true,
                            disabled: true,
                            required: false,
                            columnWidth: 200,
                            columnAlign: 'left',
                            valueType: 'date',
                            precision: null,
                            thousandths: false,
                            options: [],
                            format: 'YYYY-MM-DD',
                            systemField: true
                        },
                        cdata: ''
                    }
                ],
            },
        ],
        icon: 'icon-lie',
    },
    config: {
        dataKey: '',
        display: true,
        systemField: true
    }
};
const baseInfoJson = {
    info: {
        id: '',
        name: '基本信息',
        key: 'mmt-base-info',
        type: 'base-info',
        columns: [
            {
                id: '',
                list: [
                    baseInfoFirstLineJson,
                    baseInfoSecondLineJson,
                    baseInfoThirdLineJson
                ]
            }
        ],
        icon: 'icon-caidan2',
    },
    config: {
        dataKey: '',
        display: true,
        systemField: true
    }
};

export const componentsList: any = [
    {
        title: '基本控件', components: [
            inputJson,
            textAreaJson,
            inputNumberJson,
            selectJson,
            radioJson,
            checkBoxJson,
            datePickerJson,
            uploadFilesJson,
            labelJson,
            hyperlinkJson
        ],
        group: 'base'
    },
    {
        title: '高级控件', components: [
            selectPersonJson,
            selectOrganizationJson,
            wangeditorJson,
            tableJson
        ],
        group: 'senior'
    },
    {
        title: '布局控件', components: [
            layoutJson,
            collapsePanelJson,
            tabPanelJson
        ],
        group: 'layout'
    },
    {
        title: '业务控件', components: [
        ],
        group: 'business'
    },
    {
        title: '系统内置控件', components: [
            baseInfoJson
        ],
        group: 'system'
    }
];

export const components: any = {
    input: inputJson,
    inputNumber: inputNumberJson,
    select: selectJson,
    label: labelJson,
    table: tableJson,
    layout: layoutJson,
    baseInfo: baseInfoJson
};
