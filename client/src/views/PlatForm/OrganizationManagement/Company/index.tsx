import { Component, Vue } from 'vue-property-decorator';

@Component
export class Company extends Vue {
  render() {
    return <div> This is company page</div>;
  }
}
