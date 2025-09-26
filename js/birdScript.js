$(document).ready(function () {
  $(".slide-box").each(function (index) {
    $(this).data('slide', 0);
    updateSlide($(this).attr('id'), 0);
  });
});


$(".next").on("click", function () {
  updateSlide($(this).parent().attr('id'), 1)
});

$(".prev").on("click", function () {
  updateSlide($(this).parent().attr('id'), -1)
});

function updateSlide(selector, amount) {
  let currentSlide = $("#" + selector).data('slide') + amount;

  if (currentSlide >= $("#" + selector + " .slide-content").length) {
    currentSlide = 0
  } if (currentSlide < 0) {
    currentSlide = $("#" + selector + " .slide-content").length - 1
  }

  $("#" + selector).data('slide', currentSlide);

  $("#" + selector + " .slide-content").each(function (index) {
    if (index == currentSlide) {
      $(this).css('display', 'flex');
    } else {
      $(this).css('display', 'none');
    }
  });
}