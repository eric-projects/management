export interface FileDto extends FileAttribute {
  id: string;
  name: string;
}

export enum FileType {
  default = 0,
  word = 1,
  ppt = 2,
  excel = 3,
  img = 4
}

export interface FileAttribute {
  icon: string;
  class: string;
  type: FileType;
}
