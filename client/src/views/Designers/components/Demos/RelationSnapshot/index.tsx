import { Component, Vue } from 'vue-property-decorator';

@Component
export class RelationSnapshot extends Vue {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <a-table
          pagination={false}
          data-source={[
            {
              key: '1',
              no: '1',
              number: `<${this.$t('relation-columns.number')}>`,
              topic: `<${this.$t('relation-columns.topic')}>`,
              startUser: `<${this.$t('relation-columns.start-user')}>`,
              startTime: `<${this.$t('relation-columns.start-time')}>`
            }
          ]}
        >
          <a-table-column title={this.$t('relation-columns.no')} dataIndex='no' />
          <a-table-column title={this.$t('relation-columns.number')} dataIndex='number' />
          <a-table-column title={this.$t('relation-columns.topic')} dataIndex='topic' />
          <a-table-column title={this.$t('relation-columns.start-user')} dataIndex='startUser' />
          <a-table-column title={this.$t('relation-columns.start-time')} dataIndex='startTime' />
        </a-table>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></div>
      </div>
    );
  }
}
