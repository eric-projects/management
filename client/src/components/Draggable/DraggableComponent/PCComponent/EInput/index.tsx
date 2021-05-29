import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ componentName: 'input-1', name: 'input-3' })
export class EInput extends Vue {
  @Prop() placeholder!: string;
  testName = 'input-2';
  render() {
    return <a-input placeholder={this.placeholder} />;
  }
}
