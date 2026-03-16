import { contactRequestType } from './documents/contactRequestType';
import { orderType } from './documents/orderType';
import { productType } from './documents/productType';
import { serviceType } from './documents/serviceType';
import { orderItemType } from './objects/orderItemType';

export const schemaTypes = [
	productType,
	serviceType,
	contactRequestType,
	orderItemType,
	orderType
];
