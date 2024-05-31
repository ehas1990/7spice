$(function () {

    // ------------ team images width same height -----------
    // var images = $(".tc-team-style1 .team-card .img, .img_sm_h");
    // images.each(function () {
    //   var width = $(this).width();
    //   $(this).height(width);
    // });

});

$(document).ready(function () {

    function initSwiper(selector, settings) {
        return new Swiper(selector, settings);
    }

    // Common Swiper settings
    const commonSettings = {
        spaceBetween: 24,
        speed: 1000,
        pagination: {
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: true,
    };

    // ------------ tc-header-slider1 -----------
    initSwiper('.tc-header-st2 .header-slider', {
        ...commonSettings,
        slidesPerView: 1,
        speed: 1500,
        centeredSlides: true,
        parallax: true,
        pagination: {
            el: '.tc-header-st2 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-header-st2 .swiper-button-next',
            prevEl: '.tc-header-st2 .swiper-button-prev',
        },
        autoplay: {
            delay: 6000,
        },
        loop: false,
        on: {
            init: function () {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    $(swiper.slides[i]).attr({
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
    initSwiper('.tc-services-st2 .services-slider', {
        ...commonSettings,
        slidesPerView: 5,
        breakpoints: {
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            787: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
            1200: { slidesPerView: 4 }
        },
        pagination: {
            el: '.tc-services-st2 .swiper-pagination',
        },
        navigation: {
            nextEl: '.tc-services-st2 .swiper-next',
            prevEl: '.tc-services-st2 .swiper-prev',
        },
    });

    // ------------ tc-testimonials-slider -----------
    initSwiper('.tc-testimonials-st2 .testimonials-slider', {
        ...commonSettings,
        slidesPerView: 1,
        pagination: {
            el: '.tc-testimonials-st2 .swiper-pagination',
        },
        navigation: {
            nextEl: '.tc-testimonials-st2 .swiper-button-next',
            prevEl: '.tc-testimonials-st2 .swiper-button-prev',
        },
    });

    // ------------ blog slider -----------
    initSwiper('.tc-blog-st2 .posts-slider', {
        ...commonSettings,
        slidesPerView: 5,
        breakpoints: {
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            787: { slidesPerView: 3 },
            991: { slidesPerView: 3 },
            1200: { slidesPerView: 3 }
        },
        pagination: {
            el: '.tc-blog-st2 .swiper-pagination',
        },
        navigation: {
            nextEl: '.tc-blog-st2 .swiper-next',
            prevEl: '.tc-blog-st2 .swiper-prev',
        },
    });

});
