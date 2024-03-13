export interface IAEncryptionPaymentSettings {
  id: string;
  object: string;
  active: boolean;
  created: number;
  default_price: null | number;
  description: null | string;
  features: string[];
  images: string[];
  livemode: boolean;
  metadata: Record<string, unknown>;
  name: string;
  package_dimensions: null | Record<string, unknown>;
  shippable: null | boolean;
  statement_descriptor: null | string;
  tax_code: null | string;
  unit_label: null | string;
  updated: number;
  url: null | string;
  default_price_value: string;
}
