import { contactRequestType } from './documents/contactRequestType';
import { designSettingsType } from './documents/designSettingsType';
import { orderType } from './documents/orderType';
import { productType } from './documents/productType';
import { serviceType } from './documents/serviceType';
import { siteSettingsType } from './documents/siteSettingsType';
import { orderItemType } from './objects/orderItemType';
import { productImageType } from './objects/productImageType';
import { variantGroupType } from './objects/variantGroupType';
import { variantOptionType } from './objects/variantOptionType';
import { pageDocumentTypes } from './shared/definePageDocument';
import { PAGE_SPECS } from './shared/pageContentSpec';

const pageTypes = pageDocumentTypes(PAGE_SPECS);

export const schemaTypes = [
	siteSettingsType,
	designSettingsType,
	...pageTypes,
	productType,
	productImageType,
	variantGroupType,
	variantOptionType,
	serviceType,
	contactRequestType,
	orderItemType,
	orderType
];

/** Nombres de los document types de página (uno por página). */
export const PAGE_TYPE_NAMES = PAGE_SPECS.map((spec) => spec.typeName);
