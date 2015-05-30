<?php
$path = get_bloginfo('template_url');
?>

<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<title><?php wp_title(''); ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="<?=$path?>/images/icon-favicon.png" type="image/x-icon">

  <!-- css -->
	<link href="<?=$path?>/style.css" rel="stylesheet" type="text/css" media="all" />

	<!-- Enqued Scripts -->
	<?php wp_head(); ?>

	<!-- JS -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="<?=$path?>/js/jquery.flexslider-min.js"></script>


	</head>

	<body <?php body_class($class); ?>>

		<!-- Navigation Section -->
		<header role="site-header" class="<?=$header_class?>">
			<div class="row">
				<div id="branding" class="span4">
					<a href="<? bloginfo('url'); ?>" class="logo" title="<? bloginfo('title'); ?>"><? bloginfo('title'); ?></a>
				</div>
				<nav role="main-nav" class="span8 last">
					<?php wp_nav_menu( array('menu' => 'main' )); ?>
				</nav>
			</div><!-- /.row -->
		</header>
