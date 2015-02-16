$(document).ready(function() {
  // enable/disable the form elements based on the checkbox state
  $(".js-checkbox").change(function() {
    var state = $(this).is(":checked");
    if (state) {
      $(".js-select").prop("disabled", state);
    } else {
      $(".js-select").prop("disabled", state);
    }
  });

  // replace date on search page to be human readable
  $(".js-date").each(function() {
    $(this).text(moment($(this).attr("data-date")).format("MMM DD"));
  });
});
