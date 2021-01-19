import { TreeData } from '@/common/defines';
import { ProcessDto } from '@/services/process';

export interface ProcessTreeData extends TreeData {
  children: ProcessTreeData[];
  processes?: ProcessDto[];
}
