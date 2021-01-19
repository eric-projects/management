import { Observable, Subject, of } from 'rxjs';

import { httpHelper } from '@/common/utils';

class FormService {
  getTemplate(taskId: string, processId: string, instanceId: string) {
    let url = '/api/form/v1/templates?';
    if (taskId) {
      url += `task-id=${taskId}`;
    } else if (processId) {
      url += `process-id=${processId}`;
    } else {
      url += `instance-id=${instanceId}`;
    }

    return httpHelper.get(url);
  }

  getFormParams(instanceId: string) {
    return httpHelper.get(`/api/platform/v1/instances/${instanceId}/form-params`);
  }

  getBusinessFormParams(bsid: string, btid: string, boid: string) {
    return httpHelper.get(`/api/platform/endpoints/business-data/forms`, { params: { bsid, btid, boid } });
  }
}

export const formService = new FormService();
