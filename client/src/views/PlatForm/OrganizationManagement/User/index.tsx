import { Component, Vue } from 'vue-property-decorator';

@Component
export class User extends Vue {
  render() {
    return <div> This is user page</div>;
  }
}
