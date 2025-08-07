export interface ProductImage extends Blob {
  id?: number;
  productId?: number;
  path?: string;
  url?: string;
  mime?: string;
  image_size?: number;
  position?: number;
  createdAt?: Date;
  updatedAt?: Date;
}