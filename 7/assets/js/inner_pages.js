$(function () {
    // Projects change background
    $('.tc-bg-services-st6 .service-card').on('mouseenter click', function () {
        var tab_id = $(this).attr('data-tab');
        $('.tc-bg-services-st6 .service-card').removeClass('current');
        $(this).addClass('current');

        $('.glry-img .tab-img').removeClass('current');
        $("#" + tab_id).addClass('current');

        if ($(this).hasClass('current')) {
            return false;
        }
    });
});

$(document).ready(function () {
    function initSwiper(container, config) {
        return new Swiper(container, config);
    }

    var defaultConfig = {
        spaceBetween: 24,
        speed: 1000,
        pagination: {
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
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
    };

    var sliders = [
        { container: '.tc-services-st5 .services-slider', config: $.extend(true, {}, defaultConfig, { slidesPerView: 4, spaceBetween: 60, pagination: { el: '.tc-services-st5 .swiper-pagination' } }) },
        { container: '.tc-testimonials-st5 .testimonials-slider', config: $.extend(true, {}, defaultConfig, { slidesPerView: 1, spaceBetween: 24, speed: 1000, pagination: { el: '.tc-testimonials-st5 .swiper-pagination' }, navigation: { nextEl: '.tc-testimonials-st5 .swiper-button-next', prevEl: '.tc-testimonials-st5 .swiper-button-prev' } }) },
        { container: '.tc-services-st6 .services-slider', config: $.extend(true, {}, defaultConfig, { slidesPerView: 5 }) },
        { container: '.tc-testimonials-st6 .testimonials-slider', config: $.extend(true, {}, defaultConfig, { spaceBetween: 30, speed: 1500, pagination: { el: '.tc-testimonials-st6 .swiper-pagination' }, breakpoints: { 787: { slidesPerView: 2 }, 991: { slidesPerView: 3 }, 1200: { slidesPerView: 3 } } }) }
    ];

    sliders.forEach(function(slider) {
        initSwiper(slider.container, slider.config);
    });
});
