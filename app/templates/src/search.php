<?php get_header(); ?>

<div class="wrapper">
  <section id="search-results" class="row">
    <main class="span8" role="main">
        
      <?php if ( have_posts() ) : ?>

        <?php if ( is_home() && ! is_front_page() ) : ?>
          <header class="article-header">
            <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
          </header>
        <?php endif; ?>

      
        <?php
        // Start the loop.
        while ( have_posts() ) : the_post(); 

          /*
           * Maybe add Post-Format-specific templates for the content later -FP.
           * If you want to override this in a child theme, then include a file
           * called content-___.php (where ___ is the Post Format name) and that will be used instead.
           */
        ?>
        <article id="content">
          <header class="article-header">
                <h2 class="page-title screen-reader-text"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h2>
          </header>

        <?php the_excerpt(); ?>
        </article>
        
        <?php // End the loop.
        endwhile;

        // Previous/next page navigation.
        the_posts_pagination( array(
          'prev_text'          => __( 'Previous page', 'twentyfifteen' ),
          'next_text'          => __( 'Next page', 'twentyfifteen' ),
          'before_page_number' => '<span class="meta-nav screen-reader-text">' . __( 'Page', 'twentyfifteen' ) . ' </span>',
        ) );

      // If no content, include the "No posts found" template.
    else : ?>
      <article id="content" class="site-content span8" role="main">
        <p><?php _e( 'Sorry, this page seems to be missing.' ); ?></p>
      </article>
    <?php endif; ?>
        
    </main><!-- / .span8 -->
    <aside class="span3 offset1 last">
      <?php get_sidebar(); ?>
    </aside>
  </section>
</div><!-- #wrapper -->


<?php
get_footer();