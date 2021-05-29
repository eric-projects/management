import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import tinymce from 'tinymce/tinymce'; // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'; // 编辑器引入
import 'tinymce/themes/silver/theme'; // 编辑器主题
import 'tinymce/icons/default'; // 引入编辑器图标icon，不引入则不显示对应图标

@Component({ components: { Editor } })
export class CompRich extends Vue {
  private richData = '';
  init = {
    selector: '#tinymce',
    language_url: '/tinymce/langs/zh_CN.js', // 汉化路径是自定义的，一般放在public或static里面
    language: 'zh_CN',
    skin_url: '/tinymce/skins/ui/oxide', // 皮肤
    toolbar_location: '/',
    toolbar: [], // richToolbar:'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify
    // | bullist numlist outdent indent | lists image media table';
    fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', // 字体大小
    height: 500, // 高度
    placeholder: '在这里输入文字',

    branding: false, // 隐藏右下角技术支持
  };
  @Prop() data!: string;
  @Prop({ default: false }) disabled!: boolean;
  @Emit('data-change') dataChange(value: string) {}

  @Watch('data') onDataChange(value: string): void {
    this.richData = value;
  }

  @Watch('richData') onRichDataChange(value: string): void {
    this.dataChange(value);
  }

  created() {
    tinymce.init({});
  }
  render() {
    return (
      <div>
        <editor id='tinymceId' disabled={this.disabled} outputFormat='text' v-model={this.richData} init={this.init}></editor>
        <div style='position: absolute;top: 10px;right: 30px;z-index: 1;'>{this.$slots.default}</div>
      </div>
    );
  }
}
