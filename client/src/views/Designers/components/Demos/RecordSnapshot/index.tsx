import { Component, Vue } from 'vue-property-decorator';

// import { RecordTimeline } from '@/components/RecordTimeline';
// import { ApproveState } from '@/components/ApproveStatus/types';
// import { InstanceRecordDto } from '@/components/Instance/InstanceRecord/types';

@Component({
  // components: { RecordTimeline },
})
export class RecordSnapshot extends Vue {
  // private records!: InstanceRecordDto[][];

  created() {
    // this.records = [
    //   [
    //     {
    //       userName: `<${this.$t('instance.record.user-name')}>`,
    //       stepName: `<${this.$t('instance.record.step-name')}>`,
    //       state: ApproveState.start,
    //       resolveTime: '2020-03-30 15:00',
    //       commentTextArray: ['<comment>'],
    //     },
    //   ],
    //   [
    //     {
    //       userName: `<${this.$t('instance.record.user-name')}>`,
    //       stepName: `<${this.$t('instance.record.step-name')}>`,
    //       state: ApproveState.approved,
    //       stayDuration: '1',
    //       resolveTime: '2020-03-30 18:00',
    //       commentTextArray: ['<comment>'],
    //     },
    //   ],
    //   [
    //     {
    //       userName: `<${this.$t('instance.record.user-name')}>`,
    //       stepName: `<${this.$t('instance.record.step-name')}>`,
    //       state: ApproveState.processing,
    //       commentTextArray: [],
    //     },
    //   ],
    //   [
    //     {
    //       userName: `<${this.$t('instance.record.user-name')}>`,
    //       stepName: `<${this.$t('instance.record.step-name')}>`,
    //       state: ApproveState.todo,
    //       commentTextArray: [],
    //     },
    //   ],
    // ];
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        {/* <record-timeline records={this.records} /> */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
      </div>
    );
  }
}
