export interface ExternalProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  externalUrl: string;
  isExternal: true;
}
