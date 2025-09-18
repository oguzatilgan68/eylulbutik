export type AttributeValue = {
  id: string;
  value: string;
};

export type AttributeType = {
  id: string;
  name: string;
  values: AttributeValue[];
};

export type PropertyValue = {
  id: string;
  value: string;
};

export type PropertyType = {
  id: string;
  name: string; // Örn: "Mevsim"
  values: PropertyValue[]; // Tüm seçenekler
};

export type PropertyValueInput = {
  propertyTypeId: string;
  propertyValueId: string;
  value: string;
};

export type VariantInput = {
  id?: string;
  sku: string;
  price: string;
  stockQty: string;
  attributeValueIds: string[]; // Ordered list of selected attribute value IDs
  images: { url: string; alt?: string }[];
};
export type ProductFormData = {
  id?: string;
  name: string;
  price: string;
  sku: string;
  description: string;
  categoryId: string;
  brandId?: string;
  images: { url: string; alt?: string }[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  inStock: boolean;
  variants: VariantInput[];
  properties?: PropertyValueInput[];
  modelInfoId?: string; // seçilen manken id
  modelSize?: string;
};
