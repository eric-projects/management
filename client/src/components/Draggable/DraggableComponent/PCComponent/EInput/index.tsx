import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ componentName: 'input-1', name: 'input-3' })
export class EInput extends Vue {
  @Prop() placeholder!: string;
  testName = 'input-2';
  
  // 输入 - 容器值
  public get InputContainer(): number {
    return 0;
  }

  render() {
    return <a-input placeholder={this.placeholder} />;
  }
}
