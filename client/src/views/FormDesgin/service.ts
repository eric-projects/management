import { Observable } from 'rxjs';
import { httpHelper } from '@/common/utils';

class FormDesginService {
    uploadFilesUrl = '/api/platform/v1/documents/form-files-upload';
    getDataDictionay(): Observable<any> {
        const _url = `/api/platform/v1/tree-dictionaries`;
        return httpHelper.get(_url);
    }
    getDataDictionayOptions(group: string): Observable<any> {
        const _url = `/api/platform/v1/select-dictionaries?group=${group}`;
        return httpHelper.get(_url);
    }
    getFormDesginInfo(id: any): Observable<any> {
        const _url = `/api/form/v1/forms/${id}/info`;
        return httpHelper.get(_url);
    }
    getBusinessObjectFields(code: any): Observable<any> {
        const _url = `/api/process/v1/business-objects/${code}/select-fields`;
        return httpHelper.get(_url);
    }
    saveFormDesgin(data: any): Observable<void> {
        const _url = `/api/form/v1/templates/outsider`;
        return httpHelper.post(_url, data);
    }
    publishFormDesgin(data: any): Observable<void> {
        const _url = `/api/form/v1/templates/outsider/publish`;
        return httpHelper.post(_url, data);
    }
    getFormTemplate(data: any): Observable<any> {
        const _url = `/api/form/v1/templates/form-template`;
        return httpHelper.post(_url, data);
    }
    getIdocView(): Observable<any> {
        const _url = `/api/getIdocView`;
        return httpHelper.get(_url, {}, { loading: false });
    }
    getSystemFields(): Observable<any> {
        const _url = `/api/process/v1/manage/process-paramter-modules/getAll`;
        return httpHelper.get(_url);
    }
}

export const formDesginService = new FormDesginService();
