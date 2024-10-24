import { File } from "buffer";


export interface Category {
    id?: number;
    name?: string;
    slug?: string;
    active?: boolean;
    parent_id?: number | null;
    created_by?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    
    photo?: string | Blob | null ; 
  }