import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { httpHelper, i18nHelper, guidHelper } from '@/common/utils';
import { ValueLabelPair } from '@/common/defines';
import { FormComponentType } from '../components/types';
import { FormComponentDescription } from '../components/DynamicFormComponentDescription/form-component-description.type';
import { FormComponent } from '../components/DynamicFormComponent/form-component.type';
import { FormTemplate, FormTemplateDto, FormTemplateExtension, BusinessTypeDto, BusinessTypeTreeSelectDto } from './types';

class FormDesignerService {
  private localePrefix = 'designers.components';

  get dropPlaceholderOptions() {
    return {
      className: 'drop-preview',
    };
  }

  get repository(): { [key: string]: FormComponentDescription } {
    return Object.keys(FormComponentType)
      .map<FormComponentDescription>(key => ({
        type: key as FormComponentType,
        name: i18nHelper.getLocale(`${this.localePrefix}.${key}`),
      }))
      .reduce((prev: { [key: string]: FormComponentDescription }, curr: FormComponentDescription) => {
        prev[curr.type] = curr;
        return prev;
      }, {});
  }

  generateFormComponent(type: string): FormComponent {
    const description = this.repository[type];
    return new FormComponent(description);
  }

  getControl(collection: FormComponent[], index: number): FormComponent {
    return collection[index];
  }

  putControl(collection: FormComponent[], ctrl: FormComponent, removedIndex: number | null, addedIndex: number | null, parentId = '') {
    if (removedIndex === null && addedIndex == null) {
      return;
    }

    if (!ctrl.colSpan) {
      ctrl.colSpan = 1;
    }

    if (removedIndex !== null) {
      collection.splice(removedIndex, 1);
    }

    if (addedIndex !== null) {
      collection.splice(addedIndex, 0, ctrl);
    }
  }

  getBusinessObjects(businessTypeId?: string): Observable<ValueLabelPair[]> {
    return httpHelper.get(`/api/process/v1/select-business-objects?business-type-id=${businessTypeId}`, undefined, { loading: false });
  }

  getBusinessFields(code: string): Observable<ValueLabelPair[]> {
    return httpHelper.get(`/api/process/v1/business-objects/${code}/select-fields`);
  }

  saveTemplate(template: FormTemplateDto): Observable<string> {
    return httpHelper.post('/api/form/v1/templates', template);
  }

  getTemplate(id: string): Observable<FormTemplateDto> {
    return httpHelper.get(`/api/form/v1/templates/${id}/structure`);
  }

  transformStructure(data: FormTemplate, extension: FormTemplateExtension): FormTemplateDto {
    const obj: FormTemplateDto = Object.assign({ controls: [], extensionData: extension }, data);
    delete (obj as any).groups;

    data.groups.forEach(group => {
      const controls = group.controls.map(control => {
        const ctrl = { ...control };
        ctrl.containerId = group.id;
        return ctrl;
      });
      obj.controls.push(...controls);
    });

    return obj;
  }

  transformStructureReverse(data: FormTemplateDto, extension: FormTemplateExtension): FormTemplate {
    const obj: FormTemplate = Object.assign({ groups: [] }, data);
    delete (obj as any).controls;
    obj.groups = extension.groups.map(group => ({ ...group, controls: [] }));

    data.controls.forEach(control => {
      if (control.containerId) {
        const group = obj.groups.find(g => g.id === control.containerId);
        if (group) {
          group.controls.push(control);
        }
      }
    });

    return obj;
  }

  private transferBusinessTypeTree(data: BusinessTypeDto[], pid: string): BusinessTypeTreeSelectDto[] {
    let result: BusinessTypeTreeSelectDto[] = [];
    data.forEach(m => {
      result.push({ id: m.value + '', value: m.value + '', title: m.label, pId: pid });
      if (m.children.length > 0) {
        result = [...result, ...this.transferBusinessTypeTree(m.children, m.value + '')];
      }
    });

    return result;
  }
}

export const formDesignerService = new FormDesignerService();
