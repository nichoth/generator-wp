<?php

add_filter('show_admin_bar', '__return_false');

// Enqueue Scripts
function slowclouds_scripts()
{

	// Register the script like this for a theme:
	// wp_register_script( $handle, $src, $deps, $ver, $in_footer );
	wp_register_script( 'flexslider-script', get_template_directory_uri() . '/js/jquery.flexslider-min.js', array( 'jquery' ), null, true );

	// For either a plugin or a theme, you can then enqueue the script:
	wp_enqueue_script( 'flexslider-script' );
}

add_action( 'wp_enqueue_scripts', 'slowclouds_scripts' );

// Add Featured Image Support
add_theme_support( 'post-thumbnails' );

// Add Sidebar
if ( function_exists('register_sidebar') )
	register_sidebar(array(
		'before_widget' => '<div class="widget">',
		'after_widget' => '</div>',
		'before_title' => '<h3>',
		'after_title' => '</h3>',
	));


/* UNDECIDED Stop WordPress from adding those annoying paragraph tags -- FP */
/*  remove_filter( 'the_content', 'wpautop' );
	remove_filter( 'the_excerpt', 'wpautop' ); */


// Add custom class to previous/next post links -- FP
function add_class_next_post_link($html){
    $html = str_replace('<a','<a class="next button"',$html);
    return $html;
}

add_filter('next_post_link','add_class_next_post_link',10,1);

function add_class_previous_post_link($html){
    $html = str_replace('<a','<a class="prev button"',$html);
    return $html;
}

add_filter('previous_post_link','add_class_previous_post_link',10,1);


// Add custom post type function
/*
* Creating a function to create our CPT
*/

function custom_post_type() {

// Set UI labels for Custom Post Type
	$labels = array(
		'name'                => _x( 'Portfolio', 'Post Type General Name', '1206-wp' ),
		'singular_name'       => _x( 'Portfolio Project', 'Post Type Singular Name', '1206-wp' ),
		'menu_name'           => __( 'Portfolio', '1206-wp' ),
		'parent_item_colon'   => __( 'Parent Project', '1206-wp' ),
		'all_items'           => __( 'All Projects', '1206-wp' ),
		'view_item'           => __( 'View Projects', '1206-wp' ),
		'add_new_item'        => __( 'Add New Project', '1206-wp' ),
		'add_new'             => __( 'Add New Project', '1206-wp' ),
		'edit_item'           => __( 'Edit Project', '1206-wp' ),
		'update_item'         => __( 'Update Project', '1206-wp' ),
		'search_items'        => __( 'Search Project', '1206-wp' ),
		'not_found'           => __( 'Not Found', '1206-wp' ),
		'not_found_in_trash'  => __( 'Not found in Trash', '1206-wp' ),
	);

// Set other options for Custom Post Type

	$args = array(
		'label'               => __( 'projects', '1206-wp' ),
		'description'         => __( 'Project news and reviews', '1206-wp' ),
		'labels'              => $labels,
		// Features this CPT supports in Post Editor
		'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields' ),
		// You can associate this CPT with a taxonomy or custom taxonomy.
		'taxonomies'          => array( 'genres' ),
		/* A hierarchical CPT is like Pages and can have
		* Parent and child items. A non-hierarchical CPT
		* is like Posts.
		*/
		'hierarchical'        => false,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_nav_menus'   => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 5,
		'can_export'          => true,
		'has_archive'         => true,
		'exclude_from_search' => false,
		'publicly_queryable'  => true,
		'capability_type'     => 'page'

	);

	// Registering your Custom Post Type
	register_post_type( 'Portfolio', $args );

}

/* Hook into the 'init' action so that the function
* Containing our post type registration is not
* unnecessarily executed.
*/

add_action( 'init', 'custom_post_type', 0 );




