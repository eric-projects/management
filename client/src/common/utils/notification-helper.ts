import { notification } from 'ant-design-vue';
import { i18nHelper } from './i18n-helper';

notification.config({ top: '100px' });

class NotificationHelper {
  private countArray: number[] = [];
  private count = 0;

  info(content: string | string[] | ((h?: any) => void), title = '') {
    this.notify('info', content, title);
  }

  success(content: string | string[] | ((h?: any) => void), title = '') {
    this.notify('success', content, title);
  }

  warning(content: string | string[] | ((h?: any) => void), title = '') {
    this.notify('warning', content, title);
  }

  error(content: string | string[] | ((h?: any) => void), title = '') {
    this.notify('error', content, title);
  }

  private notify(type: string, content: string | string[] | ((h?: any) => void), title = '') {
    let description: string | string[] | ((h?: any) => void) = '';

    if (title === '') {
      title = i18nHelper.getLocale('framework.notification');
    }

    this.count++;
    this.countArray.push(this.count);
    if (this.countArray.length > 3) {
      notification.close('' + this.countArray[0]);
      this.countArray.shift();
    }

    if (Array.isArray(content)) {
      description = h => {
        return (content as string[]).map(i => {
          return h('div', i);
        });
      };
    } else {
      description = content;
    }

    (notification as any)[type]({
      key: '' + this.count,
      message: title,
      description: description
    });
  }
}

export const notificationHelper = new NotificationHelper();
