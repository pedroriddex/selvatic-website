import type { PageContent, PageContentMap, PageKey } from '$lib/types';

type EditableText = {
	key: string;
	label: string;
	value: string;
};

type PageDefaults = {
	key: PageKey;
	title: string;
	route: string;
	seoTitle: string;
	seoDescription: string;
	texts: EditableText[];
};

export const PAGE_DEFAULTS = [
	{
		key: 'global',
		title: 'Global',
		route: '*',
		seoTitle: 'Selvatic · Floristería',
		seoDescription:
			'Diseño floral natural con flor seca, preservada y planta natural. Ramos a medida, cerámica decorativa y propuestas personalizadas.',
		texts: [
			{ key: 'brand.name', label: 'Marca / Nombre', value: 'SELVATIC' },
			{ key: 'nav.home', label: 'Navegación / Inicio', value: 'Inicio' },
			{ key: 'nav.shop', label: 'Navegación / Tienda', value: 'Tienda' },
			{ key: 'nav.about', label: 'Navegación / Sobre nosotros', value: 'Sobre nosotros' },
			{ key: 'nav.services', label: 'Navegación / Servicios', value: 'Servicios' },
			{ key: 'nav.contact', label: 'Navegación / Contacto', value: 'Contacto' },
			{ key: 'cta.orderBouquet', label: 'CTA global / Encargar ramo', value: 'Encargar ramo' },
			{ key: 'cart.label', label: 'Carrito / Label móvil', value: 'Carrito' },
			{ key: 'cart.comingSoon', label: 'Carrito / Tienda próximamente', value: 'Tienda online próximamente' },
			{
				key: 'footer.description',
				label: 'Footer / Descripción',
				value:
					'Proyecto de diseño floral natural con raíces familiares, hecho con tiempo, conocimiento y sensibilidad.'
			}
		]
	},
	{
		key: 'home',
		title: 'Inicio',
		route: '/',
		seoTitle: 'Selvatic · Floristería',
		seoDescription:
			'Diseño floral natural con flor seca, preservada y planta natural. Ramos a medida, cerámica decorativa y propuestas personalizadas.',
		texts: [
			{ key: 'hero.kicker', label: 'Hero / Antetítulo', value: 'Selvatic / Diseño floral natural' },
			{
				key: 'hero.title',
				label: 'Hero / Título',
				value: 'Diseño floral natural con memoria, tiempo y sensibilidad.'
			},
			{
				key: 'hero.description',
				label: 'Hero / Descripción',
				value:
					'Proyecto floral liderado por Noelia Pérez, especializado en flor seca y preservada, con una mirada serena, honesta y atemporal para hogares, espacios y encargos a medida.'
			},
			{ key: 'hero.primaryCta', label: 'Hero / Botón principal', value: 'Ver tienda' },
			{ key: 'hero.secondaryCta', label: 'Hero / Botón secundario', value: 'Conocer el estudio' },
			{ key: 'productCard.addToCartLabel', label: 'Tarjeta producto / Botón añadir', value: 'Añadir' },
			{ key: 'productCard.addToCartAria', label: 'Tarjeta producto / Accesibilidad añadir', value: 'Añadir {product} al carrito' },
			{ key: 'productCard.comingSoonLabel', label: 'Tarjeta producto / Botón próximamente', value: 'Próximamente' },
			{ key: 'productCard.viewImageAria', label: 'Tarjeta producto / Accesibilidad imagen', value: 'Ver imagen completa de {product}' },
			{ key: 'productCard.viewProductAria', label: 'Tarjeta producto / Accesibilidad enlace', value: 'Ver {product}' },
			{ key: 'hero.railKicker', label: 'Hero / Rail título', value: 'Oficio' },
			{ key: 'hero.stat1.label', label: 'Hero / Dato 1 label', value: 'Origen' },
			{ key: 'hero.stat1.value', label: 'Hero / Dato 1 valor', value: 'Desde los 70' },
			{ key: 'hero.stat2.label', label: 'Hero / Dato 2 label', value: 'Especialidad' },
			{ key: 'hero.stat2.value', label: 'Hero / Dato 2 valor', value: 'Flor seca' },
			{ key: 'hero.stat3.label', label: 'Hero / Dato 3 label', value: 'Servicio' },
			{ key: 'hero.stat3.value', label: 'Hero / Dato 3 valor', value: 'A medida' },
			{ key: 'signal.1.title', label: 'Franja iconos / 1 título', value: 'Selección cuidada' },
			{
				key: 'signal.1.description',
				label: 'Franja iconos / 1 texto',
				value: 'Piezas elegidas con criterio natural, sereno y atemporal.'
			},
			{ key: 'signal.2.title', label: 'Franja iconos / 2 título', value: 'Encargos a medida' },
			{
				key: 'signal.2.description',
				label: 'Franja iconos / 2 texto',
				value: 'Propuestas adaptadas a regalo, hogar, evento o proyecto.'
			},
			{ key: 'signal.3.title', label: 'Franja iconos / 3 título', value: 'Atención cercana' },
			{
				key: 'signal.3.description',
				label: 'Franja iconos / 3 texto',
				value: 'Acompañamiento directo desde la idea hasta la entrega.'
			},
			{ key: 'signal.4.title', label: 'Franja iconos / 4 título', value: 'Composición honesta' },
			{
				key: 'signal.4.description',
				label: 'Franja iconos / 4 texto',
				value: 'Flor seca, preservada y cerámica en equilibrio visual.'
			},
			{ key: 'collections.kicker', label: 'Colecciones / Antetítulo', value: 'Colecciones' },
			{ key: 'collections.label', label: 'Colecciones / Label', value: 'Catálogo' },
			{ key: 'collections.title', label: 'Colecciones / Título', value: 'Selección botánica' },
			{
				key: 'collections.description',
				label: 'Colecciones / Descripción',
				value: 'Piezas para regalo, interiorismo residencial y producciones de marca.'
			},
			{ key: 'collections.action', label: 'Colecciones / Botón', value: 'Ver todo' },
			{ key: 'collections.emptyTitle', label: 'Colecciones / Vacío título', value: 'No hay productos publicados todavía' },
			{
				key: 'collections.emptyDescription',
				label: 'Colecciones / Vacío texto',
				value: 'La colección se irá completando con nuevas piezas muy pronto.'
			},
			{ key: 'bestSellers.kicker', label: 'Best sellers / Antetítulo', value: 'Best sellers' },
			{ key: 'bestSellers.label', label: 'Best sellers / Label', value: 'Selección' },
			{
				key: 'bestSellers.title',
				label: 'Best sellers / Título',
				value: 'Piezas con mayor salida esta temporada'
			},
			{ key: 'bestSellers.emptyTitle', label: 'Best sellers / Vacío título', value: 'Aún no hay selección destacada' },
			{
				key: 'bestSellers.emptyDescription',
				label: 'Best sellers / Vacío texto',
				value: 'Pronto mostraremos aquí una selección de piezas destacadas.'
			},
			{ key: 'promo.kicker', label: 'Promo / Antetítulo', value: 'Materia natural' },
			{ key: 'promo.label', label: 'Promo / Label', value: 'Especialidad' },
			{
				key: 'promo.title',
				label: 'Promo / Título',
				value: 'Flor seca, preservada y cerámica escogida con el mismo criterio.'
			},
			{
				key: 'promo.description',
				label: 'Promo / Descripción',
				value:
					'Selvatic está especializado en creaciones con flor seca y preservada, combinadas con una cuidada selección de planta natural y presentadas en cerámica decorativa.'
			},
			{ key: 'promo.primaryCta', label: 'Promo / Botón principal', value: 'Solicitar propuesta' },
			{ key: 'promo.secondaryCta', label: 'Promo / Botón secundario', value: 'Más sobre el estudio' },
			{ key: 'services.kicker', label: 'Servicios / Antetítulo', value: 'Servicios' },
			{ key: 'services.label', label: 'Servicios / Label', value: 'Atelier' },
			{
				key: 'services.title',
				label: 'Servicios / Título',
				value: 'Servicio cercano y diseño floral a medida'
			},
			{
				key: 'services.description',
				label: 'Servicios / Descripción',
				value: 'Cuidamos cada detalle desde la selección del producto hasta la entrega final.'
			},
			{ key: 'services.action', label: 'Servicios / Botón', value: 'Todos los servicios' },
			{ key: 'services.emptyTitle', label: 'Servicios / Vacío título', value: 'No hay servicios publicados todavía' },
			{
				key: 'services.emptyDescription',
				label: 'Servicios / Vacío texto',
				value: 'Muy pronto encontrarás aquí todos los servicios disponibles.'
			}
		]
	},
	{
		key: 'shop',
		title: 'Tienda',
		route: '/tienda',
		seoTitle: 'Selvatic · Tienda',
		seoDescription: 'Flores secas y piezas florales de Selvatic para regalar, habitar y conservar.',
		texts: [
			{ key: 'intro.kicker', label: 'Intro / Antetítulo', value: 'Tienda' },
			{
				key: 'intro.title',
				label: 'Intro / Título',
				value: 'Flores secas y piezas florales para regalar, habitar y conservar.'
			},
			{
				key: 'intro.description',
				label: 'Intro / Descripción',
				value: 'Colecciones de unidades limitadas con edición continua: textura, volumen y paleta neutra en equilibrio.'
			},

			{ key: 'productCard.addToCartLabel', label: 'Tarjeta producto / Botón añadir', value: 'Añadir' },
			{ key: 'productCard.addToCartAria', label: 'Tarjeta producto / Accesibilidad añadir', value: 'Añadir {product} al carrito' },
			{ key: 'productCard.comingSoonLabel', label: 'Tarjeta producto / Botón próximamente', value: 'Próximamente' },
			{ key: 'productCard.viewImageAria', label: 'Tarjeta producto / Accesibilidad imagen', value: 'Ver imagen completa de {product}' },
			{ key: 'productCard.viewProductAria', label: 'Tarjeta producto / Accesibilidad enlace', value: 'Ver {product}' },
			{ key: 'collection.kicker', label: 'Colección / Antetítulo', value: 'Colección completa' },
			{ key: 'collection.label', label: 'Colección / Label', value: 'Productos' },
			{ key: 'collection.title', label: 'Colección / Título', value: 'Piezas disponibles' },
			{ key: 'collection.disabledDescription', label: 'Colección / Tienda pausada', value: 'Explora la colección mientras terminamos la apertura de la tienda online.' },
			{ key: 'collection.emptyDescription', label: 'Colección / Sin productos', value: 'Aún no hay piezas disponibles en la colección.' },
			{ key: 'collection.noResultsTemplate', label: 'Colección / Sin resultados', value: 'No hay productos activos en {category}.' },
			{ key: 'collection.filteredTemplate', label: 'Colección / Filtro activo', value: '{count} piezas en {category}. Precio y disponibilidad actualizados.' },
			{ key: 'collection.allTemplate', label: 'Colección / Todos los productos', value: '{count} piezas disponibles. Precio y disponibilidad actualizados.' },
			{ key: 'filter.allCategoriesLabel', label: 'Filtro / Todas las categorías', value: 'Todas las categorías' },
			{ key: 'filter.all', label: 'Filtro / Todas', value: 'Todas' },
			{ key: 'empty.noProductsTitle', label: 'Vacío / Sin productos título', value: 'No hay productos publicados' },
			{
				key: 'empty.noProductsDescription',
				label: 'Vacío / Sin productos texto',
				value: 'La tienda irá incorporando nuevas piezas próximamente.'
			},
			{ key: 'empty.noResultsPrefix', label: 'Vacío / Sin resultados prefijo', value: 'Sin resultados en' },
			{
				key: 'empty.noResultsDescription',
				label: 'Vacío / Sin resultados texto',
				value: 'Prueba otra categoría o vuelve a ver toda la colección.'
			},
			{ key: 'empty.showAll', label: 'Vacío / Botón ver todo', value: 'Ver toda la colección' }
		]
	},
	{
		key: 'product',
		title: 'Ficha de producto',
		route: '/tienda/[slug]',
		seoTitle: 'Selvatic · Producto',
		seoDescription: 'Detalle de producto Selvatic.',
		texts: [
			{ key: 'intro.kicker', label: 'Intro / Antetítulo', value: 'Producto' },
			{
				key: 'intro.descriptionEnabled',
				label: 'Intro / Descripción tienda activa',
				value: 'Detalle de producto con imagen principal y compra directa desde la web.'
			},
			{
				key: 'intro.descriptionDisabled',
				label: 'Intro / Descripción tienda pausada',
				value: 'La pieza sigue visible a modo de catálogo mientras terminamos la apertura de la tienda online.'
			},
			{ key: 'productCard.addToCartLabel', label: 'Tarjeta producto / Botón añadir', value: 'Añadir' },
			{ key: 'productCard.addToCartAria', label: 'Tarjeta producto / Accesibilidad añadir', value: 'Añadir {product} al carrito' },
			{ key: 'productCard.comingSoonLabel', label: 'Tarjeta producto / Botón próximamente', value: 'Próximamente' },
			{ key: 'productCard.viewImageAria', label: 'Tarjeta producto / Accesibilidad imagen', value: 'Ver imagen completa de {product}' },
			{ key: 'productCard.viewProductAria', label: 'Tarjeta producto / Accesibilidad enlace', value: 'Ver {product}' },
			{ key: 'gallery.thumbnailAria', label: 'Galería / Accesibilidad miniatura', value: 'Ver imagen {index} de {product}' },
			{ key: 'summary.kicker', label: 'Resumen / Antetítulo', value: 'Resumen' },
			{ key: 'summary.price', label: 'Resumen / Precio', value: 'Precio' },
			{ key: 'summary.stock', label: 'Resumen / Stock', value: 'Stock' },
			{ key: 'action.addToCart', label: 'Acción / Añadir', value: 'Añadir al carrito' },
			{ key: 'action.goToCart', label: 'Acción / Ir al carrito', value: 'Ir al carrito' },
			{ key: 'action.backToShop', label: 'Acción / Volver', value: 'Volver a tienda' },
			{ key: 'action.storeComingSoon', label: 'Acción / Próximamente', value: 'Tienda online próximamente' },
			{ key: 'related.kicker', label: 'Relacionados / Antetítulo', value: 'Relacionados' },
			{ key: 'related.label', label: 'Relacionados / Label', value: 'Más productos' }
		]
	},
	{
		key: 'services',
		title: 'Servicios',
		route: '/servicios',
		seoTitle: 'Selvatic · Servicios',
		seoDescription: 'Diseño floral natural para espacios, encargos y proyectos con identidad.',
		texts: [
			{ key: 'intro.kicker', label: 'Intro / Antetítulo', value: 'Servicios' },
			{
				key: 'intro.title',
				label: 'Intro / Título',
				value: 'Diseño floral natural para espacios, encargos y proyectos con identidad.'
			},
			{
				key: 'intro.description',
				label: 'Intro / Descripción',
				value: 'Trabajamos desde la experiencia, el criterio y el respeto por lo natural. Cada propuesta se construye con sencillez, equilibrio y una escucha cercana.'
			},
			{ key: 'method.kicker', label: 'Metodología / Antetítulo', value: 'Metodología' },
			{ key: 'method.label', label: 'Metodología / Label', value: 'Proceso' },
			{
				key: 'method.title',
				label: 'Metodología / Título',
				value: 'Servicio cercano, criterio claro y una producción pensada con calma.'
			},
			{ key: 'method.step1', label: 'Metodología / Paso 1', value: '1. Escuchamos la necesidad, el espacio y el tono del proyecto.' },
			{ key: 'method.step2', label: 'Metodología / Paso 2', value: '2. Definimos una propuesta floral y un presupuesto personalizado.' },
			{ key: 'method.step3', label: 'Metodología / Paso 3', value: '3. Seleccionamos material, producimos y acompañamos hasta la entrega final.' },
			{ key: 'method.cta', label: 'Metodología / Botón', value: 'Pedir propuesta' },
			{ key: 'material.kicker', label: 'Materialidad / Antetítulo', value: 'Materia y criterio' },
			{ key: 'material.label', label: 'Materialidad / Label', value: 'Materialidad' },
			{
				key: 'material.title',
				label: 'Materialidad / Título',
				value: 'Flor seca, preservada y planta natural trabajadas con una estética atemporal.'
			},
			{
				key: 'material.p1',
				label: 'Materialidad / Texto 1',
				value: 'Aproximadamente el 70% de nuestro trabajo se centra en creaciones con flor seca y preservada, combinadas con una cuidada selección de planta natural.'
			},
			{
				key: 'material.p2',
				label: 'Materialidad / Texto 2',
				value: 'Cada pieza se diseña de forma consciente, respetando la forma y el carácter del material vegetal para que la composición mantenga calma, equilibrio y verdad.'
			},
			{ key: 'presentation.kicker', label: 'Presentación / Antetítulo', value: 'Presentación' },
			{
				key: 'presentation.title',
				label: 'Presentación / Título',
				value: 'La cerámica forma parte de la composición, no solo del soporte.'
			},
			{
				key: 'presentation.p1',
				label: 'Presentación / Texto 1',
				value: 'Todas las composiciones se presentan en cerámica decorativa, seleccionada con el mismo criterio natural y honesto que guía el diseño floral.'
			},
			{
				key: 'presentation.p2',
				label: 'Presentación / Texto 2',
				value: 'Son piezas pensadas para integrarse en los espacios y acompañar el día a día con belleza serena, desde encargos personales hasta proyectos de interiorismo.'
			},
			{ key: 'list.label', label: 'Listado / Label', value: 'Servicios' },
			{ key: 'list.featuredLabel', label: 'Listado / Texto destacado', value: 'Destacado' },
			{ key: 'list.title', label: 'Listado / Título', value: 'Intervenciones, encargos y ramos a medida' },
			{
				key: 'list.description',
				label: 'Listado / Descripción',
				value: 'Propuestas personalizadas adaptadas a cada proyecto, con acompañamiento desde la idea hasta la entrega.'
			},
			{ key: 'list.emptyTitle', label: 'Listado / Vacío título', value: 'No hay servicios publicados' },
			{
				key: 'list.emptyDescription',
				label: 'Listado / Vacío texto',
				value: 'Muy pronto mostraremos aquí todas las propuestas y encargos disponibles.'
			}
		]
	},
	{
		key: 'about',
		title: 'Sobre nosotros',
		route: '/sobre-nosotros',
		seoTitle: 'Selvatic · Sobre nosotros',
		seoDescription: 'Historia, oficio y mirada floral de Selvatic.',
		texts: [
			{ key: 'intro.kicker', label: 'Intro / Antetítulo', value: 'Sobre nosotros' },
			{
				key: 'intro.title',
				label: 'Intro / Título',
				value: 'Selvatic es diseño floral natural con raíces familiares y una mirada serena.'
			},
			{
				key: 'intro.description',
				label: 'Intro / Descripción',
				value: 'Un proyecto construido desde la experiencia, el respeto por el producto y una forma de trabajar basada en la sencillez, el equilibrio y la naturalidad.'
			},
			{ key: 'origin.kicker', label: 'Origen / Antetítulo', value: 'Origen' },
			{ key: 'origin.label', label: 'Origen / Label', value: 'Legado familiar' },
			{ key: 'origin.title', label: 'Origen / Título', value: 'La historia de Selvatic empieza mucho antes del estudio actual.' },
			{ key: 'origin.p1', label: 'Origen / Texto 1', value: 'Selvatic es un proyecto de diseño floral natural con raíces en una larga tradición familiar ligada al mundo de la planta y la flor.' },
			{ key: 'origin.p2', label: 'Origen / Texto 2', value: 'Desde los años 70, cuando el abuelo Ananías recorría los mercados de Cuenca, Utiel, Requena y Ontinyent, hasta la continuidad del oficio en los años 90 de la mano de Vicente y Carmen, el conocimiento del sector y el respeto por el producto han marcado siempre nuestro camino.' },
			{ key: 'director.kicker', label: 'Dirección / Antetítulo', value: 'Dirección actual' },
			{ key: 'director.label', label: 'Dirección / Label', value: 'Noelia Pérez' },
			{ key: 'director.title', label: 'Dirección / Título', value: 'Hoy, el estudio está liderado y gestionado de forma integral por Noelia Pérez.' },
			{ key: 'director.p1', label: 'Dirección / Texto 1', value: 'A lo largo de su trayectoria ha trabajado junto a destacados profesionales del sector, desarrollando una manera de entender el diseño floral basada en la sencillez, el equilibrio y la naturalidad.' },
			{ key: 'director.p2', label: 'Dirección / Texto 2', value: 'Cada encargo se aborda con una mirada consciente, dejando que el material vegetal conserve su forma, su ritmo y su carácter, y buscando siempre una estética atemporal.' },
			{ key: 'work.kicker', label: 'Forma de trabajar / Antetítulo', value: 'Forma de trabajar' },
			{ key: 'work.title', label: 'Forma de trabajar / Título', value: 'Servicio cercano, criterio claro y atención a cada detalle.' },
			{ key: 'work.p1', label: 'Forma de trabajar / Texto 1', value: 'En Selvatic ofrecemos un servicio cercano y personalizado, cuidando cada detalle desde la selección del producto hasta la entrega final.' },
			{ key: 'work.p2', label: 'Forma de trabajar / Texto 2', value: 'Trabajamos desde la experiencia, el criterio y el respeto por lo natural. Selvatic es diseño floral natural, hecho con tiempo, conocimiento y sensibilidad.' },
			{ key: 'gallery.kicker', label: 'Galería / Antetítulo', value: 'Selección visual' },
			{ key: 'gallery.label', label: 'Galería / Label', value: 'Imágenes' },
			{ key: 'gallery.title', label: 'Galería / Título', value: 'Una muestra del gesto floral, la escala y la presencia material del estudio.' },
			{ key: 'material.kicker', label: 'Materialidad / Antetítulo', value: 'Materialidad' },
			{ key: 'material.label', label: 'Materialidad / Label', value: 'Especialidad' },
			{ key: 'material.title', label: 'Materialidad / Título', value: 'Flor seca y preservada, combinadas con planta natural y una selección honesta de cerámica.' },
			{ key: 'material.p1', label: 'Materialidad / Texto 1', value: 'Selvatic está especializado en creaciones florales con flor seca y preservada, que representan aproximadamente el 70% de nuestro trabajo, combinadas con una cuidada selección de planta natural.' },
			{ key: 'material.p2', label: 'Materialidad / Texto 2', value: 'Todas las composiciones se presentan en cerámica decorativa, seleccionada con el mismo criterio natural y honesto que define nuestro trabajo.' },
			{ key: 'presence.kicker', label: 'Presencia / Antetítulo', value: 'Presencia' },
			{ key: 'presence.title', label: 'Presencia / Título', value: 'Piezas pensadas para integrarse en los espacios y acompañar el día a día con calma.' },
			{ key: 'presence.p1', label: 'Presencia / Texto 1', value: 'Son composiciones concebidas para convivir con el espacio, aportar belleza serena y sostener una presencia natural y duradera.' },
			{ key: 'presence.p2', label: 'Presencia / Texto 2', value: 'Esa misma lógica guía tanto los encargos personales como los trabajos florales a medida para interiorismo, eventos o proyectos de marca.' },
			{ key: 'contact.kicker', label: 'Contacto / Antetítulo', value: 'Contacto' },
			{ key: 'contact.label', label: 'Contacto / Label', value: 'Encargos a medida' },
			{ key: 'contact.title', label: 'Contacto / Título', value: 'Tienes una idea o necesitas un trabajo floral personalizado?' },
			{ key: 'contact.description', label: 'Contacto / Descripción', value: 'En Selvatic realizamos presupuestos personalizados y creaciones adaptadas a cada proyecto.' },
			{ key: 'contact.cta', label: 'Contacto / Botón', value: 'Solicitar presupuesto' }
		]
	},
	{
		key: 'contact',
		title: 'Contacto',
		route: '/contacto',
		seoTitle: 'Selvatic · Contacto',
		seoDescription: 'Solicita presupuesto para trabajos florales a medida.',
		texts: [
			{ key: 'intro.kicker', label: 'Intro / Antetítulo', value: 'Contacto' },
			{ key: 'intro.title', label: 'Intro / Título', value: 'Tienes una idea o necesitas un trabajo floral a medida?' },
			{ key: 'intro.description', label: 'Intro / Descripción', value: 'En Selvatic realizo presupuestos personalizados y creaciones adaptadas a cada proyecto. Cuéntame qué necesitas y te responderé con una propuesta clara, sensible y realista.' },
			{ key: 'process.kicker', label: 'Proceso / Antetítulo', value: 'Servicio cercano' },
			{ key: 'process.label', label: 'Proceso / Label', value: 'Proceso' },
			{ key: 'process.title', label: 'Proceso / Título', value: 'Cada encargo se acompaña de principio a fin.' },
			{ key: 'process.step1', label: 'Proceso / Paso 1', value: '1. Escuchamos la idea, el uso del espacio y el timing del proyecto.' },
			{ key: 'process.step2', label: 'Proceso / Paso 2', value: '2. Preparamos una propuesta floral y un presupuesto personalizado.' },
			{ key: 'process.step3', label: 'Proceso / Paso 3', value: '3. Cuidamos la preparación, entrega y acompañamiento final.' },
			{ key: 'process.note', label: 'Proceso / Nota', value: 'Trabajamos desde la experiencia, el criterio y el respeto por lo natural, cuidando cada detalle desde la selección del producto hasta la entrega final.' },
			{ key: 'emptyServices.title', label: 'Sin servicios / Título', value: 'Todavía no hay servicios publicados' },
			{ key: 'emptyServices.description', label: 'Sin servicios / Descripción', value: 'Puedes enviarnos tu solicitud igualmente y te ayudaremos a definir el servicio ideal.' },
			{ key: 'form.name', label: 'Formulario / Nombre', value: 'Nombre' },
			{ key: 'form.email', label: 'Formulario / Email', value: 'Email' },
			{ key: 'form.phone', label: 'Formulario / Teléfono', value: 'Teléfono (opcional)' },
			{ key: 'form.service', label: 'Formulario / Servicio', value: 'Servicio' },
			{ key: 'form.select', label: 'Formulario / Seleccionar', value: 'Seleccionar' },
			{ key: 'form.noServices', label: 'Formulario / Sin servicios', value: 'Sin servicios publicados' },
			{ key: 'form.noServicesHelp', label: 'Formulario / Ayuda sin servicios', value: 'Si aún no ves opciones, cuéntanos tu idea en el mensaje y te orientaremos personalmente.' },
			{ key: 'form.message', label: 'Formulario / Mensaje', value: 'Mensaje' },
			{ key: 'form.submit', label: 'Formulario / Botón enviar', value: 'Solicitar presupuesto' }
		]
	},
	{
		key: 'checkout',
		title: 'Checkout',
		route: '/checkout',
		seoTitle: 'Selvatic · Checkout',
		seoDescription: 'Revisa tu carrito y finaliza tu compra.',
		texts: [
			{ key: 'intro.kickerEnabled', label: 'Intro / Antetítulo tienda activa', value: 'Checkout' },
			{ key: 'intro.kickerDisabled', label: 'Intro / Antetítulo tienda pausada', value: 'Tienda online' },
			{ key: 'intro.titleEnabled', label: 'Intro / Título tienda activa', value: 'Carrito de compra' },
			{ key: 'intro.descriptionEnabled', label: 'Intro / Descripción tienda activa', value: 'Revisa tus productos y finaliza tu compra de forma segura.' },
			{ key: 'disabled.note', label: 'Tienda pausada / Nota', value: 'Si necesitas una pieza o un encargo floral, podemos ayudarte por vía directa mientras terminamos la apertura de la tienda.' },
			{ key: 'disabled.contactCta', label: 'Tienda pausada / Botón contacto', value: 'Solicitar presupuesto' },
			{ key: 'disabled.shopCta', label: 'Tienda pausada / Botón tienda', value: 'Seguir viendo piezas' },
			{ key: 'success.kicker', label: 'Pago correcto / Antetítulo', value: 'Pago confirmado' },
			{ key: 'success.title', label: 'Pago correcto / Título', value: 'Pago completado correctamente.' },
			{ key: 'success.description', label: 'Pago correcto / Descripción', value: 'Hemos recibido tu pedido y comenzaremos su preparación. Si necesitamos más datos, te escribiremos por email.' },
			{ key: 'cancel.kicker', label: 'Pago cancelado / Antetítulo', value: 'Pago cancelado' },
			{ key: 'cancel.title', label: 'Pago cancelado / Texto', value: 'No se realizó ningún cobro. Tu carrito sigue disponible.' },
			{ key: 'cart.kicker', label: 'Carrito / Antetítulo', value: 'Productos' },
			{ key: 'cart.label', label: 'Carrito / Label', value: 'Carrito' },
			{ key: 'cart.title', label: 'Carrito / Título', value: 'Revisión antes de pagar' },
			{ key: 'cart.stock', label: 'Carrito / Stock', value: 'Stock disponible:' },
			{ key: 'summary.kicker', label: 'Resumen / Antetítulo', value: 'Resumen' },
			{ key: 'summary.label', label: 'Resumen / Label', value: 'Total' },
			{ key: 'summary.subtotal', label: 'Resumen / Subtotal', value: 'Subtotal' },
			{ key: 'summary.shipping', label: 'Resumen / Envío', value: 'Envío fijo' },
			{ key: 'summary.total', label: 'Resumen / Total', value: 'Total' },
			{ key: 'summary.submit', label: 'Resumen / Botón pagar', value: 'Finalizar compra' },
			{ key: 'summary.secureNote', label: 'Resumen / Nota pago seguro', value: 'Pago seguro. El carrito admite una sola moneda por pedido.' },
			{ key: 'empty.kicker', label: 'Carrito vacío / Antetítulo', value: 'Carrito vacío' },
			{ key: 'empty.title', label: 'Carrito vacío / Título', value: 'Todavía no has añadido productos.' },
			{ key: 'empty.cta', label: 'Carrito vacío / Botón', value: 'Ir a tienda' }
		]
	},
	{
		key: 'maintenance',
		title: 'Mantenimiento',
		route: '/mantenimiento',
		seoTitle: 'Selvatic · Mantenimiento',
		seoDescription: 'Estamos trabajando en la web de Selvatic.',
		texts: [
			{ key: 'kicker', label: 'Pantalla / Antetítulo', value: 'Mantenimiento' },
			{ key: 'meta', label: 'Pantalla / Cierre', value: 'Volvemos muy pronto' }
		]
	}
] satisfies PageDefaults[];

export const DEFAULT_PAGE_CONTENT_MAP = PAGE_DEFAULTS.reduce((pages, page) => {
	pages[page.key] = {
		key: page.key,
		title: page.title,
		route: page.route,
		seoTitle: page.seoTitle,
		seoDescription: page.seoDescription,
		texts: page.texts.reduce(
			(entries, entry) => {
				entries[entry.key] = entry.value;
				return entries;
			},
			{} as Record<string, string>
		)
	};
	return pages;
}, {} as Record<PageKey, PageContent>);

export const getDefaultPageContent = (key: PageKey): PageContent => DEFAULT_PAGE_CONTENT_MAP[key];

export const mergePageContent = (
	key: PageKey,
	content: PageContent | null | undefined
): PageContent => {
	const fallback = getDefaultPageContent(key);
	if (!content) {
		return fallback;
	}

	return {
		...fallback,
		...content,
		texts: {
			...fallback.texts,
			...content.texts
		}
	};
};

export const textFor = (content: PageContent, key: string): string => content.texts[key] ?? key;

export const pageDefaultsForSeed = () => PAGE_DEFAULTS;
