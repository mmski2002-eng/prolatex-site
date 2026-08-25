<?php
/**
 * Разовый импорт статических статей блога в CPT article.
 * Запуск: wp eval-file import-articles.php  (JSON рядом: /root/articles-export.json)
 * Идемпотентно по slug. Порядок сохраняется убывающим временем публикации.
 */

$json = file_get_contents( dirname( __FILE__ ) . '/articles-export.json' );
$items = json_decode( $json, true );
if ( ! is_array( $items ) ) {
	WP_CLI::error( 'Не удалось прочитать articles-export.json' );
}

// Базовое время — «сейчас минус минута», чтобы посты были опубликованы (не future).
// Убывание на index*60 сохраняет заданный порядок листинга.
$base = current_time( 'timestamp' ) - 60;

foreach ( $items as $i => $it ) {
	$slug     = $it['slug'];
	$existing = get_posts(
		array(
			'post_type'      => 'article',
			'name'           => $slug,
			'post_status'    => array( 'publish', 'future', 'draft', 'pending', 'private' ),
			'posts_per_page' => 1,
		)
	);

	$date = date( 'Y-m-d H:i:s', $base - $i * 60 );
	$arr  = array(
		'post_type'     => 'article',
		'post_status'   => 'publish',
		'post_title'    => $it['title'],
		'post_name'     => $slug,
		'post_content'  => $it['html'],
		'post_excerpt'  => $it['excerpt'],
		'post_date'     => $date,
		'post_date_gmt' => get_gmt_from_date( $date ),
	);
	if ( $existing ) {
		$arr['ID'] = $existing[0]->ID;
	}

	$id = wp_insert_post( $arr, true );
	if ( is_wp_error( $id ) ) {
		WP_CLI::warning( $slug . ': ' . $id->get_error_message() );
		continue;
	}
	wp_set_object_terms( $id, array( $it['tag'] ), 'article_tag', false );
	update_post_meta( $id, 'article_lead', $it['lead'] );
	WP_CLI::log( ( $existing ? 'updated ' : 'created ' ) . $slug . ' #' . $id );
}

WP_CLI::success( 'Импортировано статей: ' . count( $items ) );
