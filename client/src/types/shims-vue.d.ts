import Vue from 'vue';

declare module 'vue/types/vue' {
  interface NotificationHelper {
    error: (content: string | string[] | ((h?: any) => void), title?: string) => void;
    success: (content: string | string[] | ((h?: any) => void), title?: string) => void;
    warning: (content: string | string[] | ((h?: any) => void), title?: string) => void;
  }

  interface I18nHelper {
    getLocale: (key: string | string[]) => string;
  }

  interface Vue {
    $notify: NotificationHelper;
    $l: I18nHelper;

    // 实例相关挂载
    isIndependent: boolean;
    pageType: string;
    number: string;
    processId: string;
    draftId: string;
    taskId: string;
    bsid: string;
    btid: string;
    boid: string;

    // workbench 相关挂载
    amendUrlQueryString: (additional?: { [key: string]: any }) => void;
    isMailView: boolean;
    isCategoryMode: boolean;

    // 页码相关挂载
    page: { index: string; size: string };
  }
}
