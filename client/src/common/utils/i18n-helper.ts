import { vueContext } from '../defines/vue-context';

class I18nHelper {
  getLocale(key: string | string[]): string {
    if (key instanceof Array) {
      return key.map(k => vueContext.$t(k)).join('');
    }

    return `${vueContext.$t(key)}`;
  }

  getLocaleObject(key: string): any {
    return vueContext.$t(key);
  }

  getReplaceLocale(key: string, replaceKey: string): string {
    return `${vueContext.$t(key)}`.replace('{{value}}', `${vueContext.$t(replaceKey)}`);
  }
}

export const i18nHelper = new I18nHelper();
