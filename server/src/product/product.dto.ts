export class AddProductDto {
  categorieIds: string[];
  brandIds: string[];
  modelIds: string[];
  price: string;
  title: string;
  description: string;
  image: string[];
}

export class PutProductDto {
  _id: string;
  categorieIds: string[];
  brandIds: string[];
  modelIds: string[];
  price: string;
  title: string;
  description: string;
  image: string[];
}

export class FiltersProductDto {
  categorieIds?: string[];
  brandIds?: string[];
  modelIds?: string[];
  maxPrice?: string;
  minPrice?: string;
}
