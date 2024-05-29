$(function () {

    // ------------ team images width same height -----------
    // var images = $(".tc-team-style1 .team-card .img, .img_sm_h");
    // images.each(function () {
    //   var width = $(this).width();
    //   $(this).height(width);
    // });


});


// ------------ swiper sliders -----------
$(document).ready(function () {


    // ------------ tc-header-slider1 -----------
    var swiper = new Swiper('.tc-header-st2 .header-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        // effect: "fade",
        // direction: "vertical",
        centeredSlides: true,
        parallax: true,
        speed: 1500,
        pagination: {
            el: '.tc-header-st2 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-header-st2 .swiper-button-next',
            prevEl: '.tc-header-st2 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 6000,
        },
        loop: false,
        on: {
            init: function () {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    $(swiper.slides[i])
                        // .find(".img")
                        .attr({
                            "data-swiper-parallax": 0.75 * swiper.width,
                        });
                }
            },
            resize: function () {
                this.update();
            },
        },
    });
    

    // ------------ services slider -----------
    var swiper = new Swiper('.tc-services-st2 .services-slider', {
        slidesPerView: 5,
        spaceBetween: 24,
        // centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-services-st2 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-services-st2 .swiper-next',
            prevEl: '.tc-services-st2 .swiper-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    });


    // ------------ tc-header-slider1 -----------
    var swiper = new Swiper('.tc-testimonials-st2 .testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 24,
        // centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-testimonials-st2 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-testimonials-st2 .swiper-button-next',
            prevEl: '.tc-testimonials-st2 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: true,
    });


    // ------------ blog slider -----------
    var swiper = new Swiper('.tc-blog-st2 .posts-slider', {
        slidesPerView: 5,
        spaceBetween: 24,
        // centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-blog-st2 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-blog-st2 .swiper-next',
            prevEl: '.tc-blog-st2 .swiper-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            }
        }
    });

});

