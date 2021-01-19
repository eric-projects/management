export const Settings = {
  /**
   * 应用标识
   */
  AppKey: 'customer',
  /**
   * 默认语言
   */
  DefaultLang: 'zh',
  /**
   * 支持的所有语言
   */
  Languages: [{ name: '中文', code: 'zh' }, { name: 'English', code: 'en' }],
  /**
   * 用户语言偏好的前端缓存 Key
   */
  UserLanguageCacheKey: 'user.preferences.lang',
  /**
   * 用户菜单收缩展开偏好的前端缓存 Key
   */
  UserMenuViewStateCacheKey: 'user.preferences.menu',
  /**
   * 左侧菜单展开的宽度
   */
  MenuExpandedWidth: 200,
  /**
   * 左侧菜单折叠的宽度
   */
  MenuCollapsedWidth: 80,
  /**
   * 菜单默认折叠 屏幕宽度边界
   */
  ScreenBoundary: 1366,
  /**
   * 是否启用流程地图组织筛选
   */
  EnableOrganizationFilter: true,
  /**
   * 是否启用流程代理
   */
  EnableProcessProxy: true,
  /**
   * 流程处理超时警告天数
   */
  ProcessOvertimeWarningDays: 2,
  /**
   * 流程处理超时紧急天数
   */
  ProcessOvertimeUrgencyDays: 0.5,
};
