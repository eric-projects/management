import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PlatForm extends Vue {
  render() {
    return (
      <router-view />
    );
  }
}
