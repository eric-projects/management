import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import styles from './component.process-diagram.module.less';
import { processDiagramService } from './service';

@Component
export class ProcessDiagram extends Vue {
  @Prop() visible!: boolean;
  @Prop() instanceNumber!: string;
  @Prop() processId!: string;
  @Prop() instanceRecords!: any;

  private cardLoading = false;
  private url = '';
  @Emit('visible') onVisibleChange(v: boolean) {}

  @Watch('processId') onProcessIdChange(v: string) {
    if (v) {
      processDiagramService.getUrl().subscribe(s => {
        this.url = `${s}?process-id=${v}`;
        this.$forceUpdate();
        this.framLoad();
      });
    }
  }

  @Watch('instanceNumber') onInstanceIdChange(v: string) {
    if (v) {
      processDiagramService.getUrl().subscribe(s => {
        this.url = `${s}?instance-id=${v}`;
        this.$forceUpdate();
        this.framLoad();
      });
    }
  }

  private framLoad() {
    const iframe: any = document.querySelector('#iframe');
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', () => {
        this.updateIframeAttribute(iframe);
      });
    } else {
      iframe.onload = () => {
        this.updateIframeAttribute(iframe);
      };
    }
  }

  private updateIframeAttribute(iframe: any) {
    iframe.contentWindow.postMessage(this.instanceRecords || [], '*');
    setTimeout(() => {
      iframe.width = '100%';
      this.cardLoading = false;
    }, 1000);
  }

  created() {
    this.cardLoading = true;
  }

  render() {
    return (
      <a-modal
        class={styles.diagram}
        title={this.$t('main.flow-map')}
        visible={this.visible}
        width={'65%'}
        style={'padding:0'}
        footer={null}
        on-cancel={() => {
          this.onVisibleChange(false);
        }}
      >
        <a-spin spinning={this.cardLoading}>
          <iframe id='iframe' width='0' height='400px' frameborder='no' border='0' scrolling='no' src={this.url} />
        </a-spin>
      </a-modal>
    );
  }
}
