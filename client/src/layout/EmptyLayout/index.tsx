import { Component, Vue } from 'vue-property-decorator';

@Component
export class EmptyLayout extends Vue {
  render() {
    return <router-view key={this.$route.fullPath} />;
  }
}
