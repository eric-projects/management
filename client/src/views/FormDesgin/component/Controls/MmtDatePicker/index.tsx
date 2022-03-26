import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseControl } from '../base-control';

@Component
export class MmtDatePicker extends BaseControl {
    private onDefaultChange(date: any, dateString: any) {
        if (date instanceof Array && date.length === 0) {
            this.item.cdata = [];
        } else {
            this.item.cdata = dateString;
        }
    }
    get defaultValue() {
        if (this.item.config.displayModal === 'daterange') {
            return this.item.cdata ? this.item.cdata.map((m: any) => moment(m)) : [];
        } else {
            return this.item.cdata ? moment(this.item.cdata) : null;
        }
    }
    created(): void {
    }
    render() {
        return (
            this.item.config.displayModal === 'date' ? (
                <a-date-picker
                    value={this.defaultValue}
                    placeholder={this.item.config.placeholder}
                    disabled={!this.item.config.disabled}
                    format={this.item.config.format}
                    showTime={this.item.config.format === 'YYYY-MM-DD' ? false : true}
                    style={{ width: '100%' }}
                    on-change={this.onDefaultChange}
                ></a-date-picker>
            ) : (
                <a-range-picker
                    value={this.defaultValue}
                    disabled={!this.item.config.disabled}
                    format={this.item.config.format}
                    showTime={this.item.config.format === 'YYYY-MM-DD' ? false : true}
                    style={{ width: '100%' }}
                    on-change={this.onDefaultChange}
                ></a-range-picker>
            ));
    }
}
