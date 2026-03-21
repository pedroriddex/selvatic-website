<?php

$elements = [
	[
		'id'       => 'sec001',
		'name'     => 'section',
		'settings' => [
			'_background' => [
				'color' => [
					'hex' => '#11352b',
				],
			],
			'_padding'    => [
				'top'    => '40',
				'right'  => '20',
				'bottom' => '40',
				'left'   => '20',
			],
		],
		'children' => [ 'con001' ],
	],
	[
		'id'       => 'con001',
		'name'     => 'container',
		'parent'   => 'sec001',
		'settings' => [
			'_direction'  => 'column',
			'_alignItems' => 'flex-start',
			'_gap'        => '16',
		],
		'children' => [ 'head001', 'txt001' ],
	],
	[
		'id'       => 'head001',
		'name'     => 'heading',
		'parent'   => 'con001',
		'settings' => [
			'text'       => 'Hello Bricks',
			'tag'        => 'h1',
			'typography' => [
				'font-size' => '48',
				'color'     => [
					'hex' => '#e3f67a',
				],
			],
		],
	],
	[
		'id'       => 'txt001',
		'name'     => 'text-basic',
		'parent'   => 'con001',
		'settings' => [
			'text'       => '<p>Visual test content</p>',
			'typography' => [
				'color' => [
					'hex' => '#e7efe6',
				],
			],
		],
	],
];

update_post_meta( 2, '_bricks_page_content_2', $elements );
update_post_meta( 2, '_bricks_editor_mode', 'bricks' );

var_export( get_post_meta( 2, '_bricks_page_content_2', true ) );
