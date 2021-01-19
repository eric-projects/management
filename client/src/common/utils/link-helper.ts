export class LinkHelper {
  open(operation: any) {
    if (operation.width && operation.height) {
      const top = (window.screen.availHeight - 30 - operation.width) / 2;
      const left = (window.screen.availWidth - 10 - operation.height) / 2;
      window.open(operation.url, '_blank', `scrollbars=yes,width=${operation.width},height=${operation.height},left=${left},top=${top}`);
    } else {
      window.open(operation.url);
    }
  }
}

export const linkHelper = new LinkHelper();
