import { Component, Vue } from 'vue-property-decorator';

@Component
export class PresetLayout extends Vue {
  render() {
    return <router-view />;
  }
}
