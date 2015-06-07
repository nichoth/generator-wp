var $ = window.$;
<% if (npmDeps.indexOf('flexslider') > -1) { %>require('flexslider');<% } %>
$(window).load(function() {
<% if (npmDeps.indexOf('flexslider') > -1) { %>
  $('.flexslider').flexslider();
<% } %>
});
