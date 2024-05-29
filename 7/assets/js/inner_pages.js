$(function () {

    // ------------ team images width same height -----------
    // var images = $(".tc-team-style1 .team-card .img, .img_sm_h");
    // images.each(function () {
    //   var width = $(this).width();
    //   $(this).height(width);
    // });

    // projects change background 
    $('.tc-bg-services-st6 .service-card').on('mouseenter click', function () {
        var tab_id = $(this).attr('data-tab');
        $('.tc-bg-services-st6 .service-card').removeClass('current');
        $(this).addClass('current');

        $('.glry-img .tab-img ').removeClass('current');
        $("#" + tab_id).addClass('current');

        if ($(this).hasClass('current')) {
            return false;
        }
    });


});


// ------------ swiper sliders -----------
$(document).ready(function () {
    

    // ------------ tc-header-slider1 -----------
    var swiper = new Swiper('.tc-services-st5 .services-slider', {
        slidesPerView: 4,
        spaceBetween: 60,
        // centeredSlides: true,
        speed: 1500,
        pagination: {
            el: '.tc-services-st5 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-services-st5 .swiper-next',
            prevEl: '.tc-services-st5 .swiper-prev',
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
    var swiper = new Swiper('.tc-testimonials-st5 .testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 24,
        // centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-testimonials-st5 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-testimonials-st5 .swiper-button-next',
            prevEl: '.tc-testimonials-st5 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: true,
    });


    // ------------ services slider -----------
    var swiper = new Swiper('.tc-services-st6 .services-slider', {
        slidesPerView: 5,
        spaceBetween: 24,
        // centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-services-st6 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-services-st6 .swiper-next',
            prevEl: '.tc-services-st6 .swiper-prev',
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


    // ------------ services slider -----------
    var swiper = new Swiper('.tc-testimonials-st6 .testimonials-slider', {
        // slidesPerView: 5,
        spaceBetween: 30,
        // centeredSlides: true,
        speed: 1500,
        pagination: {
            el: '.tc-testimonials-st6 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-testimonials-st6 .swiper-next',
            prevEl: '.tc-testimonials-st6 .swiper-prev',
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
                slidesPerView: 2,
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



// ------------ gsap scripts -----------
$(function () {

    

});
