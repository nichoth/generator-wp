<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme and one
 * of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query,
 * e.g., it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 */

get_header(); ?>

<img class="main-img" src="<?php the_field('main_image'); ?>" alt="" />

<div id="scroll-arrow" class="arrow-container">
  <a href="#main-content" class="arrow-down"></a>
</div>

<!-- // scroll down thing -->
<script>
$(function() {
  $('#scroll-arrow').click(function(ev) {
    ev.preventDefault();
    var target = $( ev.target.getAttribute('href') );
    $('html, body').stop().animate({
      scrollTop: target.offset().top
    }, 500);
  });
});
</script>


<div class="wrapper">

  <div id="main-content" class="row-uniform">
      <article id="content" class="site-content span8 offset2" role="main">

        <?php  while (have_posts()) : the_post('post'); ?>

            <?php the_content(); ?>

        <?php endwhile; ?>

      </article><!-- #content -->
  </div><!-- #main-content -->

</div><!-- /.wrapper -->

<?php

$image = get_field('full_image');
$caption = $image['caption'];

  if( !empty($image) ): ?>
  <div id="wrapper-full">

        <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />
        <p class="flex-caption row"><?php echo $caption; ?></p>

  </div><!-- /#full-image -->
<?php endif; ?>


<?php

  $moreContent = get_field('additional_content');

  if( get_field('additional_content') ): ?>
    <div class="wrapper">
      <div id="main-content" class="row-uniform">
        <article id="content" class="site-content span12" role="main">

        <?php echo $moreContent; ?>

        </article><!-- #content -->
      </div><!-- /.main-content -->
    </div><!-- /.wrapper -->

<?php endif; ?>
