import Vue, { VNode } from 'vue';
import { MD5 } from 'crypto-js';
import { Validation, ValidationOptions } from '../defines';

export class FormHelper {
  private cacheKey = 'validationKey';
  private validationCache: { [key: string]: Validation } = {};
  private validationFlags: string[] = [];

  /**
   * 表单验证助手
   * @param noCache 是否禁用缓存，使用缓存时首次验证不会被触发，适用于异步加载初始值的表单
   */
  constructor(private noCache?: boolean) {}

  /**
   * 对值进行验证（方法内部会对方法体进行唯一性处理）
   * @param value 控件的值
   * @param rule 验证规则，string 型默认为 required 验证（默认可空，空时取控件的 placeholder）
   */
  validate(value: any, rule?: string | ValidationOptions): { touch: (callback: (validation: Validation) => any) => any } {
    return {
      touch: (callback: (validation: Validation) => any) => {
        const callbackSignature = callback.toString();
        let key = MD5(callbackSignature).toString();

        let help: string;
        let disabled = false;

        if (rule === undefined) {
          // 如果没有提供必填验证，则从函数签名 placeholder 获取
          help = this.matchPlaceholder(callbackSignature);
        } else if (typeof rule === 'string') {
          help = rule;
        } else {
          if (rule.index !== undefined) {
            key += `_${rule.index}`;
          }

          if (rule.disabled !== undefined) {
            disabled = rule.disabled;
          }

          if (rule.rules === undefined) {
            help = this.matchPlaceholder(callbackSignature);
          } else {
            // todo 其他验证方式
            help = '';
          }
        }

        // 刷新缓存的 validation
        const result = new Validation(
          typeof value !== 'number' && (value === null || value === undefined || (typeof value === 'string' && !value.trim())),
          help,
          disabled,
          this.noCache
        );
        result.touched = this.noCache || (this.validationCache[key] && this.validationCache[key].touched);
        this.validationCache[key] = result;

        const vNode: VNode = callback.call(null, result);

        // 找到控件
        if (vNode.componentOptions && vNode.componentOptions.children && vNode.componentOptions.children.length > 0) {
          // 给组件打上 key 属性，用于查找当前实例中存在的验证组件
          (vNode.componentOptions.propsData as any)[this.cacheKey] = key;

          const firstChild = vNode.componentOptions.children[0];

          if (firstChild.componentOptions && firstChild.componentOptions.listeners) {
            const listeners = firstChild.componentOptions.listeners as any;
            const change = listeners.change;
            listeners.change = (val: any) => {
              if (change) {
                change.call(null, val);
              }
              if (this.validationCache[key]) {
                this.validationCache[key].touched = true;
              } else {
                console.error('[FormHelper] 逻辑异常');
              }
            };
          }
        }

        return vNode;
      }
    };
  }

  /**
   * 获取错误消息列表
   * @param context Vue 组件上下文 this
   */
  getErrorMessages(context: any): string[] {
    this.validationFlags = [];
    this.findValidationComponent(context);
    const messages = Object.keys(this.validationCache)
      .filter(key => this.validationFlags.includes(key))
      .sort((k1, k2) => {
        return this.validationFlags.indexOf(k1) - this.validationFlags.indexOf(k2);
      })
      .map(key => {
        this.validationCache[key].touched = true;
        return this.validationCache[key].help;
      })
      .filter(err => !!err);
    context.$forceUpdate();
    return messages;
  }

  /**
   * 匹配 placeholder
   */
  private matchPlaceholder(str: string): string {
    const matchedPlaceholder = str.match(/placeholder['"]?:\s*['"](?<name>[^'"]+)['"]/);
    return matchedPlaceholder && matchedPlaceholder.groups ? matchedPlaceholder.groups.name : '';
  }

  /**
   * 递归查找当前组件实例中的验证组件
   * @param instance 组件实例
   */
  private findValidationComponent(instance: Vue) {
    if (instance && instance.$options && instance.$options.propsData && (instance.$options.propsData as any)[this.cacheKey]) {
      this.validationFlags.push((instance.$options.propsData as any)[this.cacheKey]);
    }

    if (instance.$children) {
      instance.$children.forEach(c => {
        this.findValidationComponent(c);
      });
    }
  }
}
