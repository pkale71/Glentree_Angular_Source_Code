import {FileType} from './file-type'
import { User } from './user';

export class MaterialType {
  id?: number;
  uuid?: string;
  name?: string;
  fileTypes?: FileType[];
  createdOn?: Date;
  createdBy?: User;
  isExist?: number;
}
