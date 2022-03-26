import E from 'wangeditor';
const { $, BtnMenu } = E;
class UploadFileMenu extends BtnMenu {
    constructor(editor: any) {
        const $elem = E.$(
            `<div class="w-e-menu" data-title="附件">
                <i class="w-e-icon-upload2">
                </i>
            </div>`
        );
        super($elem, editor);
    }
    clickHandler() {
        const file = document.getElementById(`${this.editor.id}File`);
        if (file) {
            file.click();
        }
    }
    tryChangeActive() {}
}
export default UploadFileMenu;
