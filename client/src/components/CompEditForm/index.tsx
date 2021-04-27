import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { getComponentFromProp } from '@/common/utils';
import { CompCard } from '../CompCard';
import { FormFieldDto } from './comp-edit-form.types';

@Component({ components: { CompCard } })
export class CompEditForm extends Vue {
  private _textFieldsClone: FormFieldDto[] = [];
  @Prop() textFieldsClone!: FormFieldDto[];
  @Prop() title!: string;
  private imgSrc = '';

  @Watch('textFieldsClone') onModeChange(v: FormFieldDto[]) {
    this._textFieldsClone = [...(v || [])];
    this.$forceUpdate();
  }
  created() {
    // languageService.langeAsync$.subscribe(s => {
    //   import(`@/assets/images/no-result-tips-${s}.png`).then(v => {
    //     this.imgSrc = v.default;
    //   });
    // });
  }

  render() {
    const titleLeftDom = getComponentFromProp(this, 'title-left');
    const titleRightDom = getComponentFromProp(this, 'title-right');
    return (
      <comp-card>
        {this.title ? <template slot='title'>{this.title}</template> : null}
        {titleLeftDom ? <template slot='title'>{titleLeftDom}</template> : null}
        {titleRightDom ? <template slot='extra'>{titleRightDom}</template> : null}
        {this._textFieldsClone && this._textFieldsClone.length > 0 ? (
          <a-descriptions>
            {this._textFieldsClone.map((field: FormFieldDto) => {
              return (
                <a-descriptions-item label={field.label} span={field.columnCount || 2}>
                  {field.value}
                </a-descriptions-item>
              );
            })}
          </a-descriptions>
        ) : (
          <img class='no-result-tips' src={this.imgSrc} />
        )}
      </comp-card>
    );
  }
}
