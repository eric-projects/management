import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export class DraggableContainer extends Vue {
  @Prop() placeholder!: string;
  testName = 'input-2';
  render() {
    return <a-input placeholder={this.placeholder} />;
  }
}
