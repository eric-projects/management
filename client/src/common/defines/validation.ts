export class Validation {
  /**
   * 验证状态
   */
  get validateStatus() {
    return !this._disabled && this.touched && this._isError ? 'error' : '';
  }

  /**
   * 验证文本
   */
  get help() {
    return !this._disabled && this.touched && this._isError ? this._help : '';
  }

  /**
   * 是否已被触碰
   */
  touched = false;
  private _isError: boolean;
  private _help: string;
  private _disabled: boolean;
  constructor(isError: boolean, help: string, disabled: boolean, cache?: boolean) {
    this._isError = isError;
    this._help = help;
    this._disabled = disabled;
    this.touched = !!cache;
  }
}
