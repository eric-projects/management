import { Modal, Spin } from 'ant-design-vue';
import { ModalConfirm, ModalOptions } from 'ant-design-vue/types/modal';
import { Subject, Subscription } from 'rxjs';

import { vueContext } from '../defines/vue-context';

class GlobalLoadingHelper {
  private loadingModal: ModalConfirm | undefined;
  private counter = 0;
  private counting$ = new Subject<number>();
  private countingSub!: Subscription;

  constructor() {
    this.subscribeCounting();
  }

  private createLoading() {
    return vueContext.$createElement('div', {}, [
      vueContext.$createElement(Spin, {
        style: {
          marginBottom: '10px',
        },
      }),
      vueContext.$createElement('div', 'loading...'),
    ]);
  }

  private removeLoading() {
    if (this.loadingModal) {
      this.loadingModal.destroy();
      this.loadingModal = undefined;
    }
  }

  private subscribeCounting() {
    if (this.countingSub) {
      this.countingSub.unsubscribe();
    }

    this.countingSub = this.counting$.subscribe(step => {
      this.counter += step;

      if (this.counter <= 0) {
        this.counter = 0;
        this.removeLoading();
        this.subscribeCounting();
      }
    });
  }

  create() {
    this.counting$.next(1);
    if (!this.loadingModal) {
      const options: ModalOptions = {
        keyboard: false,
        maskClosable: false,
        width: 160,
        class: 'global-loading',
        zIndex: 9999,
        content: this.createLoading(),
      };
      this.loadingModal = Modal.info(options);
    }
  }

  destroy() {
    this.counting$.next(-1);
  }
}

export const globalLoadingHelper = new GlobalLoadingHelper();
