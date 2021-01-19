import { ProcessDto } from '@/services/process';
import { ProcessTreeData } from './types';

class AllProcessService {
  findItem(collection: ProcessTreeData[], key: string): ProcessTreeData {
    const item = collection.find((it: ProcessTreeData) => it.key === key);

    if (item) {
      return item;
    }

    const newCollection = collection.reduce(
      (prev, curr) => prev.concat(curr.children || ([] as ProcessTreeData[])),
      [] as ProcessTreeData[]
    );

    return this.findItem(newCollection, key);
  }

  flattenProcesses(data: ProcessTreeData): ProcessDto[] {
    const blowPrcesses = (data.children || []).map(item => this.flattenProcesses(item)).reduce((prev, curr) => prev.concat(curr), []);
    return (data.processes || []).concat(blowPrcesses);
  }
}

export const allProcessService = new AllProcessService();
