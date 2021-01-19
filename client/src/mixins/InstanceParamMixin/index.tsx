import { Component, Vue } from 'vue-property-decorator';

@Component
export class InstanceParamMixin extends Vue {
  get isIndependent(): boolean {
    return this.$route.path.startsWith('/independent');
  }

  get pageType(): string {
    const path = this.$route.path.replace('/independent', '').replace('/', '');
    return path ? path.split('/')[0] : '';
  }

  get number(): string {
    return this.$route.params['number'];
  }

  get processId(): string {
    return this.$route.query['process-id'] as string;
  }

  get draftId(): string {
    return this.$route.query['draft-id'] as string;
  }

  get taskId(): string {
    return this.$route.query['task-id'] as string;
  }

  get bsid(): string {
    return this.$route.query['bsid'] as string;
  }

  get btid(): string {
    return this.$route.query['btid'] as string;
  }

  get boid(): string {
    return this.$route.query['boid'] as string;
  }
}
