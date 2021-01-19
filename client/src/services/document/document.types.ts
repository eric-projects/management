export interface DocumentUpdateDto {
  businessObjectId?: string;
  businessObjectType?: string;
  processNodeId?: string;
  docCategory?: string;
  status?: number;
  documentId?: string;
}

export interface DocumentDto {
  documentId: string;
  businessObjectId: string;
  businessObjectIdTree: string;
  businessObjectType: string;
  processNodeId: string;
  name: string;
  filePath: string;
  createDate: string;
  docCategory: string;
  createId: string;
  createName: string;
  status: number;
}
