import { ProcessDto } from '@/services/process';

export interface ProcessGroupDto {
  groupName: string;
  level: number;
  processes: ProcessDto[];
}
