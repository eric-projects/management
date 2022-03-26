import { Component, Vue } from 'vue-property-decorator';

@Component
export class AttachmentSnapshot extends Vue {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <a-table
          pagination={false}
          data-source={[
            {
              key: '1',
              no: '1',
              name: `<${this.$t('attachment-columns.name')}>`,
              size: `<${this.$t('attachment-columns.size')}>`,
              uploadUser: `<${this.$t('attachment-columns.upload-user')}>`,
              uploadStep: `<${this.$t('attachment-columns.upload-step')}>`,
              uploadTime: `<${this.$t('attachment-columns.upload-time')}>`
            }
          ]}
        >
          <a-table-column title={this.$t('attachment-columns.no')} dataIndex='no' />
          <a-table-column title={this.$t('attachment-columns.name')} dataIndex='name' />
          <a-table-column title={this.$t('attachment-columns.size')} dataIndex='size' />
          <a-table-column title={this.$t('attachment-columns.upload-user')} dataIndex='uploadUser' />
          <a-table-column title={this.$t('attachment-columns.upload-step')} dataIndex='uploadStep' />
          <a-table-column title={this.$t('attachment-columns.upload-time')} dataIndex='uploadTime' />
        </a-table>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></div>
      </div>
    );
  }
}
