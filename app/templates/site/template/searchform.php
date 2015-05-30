<form class="search" action="<?php echo get_bloginfo('url'); ?>" method="get" >
    <fieldset>
        <input type="text" name="s" id="search" value="<?php the_search_query(); ?>" placeholder="Search"/>
    </fieldset>
</form>