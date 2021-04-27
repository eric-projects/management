import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { httpHelper, toCasedStyleObject } from '@/common/utils';
import { ValueLabelPair } from '@/common/defines';
import { ProcessTreeData } from '@/components/Process/AllProcesses/types';
import { ProcessDto, ProcessInfoDto, ProcessModuleState } from './process.types';

class ProcessService {
  private cacheSummary: { [key: string]: string } = {};

  getProcesses(organization = ''): Observable<ProcessDto[]> {
    const url = `/api/platform/v1/group-processes?organization-id=${organization}`;
    return httpHelper.get(url);
  }

  getProcessInfo(id: string): Observable<ProcessInfoDto> {
    const url = `/api/process/v1/processes/${id}/info`;
    return httpHelper.get(url);
  }

  getProcessInfoByInstanceNumber(number: string): Observable<ProcessInfoDto> {
    const url = `/api/platform/v1/instances/${number}/process-info`;
    return httpHelper.get(url);
  }

  getProcessFormModuleState(processId: string, taskId: string, number: string): Observable<ProcessModuleState> {
    const url = `/api/form/v1/templates/extension-data`;
    return httpHelper.get(url, { params: { 'process-id': processId, 'task-id': taskId, 'instance-id': number } });
  }

  getProcessIntroduction(id: string): Observable<string> {
    if (this.cacheSummary[id]) {
      return of(this.cacheSummary[id]);
    }

    return httpHelper.get(`/api/todo-centre/v1/tasks/${id}/summary`, undefined, { loading: false }).pipe(
      map((m: any) => {
        this.cacheSummary[id] = m;
        return m;
      })
    );
  }

  getProcessIdByBTID(btid: string): Observable<string> {
    const _url = `/api/process/v1/processes/id`;
    return httpHelper.get(_url, { params: { btid } });
  }

  getGroupedProcesses(params: any, transferFN?: any): Observable<ProcessTreeData[]> {
    const domainOb = httpHelper.get(`/api/platform/v1/select-domains`, {}, { loading: false });
    const businessTypeTree = httpHelper.get(`/api/process/v1/process-map`, { params: toCasedStyleObject(params) }, { loading: false });
    return zip(domainOb, businessTypeTree).pipe(
      map((data: any) => {
        const [domains, businessTypes] = data;
        const transferData = transferFN ? transferFN(businessTypes) : this.convertTreeKey(businessTypes);
        const result: ProcessTreeData[] = [];
        domains.forEach((f: ValueLabelPair) => {
          const domainBt = transferData.filter((g: any) => g.domain === f.value);
          if (domainBt.length > 0) {
            result.push({ key: f.value + '', title: f.label, children: domainBt });
          }
        });

        return result;
      })
    );
  }

  private convertTreeKey(originData: any[]): any[] {
    const result: any[] = [];
    originData.forEach((d, i) => {
      d.title = d.groupName;
      d.key = d.groupId;
      delete d.groupName;
      delete d.groupId;
      if (d.children && d.children.length > 0) {
        d.children = this.convertTreeKey(d.children);
      }

      if ((d.children || []).length > 0 || (d.processes || []).length > 0) {
        result.push(d);
      }
    });

    return result;
  }
}

export const processService = new ProcessService();
