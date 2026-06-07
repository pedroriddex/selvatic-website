import { contactRequestType } from './documents/contactRequestType';
import { designSettingsType } from './documents/designSettingsType';
import { orderType } from './documents/orderType';
import { pageType } from './documents/pageType';
import { productType } from './documents/productType';
import { serviceType } from './documents/serviceType';
import { siteSettingsType } from './documents/siteSettingsType';
import { orderItemType } from './objects/orderItemType';
import { pageTextBlockType } from './objects/pageTextBlockType';
import { productImageType } from './objects/productImageType';
import { variantGroupType } from './objects/variantGroupType';
import { variantOptionType } from './objects/variantOptionType';

export const schemaTypes = [
	siteSettingsType,
	designSettingsType,
	pageType,
	pageTextBlockType,
	productType,
	productImageType,
	variantGroupType,
	variantOptionType,
	serviceType,
	contactRequestType,
	orderItemType,
	orderType
];
