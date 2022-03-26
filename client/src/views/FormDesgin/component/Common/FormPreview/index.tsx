import { authService } from '@/services/auth';
import { formDesginService } from '@/views/FormDesgin/service';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import * as comps from '@/components';
import * as helper from '@/common/utils';

@Component({
})
export class FormPreview extends Vue {
    @Prop() data!: any;
    @Prop() visible!: boolean;
    private regScript = /<script>.*?<\/script>/gis;
    private instance!: any;
    @Watch('visible')
    visibleChange(newVal: boolean) {
        if (newVal) {
            this.getTemplate();
        }
    }
    @Emit('change')
    private onChange() {
    }
    private onCancel() {
        this.onChange();
    }
    private onOk() {
        this.onChange();
    }
    private onValuesChange(props?: any, values?: any, value?: any): any {
        const changeValue = (values || {}).value || (value || {}).value;
        Object.assign(this.instance.value, changeValue);
    }
    private getTemplate() {
        if (this.visible) {
            formDesginService.getFormTemplate(this.data).subscribe(html => {
                // 解析页面中的脚本
                const scripts = html.match(this.regScript) as RegExpMatchArray;
                if (scripts && scripts.length > 0) {
                    html = html.replace(this.regScript, '');
                    eval(scripts[0].replace(/^<script>|<\/script>$/g, ''));
                } else {
                    (window as any).component = {};
                }
                // 动态创建页面组件
                const options = Object.assign(
                    {
                        template: html,
                    },
                    (window as any).component
                );
                Vue.component('custom-form', options);
                // 挂载创建的组件
                this.$nextTick(() => {
                    const comp = Vue.component('custom-form');
                    comp.prototype.user = authService.user;
                    comp.prototype.instanceNumber = this.number;
                    Object.keys(helper).forEach(h => {
                        comp.prototype[h] = (helper as any)[h];
                    });

                    const instance = new comp({ components: { ...comps }, i18n: this.$i18n, router: this.$router });
                    instance.$mount('#custom-form');
                    instance.$data.form = instance.$form.createForm(this.instance, {
                        onValuesChange: this.onValuesChange,
                    });
                    (window as any).instance = instance;
                    this.instance = instance;
                    // 可编辑
                    this.instance.editable = true;
                    // this.instance.idocview = this.$idocview;
                });
            });
        }
    }
    created(): void {
        this.getTemplate();
    }
    render() {
        return (
            <a-modal
                title='预览'
                visible={this.visible}
                width='1024px'
                dialog-style={{ top: '20px' }}
                on-cancel={this.onCancel}
                on-ok={this.onOk}
            >
                <div id='custom-form' />
            </a-modal>
        );
    }
}
