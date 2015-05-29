<?php get_header(); ?>

<div class="row">
  <div class="span8">
  	<?php if (is_category('Dub Narcotic Studio')) : ?>
		<h1 class="page-header">Dub Narcotic Studio</h1>
		<?php elseif (is_category('Downtown Olympia')) : ?>
		<h1 class="page-header">Downtown Olympia</h1>
		<?php else : ?>
		<p>This is some generic text to describe all other category pages, 
		I could be left blank</p>
	<?php endif; ?>

	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		<h3><a href="<?php the_permalink(); ?>" title="<?php the_title() ?>?"><?php the_title() ?></a></h3>
		<h4><small><?php the_time('l, F jS, Y'); ?></small></h4>
		<div class="comment-count">
				<a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php comments_number( 'leave a comment', '1 comment', '% comments' ); ?>
				</a>
		</div>		
	  	<?php the_excerpt(); ?>

	  	<hr>
		<?php comments_template(); ?>

	<?php endwhile; else: ?>
		<p><?php _e('Sorry, this page does not exist.'); ?></p>
	<?php endif; ?>

  </div><!-- / .span8 -->
  <div class="sidebar span4 last">
	<?php get_sidebar(); ?>  	
  </div><!-- / .span4 -->
</div><!-- / .row -->

<?php get_footer(); ?>