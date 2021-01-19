import { Component, Vue } from 'vue-property-decorator';

@Component
export class PaginationMixin extends Vue {
  get page(): { index: string; size: string } {
    return {
      index: (this.$route.query['page-index'] as string) || '1',
      size: (this.$route.query['page-size'] as string) || '10'
    };
  }
}
