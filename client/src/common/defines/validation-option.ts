/**
 * 验证选项
 */
export interface ValidationOptions {
  /**
   * 遍历渲染的控件的下标
   */
  index?: number;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 验证规则
   */
  rules?: {
    /**
     * 必填的验证消息
     */
    required?: string;
    /**
     * 邮箱的验证消息
     */
    email?: string;
    /**
     * 正则的验证规则和消息
     */
    pattern?: { rule: string; help: string };
  };
}
