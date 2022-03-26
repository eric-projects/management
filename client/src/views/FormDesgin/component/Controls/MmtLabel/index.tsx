import moment from 'moment';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { BaseControl } from '../base-control';

@Component
export class MmtLabel extends BaseControl {
  private getFormatText(text: any) {
    if (this.item.config.valueType === 'default') {
      return text;
    } else if (this.item.config.valueType === 'date') {
      return text
        ? moment(text, this.item.config.format)
        : '';
    } else if (this.item.config.valueType === 'number') {
      let num =
        this.item.config.precision || this.item.config.precision === 0
          ? Number(text).toFixed(this.item.config.precision)
          : text;
      if (this.item.config.thousandths) {
        const arr = num.split('.');
        let result = '';
        arr.forEach((f: any, i: number) => {
          if (i === 0) {
            result += `${f}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            result += `.${f}`;
          }
        });
        num = result;
      }
      return num;
    } else if (this.item.config.valueType === 'enum') {
      const enumItem = this.item.config.options.find(
        (e: any) => e.value === text.toString()
      );
      return enumItem ? enumItem.label : '';
    } else {
      return text;
    }
  }
  render() {
    return this.getFormatText(this.item.cdata);
  }
}
