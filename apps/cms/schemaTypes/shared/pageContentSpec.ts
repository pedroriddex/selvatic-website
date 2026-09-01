// AUTO-GENERADO por apps/web/scripts/generate-page-specs.mjs — NO editar a mano.
// Fuente: apps/web/src/lib/features/content/model/page-content.ts (PAGE_DEFAULTS).

export type PageFieldSpec = {
	key: string;
	field: string;
	label: string;
	group: string;
	kind: 'text' | 'image';
	multiline: boolean;
	initialValue: string;
	description?: string;
};

export type PageSpec = {
	key: string;
	typeName: string;
	title: string;
	route: string;
	seoTitle: string;
	seoDescription: string;
	groups: string[];
	fields: PageFieldSpec[];
};

export const PAGE_SPECS: PageSpec[] = [
	{
		"key": "global",
		"typeName": "pageGlobal",
		"title": "Global",
		"route": "*",
		"seoTitle": "Selvatic · Floristería",
		"seoDescription": "Diseño floral natural con flor seca, preservada y planta natural. Ramos a medida, cerámica decorativa y propuestas personalizadas.",
		"groups": [
			"brand",
			"nav",
			"cta",
			"cart",
			"footer"
		],
		"fields": [
			{
				"key": "brand.name",
				"field": "brand__name",
				"label": "Marca / Nombre",
				"group": "brand",
				"kind": "text",
				"multiline": false,
				"initialValue": "SELVATIC"
			},
			{
				"key": "nav.home",
				"field": "nav__home",
				"label": "Navegación / Inicio",
				"group": "nav",
				"kind": "text",
				"multiline": false,
				"initialValue": "Inicio"
			},
			{
				"key": "nav.shop",
				"field": "nav__shop",
				"label": "Navegación / Tienda",
				"group": "nav",
				"kind": "text",
				"multiline": false,
				"initialValue": "Tienda"
			},
			{
				"key": "nav.about",
				"field": "nav__about",
				"label": "Navegación / Sobre nosotros",
				"group": "nav",
				"kind": "text",
				"multiline": false,
				"initialValue": "Sobre nosotros"
			},
			{
				"key": "nav.services",
				"field": "nav__services",
				"label": "Navegación / Servicios",
				"group": "nav",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicios"
			},
			{
				"key": "nav.contact",
				"field": "nav__contact",
				"label": "Navegación / Contacto",
				"group": "nav",
				"kind": "text",
				"multiline": false,
				"initialValue": "Contacto"
			},
			{
				"key": "cta.orderBouquet",
				"field": "cta__orderBouquet",
				"label": "CTA global / Encargar ramo",
				"group": "cta",
				"kind": "text",
				"multiline": false,
				"initialValue": "Encargar ramo"
			},
			{
				"key": "cart.label",
				"field": "cart__label",
				"label": "Carrito / Label móvil",
				"group": "cart",
				"kind": "text",
				"multiline": false,
				"initialValue": "Carrito"
			},
			{
				"key": "cart.comingSoon",
				"field": "cart__comingSoon",
				"label": "Carrito / Tienda próximamente",
				"group": "cart",
				"kind": "text",
				"multiline": false,
				"initialValue": "Tienda online próximamente"
			},
			{
				"key": "footer.description",
				"field": "footer__description",
				"label": "Footer / Descripción",
				"group": "footer",
				"kind": "text",
				"multiline": true,
				"initialValue": "Proyecto de diseño floral natural con raíces familiares, hecho con tiempo, conocimiento y sensibilidad."
			}
		]
	},
	{
		"key": "home",
		"typeName": "pageHome",
		"title": "Inicio",
		"route": "/",
		"seoTitle": "Selvatic · Floristería",
		"seoDescription": "Diseño floral natural con flor seca, preservada y planta natural. Ramos a medida, cerámica decorativa y propuestas personalizadas.",
		"groups": [
			"hero",
			"productCard",
			"signal",
			"collections",
			"bestSellers",
			"promo",
			"services",
			"media"
		],
		"fields": [
			{
				"key": "hero.kicker",
				"field": "hero__kicker",
				"label": "Hero / Antetítulo",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Selvatic / Diseño floral natural"
			},
			{
				"key": "hero.title",
				"field": "hero__title",
				"label": "Hero / Título",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Diseño floral natural con memoria, tiempo y sensibilidad."
			},
			{
				"key": "hero.description",
				"field": "hero__description",
				"label": "Hero / Descripción",
				"group": "hero",
				"kind": "text",
				"multiline": true,
				"initialValue": "Proyecto floral liderado por Noelia Pérez, especializado en flor seca y preservada, con una mirada serena, honesta y atemporal para hogares, espacios y encargos a medida."
			},
			{
				"key": "hero.primaryCta",
				"field": "hero__primaryCta",
				"label": "Hero / Botón principal",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver tienda"
			},
			{
				"key": "hero.secondaryCta",
				"field": "hero__secondaryCta",
				"label": "Hero / Botón secundario",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Conocer el estudio"
			},
			{
				"key": "productCard.addToCartLabel",
				"field": "productCard__addToCartLabel",
				"label": "Tarjeta producto / Botón añadir",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir"
			},
			{
				"key": "productCard.addToCartAria",
				"field": "productCard__addToCartAria",
				"label": "Tarjeta producto / Accesibilidad añadir",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir {product} al carrito"
			},
			{
				"key": "productCard.comingSoonLabel",
				"field": "productCard__comingSoonLabel",
				"label": "Tarjeta producto / Botón próximamente",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Próximamente"
			},
			{
				"key": "productCard.viewImageAria",
				"field": "productCard__viewImageAria",
				"label": "Tarjeta producto / Accesibilidad imagen",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver imagen completa de {product}"
			},
			{
				"key": "productCard.viewProductAria",
				"field": "productCard__viewProductAria",
				"label": "Tarjeta producto / Accesibilidad enlace",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver {product}"
			},
			{
				"key": "hero.railKicker",
				"field": "hero__railKicker",
				"label": "Hero / Rail título",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Oficio"
			},
			{
				"key": "hero.stat1.label",
				"field": "hero__stat1__label",
				"label": "Hero / Dato 1 label",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Origen"
			},
			{
				"key": "hero.stat1.value",
				"field": "hero__stat1__value",
				"label": "Hero / Dato 1 valor",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Desde los 70"
			},
			{
				"key": "hero.stat2.label",
				"field": "hero__stat2__label",
				"label": "Hero / Dato 2 label",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Especialidad"
			},
			{
				"key": "hero.stat2.value",
				"field": "hero__stat2__value",
				"label": "Hero / Dato 2 valor",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Flor seca"
			},
			{
				"key": "hero.stat3.label",
				"field": "hero__stat3__label",
				"label": "Hero / Dato 3 label",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicio"
			},
			{
				"key": "hero.stat3.value",
				"field": "hero__stat3__value",
				"label": "Hero / Dato 3 valor",
				"group": "hero",
				"kind": "text",
				"multiline": false,
				"initialValue": "A medida"
			},
			{
				"key": "signal.1.title",
				"field": "signal__1__title",
				"label": "Franja iconos / 1 título",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Selección cuidada"
			},
			{
				"key": "signal.1.description",
				"field": "signal__1__description",
				"label": "Franja iconos / 1 texto",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Piezas elegidas con criterio natural, sereno y atemporal."
			},
			{
				"key": "signal.2.title",
				"field": "signal__2__title",
				"label": "Franja iconos / 2 título",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Encargos a medida"
			},
			{
				"key": "signal.2.description",
				"field": "signal__2__description",
				"label": "Franja iconos / 2 texto",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Propuestas adaptadas a regalo, hogar, evento o proyecto."
			},
			{
				"key": "signal.3.title",
				"field": "signal__3__title",
				"label": "Franja iconos / 3 título",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Atención cercana"
			},
			{
				"key": "signal.3.description",
				"field": "signal__3__description",
				"label": "Franja iconos / 3 texto",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Acompañamiento directo desde la idea hasta la entrega."
			},
			{
				"key": "signal.4.title",
				"field": "signal__4__title",
				"label": "Franja iconos / 4 título",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Composición honesta"
			},
			{
				"key": "signal.4.description",
				"field": "signal__4__description",
				"label": "Franja iconos / 4 texto",
				"group": "signal",
				"kind": "text",
				"multiline": false,
				"initialValue": "Flor seca, preservada y cerámica en equilibrio visual."
			},
			{
				"key": "collections.kicker",
				"field": "collections__kicker",
				"label": "Colecciones / Antetítulo",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "Colecciones"
			},
			{
				"key": "collections.label",
				"field": "collections__label",
				"label": "Colecciones / Label",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "Catálogo"
			},
			{
				"key": "collections.title",
				"field": "collections__title",
				"label": "Colecciones / Título",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "Selección botánica"
			},
			{
				"key": "collections.description",
				"field": "collections__description",
				"label": "Colecciones / Descripción",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "Piezas para regalo, interiorismo residencial y producciones de marca."
			},
			{
				"key": "collections.action",
				"field": "collections__action",
				"label": "Colecciones / Botón",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver todo"
			},
			{
				"key": "collections.emptyTitle",
				"field": "collections__emptyTitle",
				"label": "Colecciones / Vacío título",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "No hay productos publicados todavía"
			},
			{
				"key": "collections.emptyDescription",
				"field": "collections__emptyDescription",
				"label": "Colecciones / Vacío texto",
				"group": "collections",
				"kind": "text",
				"multiline": false,
				"initialValue": "La colección se irá completando con nuevas piezas muy pronto."
			},
			{
				"key": "bestSellers.kicker",
				"field": "bestSellers__kicker",
				"label": "Best sellers / Antetítulo",
				"group": "bestSellers",
				"kind": "text",
				"multiline": false,
				"initialValue": "Best sellers"
			},
			{
				"key": "bestSellers.label",
				"field": "bestSellers__label",
				"label": "Best sellers / Label",
				"group": "bestSellers",
				"kind": "text",
				"multiline": false,
				"initialValue": "Selección"
			},
			{
				"key": "bestSellers.title",
				"field": "bestSellers__title",
				"label": "Best sellers / Título",
				"group": "bestSellers",
				"kind": "text",
				"multiline": false,
				"initialValue": "Piezas con mayor salida esta temporada"
			},
			{
				"key": "bestSellers.emptyTitle",
				"field": "bestSellers__emptyTitle",
				"label": "Best sellers / Vacío título",
				"group": "bestSellers",
				"kind": "text",
				"multiline": false,
				"initialValue": "Aún no hay selección destacada"
			},
			{
				"key": "bestSellers.emptyDescription",
				"field": "bestSellers__emptyDescription",
				"label": "Best sellers / Vacío texto",
				"group": "bestSellers",
				"kind": "text",
				"multiline": false,
				"initialValue": "Pronto mostraremos aquí una selección de piezas destacadas."
			},
			{
				"key": "promo.kicker",
				"field": "promo__kicker",
				"label": "Promo / Antetítulo",
				"group": "promo",
				"kind": "text",
				"multiline": false,
				"initialValue": "Materia natural"
			},
			{
				"key": "promo.label",
				"field": "promo__label",
				"label": "Promo / Label",
				"group": "promo",
				"kind": "text",
				"multiline": false,
				"initialValue": "Especialidad"
			},
			{
				"key": "promo.title",
				"field": "promo__title",
				"label": "Promo / Título",
				"group": "promo",
				"kind": "text",
				"multiline": false,
				"initialValue": "Flor seca, preservada y cerámica escogida con el mismo criterio."
			},
			{
				"key": "promo.description",
				"field": "promo__description",
				"label": "Promo / Descripción",
				"group": "promo",
				"kind": "text",
				"multiline": true,
				"initialValue": "Selvatic está especializado en creaciones con flor seca y preservada, combinadas con una cuidada selección de planta natural y presentadas en cerámica decorativa."
			},
			{
				"key": "promo.primaryCta",
				"field": "promo__primaryCta",
				"label": "Promo / Botón principal",
				"group": "promo",
				"kind": "text",
				"multiline": false,
				"initialValue": "Solicitar propuesta"
			},
			{
				"key": "promo.secondaryCta",
				"field": "promo__secondaryCta",
				"label": "Promo / Botón secundario",
				"group": "promo",
				"kind": "text",
				"multiline": false,
				"initialValue": "Más sobre el estudio"
			},
			{
				"key": "services.kicker",
				"field": "services__kicker",
				"label": "Servicios / Antetítulo",
				"group": "services",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicios"
			},
			{
				"key": "services.label",
				"field": "services__label",
				"label": "Servicios / Label",
				"group": "services",
				"kind": "text",
				"multiline": false,
				"initialValue": "Atelier"
			},
			{
				"key": "services.title",
				"field": "services__title",
				"label": "Servicios / Título",
				"group": "services",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicio cercano y diseño floral a medida"
			},
			{
				"key": "services.description",
				"field": "services__description",
				"label": "Servicios / Descripción",
				"group": "services",
				"kind": "text",
				"multiline": true,
				"initialValue": "Cuidamos cada detalle desde la selección del producto hasta la entrega final."
			},
			{
				"key": "services.action",
				"field": "services__action",
				"label": "Servicios / Botón",
				"group": "services",
				"kind": "text",
				"multiline": false,
				"initialValue": "Todos los servicios"
			},
			{
				"key": "services.emptyTitle",
				"field": "services__emptyTitle",
				"label": "Servicios / Vacío título",
				"group": "services",
				"kind": "text",
				"multiline": false,
				"initialValue": "No hay servicios publicados todavía"
			},
			{
				"key": "services.emptyDescription",
				"field": "services__emptyDescription",
				"label": "Servicios / Vacío texto",
				"group": "services",
				"kind": "text",
				"multiline": false,
				"initialValue": "Muy pronto encontrarás aquí todos los servicios disponibles."
			},
			{
				"key": "media.heroPoster",
				"field": "media__heroPoster",
				"label": "Imagen de portada (mientras carga el vídeo)",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": "Se muestra en la cabecera de inicio hasta que arranca el vídeo."
			},
			{
				"key": "media.promo",
				"field": "media__promo",
				"label": "Imagen del bloque \"Materia natural\"",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": "La imagen grande del bloque promocional de la página de inicio."
			}
		]
	},
	{
		"key": "shop",
		"typeName": "pageShop",
		"title": "Tienda",
		"route": "/tienda",
		"seoTitle": "Selvatic · Tienda",
		"seoDescription": "Flores secas y piezas florales de Selvatic para regalar, habitar y conservar.",
		"groups": [
			"intro",
			"productCard",
			"collection",
			"filter",
			"empty"
		],
		"fields": [
			{
				"key": "intro.kicker",
				"field": "intro__kicker",
				"label": "Intro / Antetítulo",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Tienda"
			},
			{
				"key": "intro.title",
				"field": "intro__title",
				"label": "Intro / Título",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Flores secas y piezas florales para regalar, habitar y conservar."
			},
			{
				"key": "intro.description",
				"field": "intro__description",
				"label": "Intro / Descripción",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "Colecciones de unidades limitadas con edición continua: textura, volumen y paleta neutra en equilibrio."
			},
			{
				"key": "productCard.addToCartLabel",
				"field": "productCard__addToCartLabel",
				"label": "Tarjeta producto / Botón añadir",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir"
			},
			{
				"key": "productCard.addToCartAria",
				"field": "productCard__addToCartAria",
				"label": "Tarjeta producto / Accesibilidad añadir",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir {product} al carrito"
			},
			{
				"key": "productCard.comingSoonLabel",
				"field": "productCard__comingSoonLabel",
				"label": "Tarjeta producto / Botón próximamente",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Próximamente"
			},
			{
				"key": "productCard.viewImageAria",
				"field": "productCard__viewImageAria",
				"label": "Tarjeta producto / Accesibilidad imagen",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver imagen completa de {product}"
			},
			{
				"key": "productCard.viewProductAria",
				"field": "productCard__viewProductAria",
				"label": "Tarjeta producto / Accesibilidad enlace",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver {product}"
			},
			{
				"key": "collection.kicker",
				"field": "collection__kicker",
				"label": "Colección / Antetítulo",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "Colección completa"
			},
			{
				"key": "collection.label",
				"field": "collection__label",
				"label": "Colección / Label",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "Productos"
			},
			{
				"key": "collection.title",
				"field": "collection__title",
				"label": "Colección / Título",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "Piezas disponibles"
			},
			{
				"key": "collection.disabledDescription",
				"field": "collection__disabledDescription",
				"label": "Colección / Tienda pausada",
				"group": "collection",
				"kind": "text",
				"multiline": true,
				"initialValue": "Explora la colección mientras terminamos la apertura de la tienda online."
			},
			{
				"key": "collection.emptyDescription",
				"field": "collection__emptyDescription",
				"label": "Colección / Sin productos",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "Aún no hay piezas disponibles en la colección."
			},
			{
				"key": "collection.noResultsTemplate",
				"field": "collection__noResultsTemplate",
				"label": "Colección / Sin resultados",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "No hay productos activos en {category}."
			},
			{
				"key": "collection.filteredTemplate",
				"field": "collection__filteredTemplate",
				"label": "Colección / Filtro activo",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "{count} piezas en {category}. Precio y disponibilidad actualizados."
			},
			{
				"key": "collection.allTemplate",
				"field": "collection__allTemplate",
				"label": "Colección / Todos los productos",
				"group": "collection",
				"kind": "text",
				"multiline": false,
				"initialValue": "{count} piezas disponibles. Precio y disponibilidad actualizados."
			},
			{
				"key": "filter.allCategoriesLabel",
				"field": "filter__allCategoriesLabel",
				"label": "Filtro / Todas las categorías",
				"group": "filter",
				"kind": "text",
				"multiline": false,
				"initialValue": "Todas las categorías"
			},
			{
				"key": "filter.all",
				"field": "filter__all",
				"label": "Filtro / Todas",
				"group": "filter",
				"kind": "text",
				"multiline": false,
				"initialValue": "Todas"
			},
			{
				"key": "empty.noProductsTitle",
				"field": "empty__noProductsTitle",
				"label": "Vacío / Sin productos título",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "No hay productos publicados"
			},
			{
				"key": "empty.noProductsDescription",
				"field": "empty__noProductsDescription",
				"label": "Vacío / Sin productos texto",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "La tienda irá incorporando nuevas piezas próximamente."
			},
			{
				"key": "empty.noResultsPrefix",
				"field": "empty__noResultsPrefix",
				"label": "Vacío / Sin resultados prefijo",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "Sin resultados en"
			},
			{
				"key": "empty.noResultsDescription",
				"field": "empty__noResultsDescription",
				"label": "Vacío / Sin resultados texto",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "Prueba otra categoría o vuelve a ver toda la colección."
			},
			{
				"key": "empty.showAll",
				"field": "empty__showAll",
				"label": "Vacío / Botón ver todo",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver toda la colección"
			}
		]
	},
	{
		"key": "product",
		"typeName": "pageProduct",
		"title": "Ficha de producto",
		"route": "/tienda/[slug]",
		"seoTitle": "Selvatic · Producto",
		"seoDescription": "Detalle de producto Selvatic.",
		"groups": [
			"intro",
			"productCard",
			"gallery",
			"summary",
			"action",
			"related"
		],
		"fields": [
			{
				"key": "intro.kicker",
				"field": "intro__kicker",
				"label": "Intro / Antetítulo",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Producto"
			},
			{
				"key": "intro.descriptionEnabled",
				"field": "intro__descriptionEnabled",
				"label": "Intro / Descripción tienda activa",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "Detalle de producto con imagen principal y compra directa desde la web."
			},
			{
				"key": "intro.descriptionDisabled",
				"field": "intro__descriptionDisabled",
				"label": "Intro / Descripción tienda pausada",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "La pieza sigue visible a modo de catálogo mientras terminamos la apertura de la tienda online."
			},
			{
				"key": "productCard.addToCartLabel",
				"field": "productCard__addToCartLabel",
				"label": "Tarjeta producto / Botón añadir",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir"
			},
			{
				"key": "productCard.addToCartAria",
				"field": "productCard__addToCartAria",
				"label": "Tarjeta producto / Accesibilidad añadir",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir {product} al carrito"
			},
			{
				"key": "productCard.comingSoonLabel",
				"field": "productCard__comingSoonLabel",
				"label": "Tarjeta producto / Botón próximamente",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Próximamente"
			},
			{
				"key": "productCard.viewImageAria",
				"field": "productCard__viewImageAria",
				"label": "Tarjeta producto / Accesibilidad imagen",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver imagen completa de {product}"
			},
			{
				"key": "productCard.viewProductAria",
				"field": "productCard__viewProductAria",
				"label": "Tarjeta producto / Accesibilidad enlace",
				"group": "productCard",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver {product}"
			},
			{
				"key": "gallery.thumbnailAria",
				"field": "gallery__thumbnailAria",
				"label": "Galería / Accesibilidad miniatura",
				"group": "gallery",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ver imagen {index} de {product}"
			},
			{
				"key": "summary.kicker",
				"field": "summary__kicker",
				"label": "Resumen / Antetítulo",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Resumen"
			},
			{
				"key": "summary.price",
				"field": "summary__price",
				"label": "Resumen / Precio",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Precio"
			},
			{
				"key": "summary.stock",
				"field": "summary__stock",
				"label": "Resumen / Stock",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Stock"
			},
			{
				"key": "action.addToCart",
				"field": "action__addToCart",
				"label": "Acción / Añadir",
				"group": "action",
				"kind": "text",
				"multiline": false,
				"initialValue": "Añadir al carrito"
			},
			{
				"key": "action.goToCart",
				"field": "action__goToCart",
				"label": "Acción / Ir al carrito",
				"group": "action",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ir al carrito"
			},
			{
				"key": "action.backToShop",
				"field": "action__backToShop",
				"label": "Acción / Volver",
				"group": "action",
				"kind": "text",
				"multiline": false,
				"initialValue": "Volver a tienda"
			},
			{
				"key": "action.storeComingSoon",
				"field": "action__storeComingSoon",
				"label": "Acción / Próximamente",
				"group": "action",
				"kind": "text",
				"multiline": false,
				"initialValue": "Tienda online próximamente"
			},
			{
				"key": "related.kicker",
				"field": "related__kicker",
				"label": "Relacionados / Antetítulo",
				"group": "related",
				"kind": "text",
				"multiline": false,
				"initialValue": "Relacionados"
			},
			{
				"key": "related.label",
				"field": "related__label",
				"label": "Relacionados / Label",
				"group": "related",
				"kind": "text",
				"multiline": false,
				"initialValue": "Más productos"
			}
		]
	},
	{
		"key": "services",
		"typeName": "pageServices",
		"title": "Servicios",
		"route": "/servicios",
		"seoTitle": "Selvatic · Servicios",
		"seoDescription": "Diseño floral natural para espacios, encargos y proyectos con identidad.",
		"groups": [
			"intro",
			"method",
			"material",
			"list",
			"media"
		],
		"fields": [
			{
				"key": "intro.kicker",
				"field": "intro__kicker",
				"label": "Intro / Antetítulo",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicios"
			},
			{
				"key": "intro.title",
				"field": "intro__title",
				"label": "Intro / Título",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "Diseño floral natural para espacios, encargos y proyectos con identidad."
			},
			{
				"key": "intro.description",
				"field": "intro__description",
				"label": "Intro / Descripción",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "Trabajamos desde la experiencia, el criterio y el respeto por lo natural. Cada propuesta se construye con sencillez, equilibrio y una escucha cercana."
			},
			{
				"key": "method.kicker",
				"field": "method__kicker",
				"label": "Metodología / Antetítulo",
				"group": "method",
				"kind": "text",
				"multiline": false,
				"initialValue": "Metodología"
			},
			{
				"key": "method.label",
				"field": "method__label",
				"label": "Metodología / Label",
				"group": "method",
				"kind": "text",
				"multiline": false,
				"initialValue": "Proceso"
			},
			{
				"key": "method.title",
				"field": "method__title",
				"label": "Metodología / Título",
				"group": "method",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicio cercano, criterio claro y una producción pensada con calma."
			},
			{
				"key": "method.step1",
				"field": "method__step1",
				"label": "Metodología / Paso 1",
				"group": "method",
				"kind": "text",
				"multiline": false,
				"initialValue": "1. Escuchamos la necesidad, el espacio y el tono del proyecto."
			},
			{
				"key": "method.step2",
				"field": "method__step2",
				"label": "Metodología / Paso 2",
				"group": "method",
				"kind": "text",
				"multiline": false,
				"initialValue": "2. Definimos una propuesta floral y un presupuesto personalizado."
			},
			{
				"key": "method.step3",
				"field": "method__step3",
				"label": "Metodología / Paso 3",
				"group": "method",
				"kind": "text",
				"multiline": true,
				"initialValue": "3. Seleccionamos material, producimos y acompañamos hasta la entrega final."
			},
			{
				"key": "method.cta",
				"field": "method__cta",
				"label": "Metodología / Botón",
				"group": "method",
				"kind": "text",
				"multiline": false,
				"initialValue": "Pedir propuesta"
			},
			{
				"key": "material.kicker",
				"field": "material__kicker",
				"label": "Materialidad / Antetítulo",
				"group": "material",
				"kind": "text",
				"multiline": false,
				"initialValue": "Materia y criterio"
			},
			{
				"key": "material.label",
				"field": "material__label",
				"label": "Materialidad / Label",
				"group": "material",
				"kind": "text",
				"multiline": false,
				"initialValue": "Materialidad"
			},
			{
				"key": "material.title",
				"field": "material__title",
				"label": "Materialidad / Título",
				"group": "material",
				"kind": "text",
				"multiline": true,
				"initialValue": "Flor seca, preservada y planta natural trabajadas con una estética atemporal."
			},
			{
				"key": "material.p1",
				"field": "material__p1",
				"label": "Materialidad / Texto 1",
				"group": "material",
				"kind": "text",
				"multiline": true,
				"initialValue": "Aproximadamente el 70% de nuestro trabajo se centra en creaciones con flor seca y preservada, combinadas con una cuidada selección de planta natural."
			},
			{
				"key": "material.p2",
				"field": "material__p2",
				"label": "Materialidad / Texto 2",
				"group": "material",
				"kind": "text",
				"multiline": true,
				"initialValue": "Cada pieza se diseña de forma consciente, respetando la forma y el carácter del material vegetal para que la composición mantenga calma, equilibrio y verdad."
			},
			{
				"key": "list.label",
				"field": "list__label",
				"label": "Listado / Label",
				"group": "list",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicios"
			},
			{
				"key": "list.featuredLabel",
				"field": "list__featuredLabel",
				"label": "Listado / Texto destacado",
				"group": "list",
				"kind": "text",
				"multiline": false,
				"initialValue": "Destacado"
			},
			{
				"key": "list.title",
				"field": "list__title",
				"label": "Listado / Título",
				"group": "list",
				"kind": "text",
				"multiline": false,
				"initialValue": "Intervenciones, encargos y ramos a medida"
			},
			{
				"key": "list.description",
				"field": "list__description",
				"label": "Listado / Descripción",
				"group": "list",
				"kind": "text",
				"multiline": true,
				"initialValue": "Propuestas personalizadas adaptadas a cada proyecto, con acompañamiento desde la idea hasta la entrega."
			},
			{
				"key": "list.emptyTitle",
				"field": "list__emptyTitle",
				"label": "Listado / Vacío título",
				"group": "list",
				"kind": "text",
				"multiline": false,
				"initialValue": "No hay servicios publicados"
			},
			{
				"key": "list.emptyDescription",
				"field": "list__emptyDescription",
				"label": "Listado / Vacío texto",
				"group": "list",
				"kind": "text",
				"multiline": true,
				"initialValue": "Muy pronto mostraremos aquí todas las propuestas y encargos disponibles."
			},
			{
				"key": "media.method",
				"field": "media__method",
				"label": "Imagen del bloque de metodología",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": "La imagen que acompaña al bloque \"Proceso\" en la página de servicios."
			}
		]
	},
	{
		"key": "about",
		"typeName": "pageAbout",
		"title": "Sobre nosotros",
		"route": "/sobre-nosotros",
		"seoTitle": "Selvatic · Sobre nosotros",
		"seoDescription": "Historia, oficio y mirada floral de Selvatic.",
		"groups": [
			"intro",
			"origin",
			"work",
			"media"
		],
		"fields": [
			{
				"key": "intro.kicker",
				"field": "intro__kicker",
				"label": "Intro / Antetítulo",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Sobre nosotros"
			},
			{
				"key": "intro.title",
				"field": "intro__title",
				"label": "Intro / Título",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "Selvatic es diseño floral natural con raíces familiares y una mirada serena."
			},
			{
				"key": "intro.description",
				"field": "intro__description",
				"label": "Intro / Descripción",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "Un proyecto construido desde la experiencia, el respeto por el producto y una forma de trabajar basada en la sencillez, el equilibrio y la naturalidad."
			},
			{
				"key": "origin.kicker",
				"field": "origin__kicker",
				"label": "Origen / Antetítulo",
				"group": "origin",
				"kind": "text",
				"multiline": false,
				"initialValue": "Origen"
			},
			{
				"key": "origin.label",
				"field": "origin__label",
				"label": "Origen / Label",
				"group": "origin",
				"kind": "text",
				"multiline": false,
				"initialValue": "Legado familiar"
			},
			{
				"key": "origin.title",
				"field": "origin__title",
				"label": "Origen / Título",
				"group": "origin",
				"kind": "text",
				"multiline": false,
				"initialValue": "La historia de Selvatic empieza mucho antes del estudio actual."
			},
			{
				"key": "origin.p1",
				"field": "origin__p1",
				"label": "Origen / Texto 1",
				"group": "origin",
				"kind": "text",
				"multiline": true,
				"initialValue": "Selvatic es un proyecto de diseño floral natural con raíces en una larga tradición familiar ligada al mundo de la planta y la flor."
			},
			{
				"key": "origin.p2",
				"field": "origin__p2",
				"label": "Origen / Texto 2",
				"group": "origin",
				"kind": "text",
				"multiline": true,
				"initialValue": "Desde los años 70, cuando el abuelo Ananías recorría los mercados de Cuenca, Utiel, Requena y Ontinyent, hasta la continuidad del oficio en los años 90 de la mano de Vicente y Carmen, el conocimiento del sector y el respeto por el producto han marcado siempre nuestro camino."
			},
			{
				"key": "work.kicker",
				"field": "work__kicker",
				"label": "Forma de trabajar / Antetítulo",
				"group": "work",
				"kind": "text",
				"multiline": false,
				"initialValue": "Forma de trabajar"
			},
			{
				"key": "work.title",
				"field": "work__title",
				"label": "Forma de trabajar / Título",
				"group": "work",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicio cercano, criterio claro y atención a cada detalle."
			},
			{
				"key": "work.p1",
				"field": "work__p1",
				"label": "Forma de trabajar / Texto 1",
				"group": "work",
				"kind": "text",
				"multiline": true,
				"initialValue": "En Selvatic ofrecemos un servicio cercano y personalizado, cuidando cada detalle desde la selección del producto hasta la entrega final."
			},
			{
				"key": "work.p2",
				"field": "work__p2",
				"label": "Forma de trabajar / Texto 2",
				"group": "work",
				"kind": "text",
				"multiline": true,
				"initialValue": "Trabajamos desde la experiencia, el criterio y el respeto por lo natural. Selvatic es diseño floral natural, hecho con tiempo, conocimiento y sensibilidad."
			},
			{
				"key": "media.origin",
				"field": "media__origin",
				"label": "Imagen del bloque de origen",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": "La imagen que acompaña a la historia del estudio."
			},
			{
				"key": "media.gallery1",
				"field": "media__gallery1",
				"label": "Galería / Imagen 1",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": ""
			},
			{
				"key": "media.gallery2",
				"field": "media__gallery2",
				"label": "Galería / Imagen 2",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": ""
			},
			{
				"key": "media.gallery3",
				"field": "media__gallery3",
				"label": "Galería / Imagen 3",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": ""
			}
		]
	},
	{
		"key": "contact",
		"typeName": "pageContact",
		"title": "Contacto",
		"route": "/contacto",
		"seoTitle": "Selvatic · Contacto",
		"seoDescription": "Solicita presupuesto para trabajos florales a medida.",
		"groups": [
			"intro",
			"process",
			"emptyServices",
			"form"
		],
		"fields": [
			{
				"key": "intro.kicker",
				"field": "intro__kicker",
				"label": "Intro / Antetítulo",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Contacto"
			},
			{
				"key": "intro.title",
				"field": "intro__title",
				"label": "Intro / Título",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Tienes una idea o necesitas un trabajo floral a medida?"
			},
			{
				"key": "intro.description",
				"field": "intro__description",
				"label": "Intro / Descripción",
				"group": "intro",
				"kind": "text",
				"multiline": true,
				"initialValue": "En Selvatic realizo presupuestos personalizados y creaciones adaptadas a cada proyecto. Cuéntame qué necesitas y te responderé con una propuesta clara, sensible y realista."
			},
			{
				"key": "process.kicker",
				"field": "process__kicker",
				"label": "Proceso / Antetítulo",
				"group": "process",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicio cercano"
			},
			{
				"key": "process.label",
				"field": "process__label",
				"label": "Proceso / Label",
				"group": "process",
				"kind": "text",
				"multiline": false,
				"initialValue": "Proceso"
			},
			{
				"key": "process.title",
				"field": "process__title",
				"label": "Proceso / Título",
				"group": "process",
				"kind": "text",
				"multiline": false,
				"initialValue": "Cada encargo se acompaña de principio a fin."
			},
			{
				"key": "process.step1",
				"field": "process__step1",
				"label": "Proceso / Paso 1",
				"group": "process",
				"kind": "text",
				"multiline": false,
				"initialValue": "1. Escuchamos la idea, el uso del espacio y el timing del proyecto."
			},
			{
				"key": "process.step2",
				"field": "process__step2",
				"label": "Proceso / Paso 2",
				"group": "process",
				"kind": "text",
				"multiline": false,
				"initialValue": "2. Preparamos una propuesta floral y un presupuesto personalizado."
			},
			{
				"key": "process.step3",
				"field": "process__step3",
				"label": "Proceso / Paso 3",
				"group": "process",
				"kind": "text",
				"multiline": false,
				"initialValue": "3. Cuidamos la preparación, entrega y acompañamiento final."
			},
			{
				"key": "process.note",
				"field": "process__note",
				"label": "Proceso / Nota",
				"group": "process",
				"kind": "text",
				"multiline": true,
				"initialValue": "Trabajamos desde la experiencia, el criterio y el respeto por lo natural, cuidando cada detalle desde la selección del producto hasta la entrega final."
			},
			{
				"key": "emptyServices.title",
				"field": "emptyServices__title",
				"label": "Sin servicios / Título",
				"group": "emptyServices",
				"kind": "text",
				"multiline": false,
				"initialValue": "Todavía no hay servicios publicados"
			},
			{
				"key": "emptyServices.description",
				"field": "emptyServices__description",
				"label": "Sin servicios / Descripción",
				"group": "emptyServices",
				"kind": "text",
				"multiline": true,
				"initialValue": "Puedes enviarnos tu solicitud igualmente y te ayudaremos a definir el servicio ideal."
			},
			{
				"key": "form.name",
				"field": "form__name",
				"label": "Formulario / Nombre",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Nombre"
			},
			{
				"key": "form.email",
				"field": "form__email",
				"label": "Formulario / Email",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Email"
			},
			{
				"key": "form.phone",
				"field": "form__phone",
				"label": "Formulario / Teléfono",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Teléfono (opcional)"
			},
			{
				"key": "form.service",
				"field": "form__service",
				"label": "Formulario / Servicio",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Servicio"
			},
			{
				"key": "form.select",
				"field": "form__select",
				"label": "Formulario / Seleccionar",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Seleccionar"
			},
			{
				"key": "form.noServices",
				"field": "form__noServices",
				"label": "Formulario / Sin servicios",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Sin servicios publicados"
			},
			{
				"key": "form.noServicesHelp",
				"field": "form__noServicesHelp",
				"label": "Formulario / Ayuda sin servicios",
				"group": "form",
				"kind": "text",
				"multiline": true,
				"initialValue": "Si aún no ves opciones, cuéntanos tu idea en el mensaje y te orientaremos personalmente."
			},
			{
				"key": "form.message",
				"field": "form__message",
				"label": "Formulario / Mensaje",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Mensaje"
			},
			{
				"key": "form.submit",
				"field": "form__submit",
				"label": "Formulario / Botón enviar",
				"group": "form",
				"kind": "text",
				"multiline": false,
				"initialValue": "Solicitar presupuesto"
			}
		]
	},
	{
		"key": "checkout",
		"typeName": "pageCheckout",
		"title": "Checkout",
		"route": "/checkout",
		"seoTitle": "Selvatic · Checkout",
		"seoDescription": "Revisa tu carrito y finaliza tu compra.",
		"groups": [
			"intro",
			"disabled",
			"success",
			"cancel",
			"cart",
			"summary",
			"shipping",
			"empty",
			"media"
		],
		"fields": [
			{
				"key": "intro.kickerEnabled",
				"field": "intro__kickerEnabled",
				"label": "Intro / Antetítulo tienda activa",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Checkout"
			},
			{
				"key": "intro.kickerDisabled",
				"field": "intro__kickerDisabled",
				"label": "Intro / Antetítulo tienda pausada",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Tienda online"
			},
			{
				"key": "intro.titleEnabled",
				"field": "intro__titleEnabled",
				"label": "Intro / Título tienda activa",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Carrito de compra"
			},
			{
				"key": "intro.descriptionEnabled",
				"field": "intro__descriptionEnabled",
				"label": "Intro / Descripción tienda activa",
				"group": "intro",
				"kind": "text",
				"multiline": false,
				"initialValue": "Revisa tus productos y finaliza tu compra de forma segura."
			},
			{
				"key": "disabled.note",
				"field": "disabled__note",
				"label": "Tienda pausada / Nota",
				"group": "disabled",
				"kind": "text",
				"multiline": true,
				"initialValue": "Si necesitas una pieza o un encargo floral, podemos ayudarte por vía directa mientras terminamos la apertura de la tienda."
			},
			{
				"key": "disabled.contactCta",
				"field": "disabled__contactCta",
				"label": "Tienda pausada / Botón contacto",
				"group": "disabled",
				"kind": "text",
				"multiline": false,
				"initialValue": "Solicitar presupuesto"
			},
			{
				"key": "disabled.shopCta",
				"field": "disabled__shopCta",
				"label": "Tienda pausada / Botón tienda",
				"group": "disabled",
				"kind": "text",
				"multiline": false,
				"initialValue": "Seguir viendo piezas"
			},
			{
				"key": "success.kicker",
				"field": "success__kicker",
				"label": "Pago correcto / Antetítulo",
				"group": "success",
				"kind": "text",
				"multiline": false,
				"initialValue": "Pago confirmado"
			},
			{
				"key": "success.title",
				"field": "success__title",
				"label": "Pago correcto / Título",
				"group": "success",
				"kind": "text",
				"multiline": false,
				"initialValue": "Pago completado correctamente."
			},
			{
				"key": "success.description",
				"field": "success__description",
				"label": "Pago correcto / Descripción",
				"group": "success",
				"kind": "text",
				"multiline": true,
				"initialValue": "Hemos recibido tu pedido y comenzaremos su preparación. Si necesitamos más datos, te escribiremos por email."
			},
			{
				"key": "cancel.kicker",
				"field": "cancel__kicker",
				"label": "Pago cancelado / Antetítulo",
				"group": "cancel",
				"kind": "text",
				"multiline": false,
				"initialValue": "Pago cancelado"
			},
			{
				"key": "cancel.title",
				"field": "cancel__title",
				"label": "Pago cancelado / Texto",
				"group": "cancel",
				"kind": "text",
				"multiline": false,
				"initialValue": "No se realizó ningún cobro. Tu carrito sigue disponible."
			},
			{
				"key": "cart.kicker",
				"field": "cart__kicker",
				"label": "Carrito / Antetítulo",
				"group": "cart",
				"kind": "text",
				"multiline": false,
				"initialValue": "Productos"
			},
			{
				"key": "cart.label",
				"field": "cart__label",
				"label": "Carrito / Label",
				"group": "cart",
				"kind": "text",
				"multiline": false,
				"initialValue": "Carrito"
			},
			{
				"key": "cart.title",
				"field": "cart__title",
				"label": "Carrito / Título",
				"group": "cart",
				"kind": "text",
				"multiline": false,
				"initialValue": "Revisión antes de pagar"
			},
			{
				"key": "cart.stock",
				"field": "cart__stock",
				"label": "Carrito / Stock",
				"group": "cart",
				"kind": "text",
				"multiline": false,
				"initialValue": "Stock disponible:"
			},
			{
				"key": "summary.kicker",
				"field": "summary__kicker",
				"label": "Resumen / Antetítulo",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Resumen"
			},
			{
				"key": "summary.label",
				"field": "summary__label",
				"label": "Resumen / Label",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Total"
			},
			{
				"key": "summary.subtotal",
				"field": "summary__subtotal",
				"label": "Resumen / Subtotal",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Subtotal"
			},
			{
				"key": "summary.shipping",
				"field": "summary__shipping",
				"label": "Resumen / Envío",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Envío fijo"
			},
			{
				"key": "shipping.postalCodeLabel",
				"field": "shipping__postalCodeLabel",
				"label": "Envío / Etiqueta código postal",
				"group": "shipping",
				"kind": "text",
				"multiline": false,
				"initialValue": "Código postal de entrega"
			},
			{
				"key": "shipping.postalCodeHelp",
				"field": "shipping__postalCodeHelp",
				"label": "Envío / Ayuda código postal",
				"group": "shipping",
				"kind": "text",
				"multiline": true,
				"initialValue": "Comprobamos que tu código postal esté dentro de nuestra zona de reparto antes del pago."
			},
			{
				"key": "summary.total",
				"field": "summary__total",
				"label": "Resumen / Total",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Total"
			},
			{
				"key": "summary.submit",
				"field": "summary__submit",
				"label": "Resumen / Botón pagar",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Finalizar compra"
			},
			{
				"key": "summary.secureNote",
				"field": "summary__secureNote",
				"label": "Resumen / Nota pago seguro",
				"group": "summary",
				"kind": "text",
				"multiline": false,
				"initialValue": "Pago seguro. El carrito admite una sola moneda por pedido."
			},
			{
				"key": "empty.kicker",
				"field": "empty__kicker",
				"label": "Carrito vacío / Antetítulo",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "Carrito vacío"
			},
			{
				"key": "empty.title",
				"field": "empty__title",
				"label": "Carrito vacío / Título",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "Todavía no has añadido productos."
			},
			{
				"key": "empty.cta",
				"field": "empty__cta",
				"label": "Carrito vacío / Botón",
				"group": "empty",
				"kind": "text",
				"multiline": false,
				"initialValue": "Ir a tienda"
			},
			{
				"key": "media.checkout",
				"field": "media__checkout",
				"label": "Imagen de la tienda pausada",
				"group": "media",
				"kind": "image",
				"multiline": false,
				"initialValue": "",
				"description": "Solo se ve si la tienda online está pausada."
			}
		]
	},
	{
		"key": "maintenance",
		"typeName": "pageMaintenance",
		"title": "Mantenimiento",
		"route": "/mantenimiento",
		"seoTitle": "Selvatic · Mantenimiento",
		"seoDescription": "Estamos trabajando en la web de Selvatic.",
		"groups": [
			"general"
		],
		"fields": [
			{
				"key": "kicker",
				"field": "kicker",
				"label": "Pantalla / Antetítulo",
				"group": "general",
				"kind": "text",
				"multiline": false,
				"initialValue": "Mantenimiento"
			},
			{
				"key": "meta",
				"field": "meta",
				"label": "Pantalla / Cierre",
				"group": "general",
				"kind": "text",
				"multiline": false,
				"initialValue": "Volvemos muy pronto"
			}
		]
	}
];
