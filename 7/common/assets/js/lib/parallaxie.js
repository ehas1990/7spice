/*! Copyright (c) 2016 THE ULTRASOFT (http://theultrasoft.com)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Project: Parallaxie
 * Version: 0.5
 *
 * Requires: jQuery 1.9+
 */ !function(e){e.fn.parallaxie=function(t){return t=e.extend({speed:.2,repeat:"no-repeat",size:"cover",pos_x:"center",offset:0},t),this.each(function(){var a=e(this),s=a.data("parallaxie");"object"!=typeof s&&(s={}),s=e.extend({},t,s);var n=a.data("image");if(void 0===n){if(!(n=a.css("background-image")))return;var r=s.offset+(a.offset().top-e(window).scrollTop())*(1-s.speed);a.css({"background-image":n,"background-size":s.size,"background-repeat":s.repeat,"background-attachment":"fixed","background-position":s.pos_x+" "+r+"px"}),o(a,s),e(window).scroll(function(){o(a,s)})}}),this};function o(o,t){var a=t.offset+(o.offset().top-e(window).scrollTop())*(1-t.speed);o.data("pos_y",a),o.css("background-position",t.pos_x+" "+a+"px")}}(jQuery);