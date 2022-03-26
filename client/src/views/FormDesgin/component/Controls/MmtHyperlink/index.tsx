import { Component } from 'vue-property-decorator';
import { BaseControl } from '../base-control';

@Component
export class MmtHyperlink extends BaseControl {
    private getHref(value: string) {
        const url = this.item.config.displayModal === 'fileAddress' ?
            `${this.$idocview}${encodeURIComponent(value)}` : value;
        window.open(url, '_blank');
    }
    render() {
        return <div>
            {
                this.item.cdata.map((m: any, i: number) => {
                    return <div><a target='_blank'
                        on-click={() => this.getHref(m.value)}
                        // href={this.getHref(m.value)}
                        style={{
                            'text-decoration': this.item.config.hasUnderline ?
                                'underline' : 'none'
                        }}>{m.label}</a></div>;
                })
            }
        </div>;
    }
}
