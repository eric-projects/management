import VueI18n from 'vue-i18n';

class I18nService {
  private i18n!: VueI18n;
  private storageKey = 'user.preferences.lang';

  init(instance: VueI18n) {
    this.i18n = instance;
    const lang = localStorage.getItem(this.storageKey);
    if (!!lang) {
      this.i18n.locale = lang;
    }
  }

  use(lang: 'en' | 'zh') {
    this.i18n.locale = lang;
    localStorage.setItem(this.storageKey, lang);
  }
}

export const i18nService = new I18nService();
