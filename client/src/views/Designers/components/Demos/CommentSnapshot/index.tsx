import { Component, Vue } from 'vue-property-decorator';

@Component
export class CommentSnapshot extends Vue {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <a-textarea
          placeholder={`${this.$t('components.text')}${this.$t('framework.prepositions.space')}${this.$t(
            'designers.form-designer.comment'
          )}`}
          auto-size={{ minRows: 5, maxRows: 5 }}
        />
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></div>
      </div>
    );
  }
}
