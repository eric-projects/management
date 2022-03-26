import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseControl } from '../base-control';

@Component
export class MmtInputNumber extends BaseControl {
  private formatter(value: any) {
    if (this.item.config.thousandths && value) {
      const arr = value.toString().split('.');
      let result = '';
      arr.forEach((f: any, i: number) => {
        if (i === 0) {
          result += `${f}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          result += `.${f}`;
        }
      });
      return result;
    } else {
      return value;
    }
  }
  private parser(value: any) {
    if (this.item.config.thousandths) {
      return value.replace(/\$\s?|(,*)/g, '');
    } else {
      return value;
    }
  }
  get defaultLable() {
    if (this.item.cdata || this.item.cdata === 0) {
      return this.formatter(this.item.cdata);
    }
    return '';
  }
  created(): void {
  }
  render() {
    return (
      <a-input-number
        v-model={this.item.cdata}
        placeholder={this.item.config.placeholder}
        disabled={!this.item.config.disabled}
        precision={this.item.config.precision || this.item.config.precision === 0 ?
          this.item.config.precision : null}
        formatter={this.formatter}
        parser={this.parser}
        style={{ width: '100%' }}
      ></a-input-number>);
  }
}
