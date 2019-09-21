function uuidv4() {
  return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
function subMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}
function createmsg(style, message) {
  $('#msgdiv').html($('#msgdiv').html() + '<div class="alert alert-' + style + ' alert-dismissible fade show" role="alert">\
  ' + message + '\
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
    <span aria-hidden="true">&times;</span>\
  </button>\
</div>');
}
function is_timeString(str) {
 regexp = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
 return (regexp.test(str))
}
function timeConvert(n) {
  var hours = (n / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var minutes = Math.round(minutes);
  var time = {}
  time.minutes = minutes;
  time.hours = rhours;

  if (time.minutes.toString().length == 1) {
    time.minutes = "0" + time.minutes
  }

  if (time.hours.toString().length == 1) {
    time.hours = "0" + time.hours
  }

  return time;
}

function sanityError(com, name) {
  $('#' + com).addClass("error");
  createmsg("danger", name + " has an invalid or missing value");
  $('#' + com).focusout(function() {
    $('#' + com).removeClass("error");
  });
}
function sanityErrorByClass(com, name) {
  $('.' + com).addClass("error");
  createmsg("danger", name + " has an invalid or missing value");
  $('.' + com).focusout(function() {
    $('.' + com).removeClass("error");
  });
}

function createPin() {

  //Sanity Check
  if ($('#timelineToken').val() == null || $('#timelineToken').val() == "") {
    sanityError("timelineToken", "Timeline Token");
    return;
  }
  if ($('#pinTitle').val() == null || $('#pinTitle').val() == "") {
    sanityError("pinTitle", "Pin Title");
    return;
  }
  if ($('#pinTime').val() == "A") {
    if (is_timeString($('#specific-hour').val() + ":" + $('#specific-minute').val()) == false) {
      sanityErrorByClass("ctime", "Custom time");
      return;
    }
  }



  var pin = {};
  // pin.id = "ws-ifttt-" + uuidv4();
  // pin.id = "123";

  pin.time = $('#pinTime').val();

  if (pin.time == "A") {
    //It's the 'advanced time'

    var offset = new Date().getTimezoneOffset();

    var mins = parseInt($('#specific-minute').val()) + (parseInt($('#specific-hour').val())*60)

    if (offset[0] == "-") {
      mins = mins - parseInt(offset)
    } else {
      mins = mins + parseInt(offset)
    }

    var time = timeConvert(mins);





    pin.clocktime = time.hours + ":" + time.minutes;

  }
  pin.layout = {};
  pin.layout.type = "genericPin";

  if ($('#pinTitle').val() != null && $('#pinTitle').val() != "") {
    pin.layout.title = "&lt;&lt;&lt;" + $('#pinTitle').val() + "&gt;&gt;&gt;";
  } else {
    pin.layout.title = "";
  }

  if ($('#pinBody').val() != null && $('#pinBody').val() != "") {
    pin.layout.body = "&lt;&lt;&lt;" + $('#pinBody').val() + "&gt;&gt;&gt;";
  } else {
    pin.layout.body = "";
  }

  if ($('#pinSubtitle').val() != null && $('#pinSubtitle').val() != "") {
    pin.layout.subtitle = "&lt;&lt;&lt;" + $('#pinSubtitle').val() + "&gt;&gt;&gt;";
  } else {
    pin.layout.subtitle = "";
  }

  // pin.layout.subtitle = "<<<" + $('#pinSubtitle').val() + ">>>";
  pin.layout.tinyIcon = "system://images/" + $('#pinIcon').val();
  pin.token = $('#timelineToken').val();

  token = pin.token;

  $('#resultbody').html(JSON.stringify(pin));

  $('#jsonmodal').modal("show");

}

function setSetting(setting, value) {
  console.log("Setting " + setting + " to " + value);
  localStorage.setItem("SETTING_" + setting, value);
}
function getSetting(setting) {
  return localStorage.getItem("SETTING_" + setting);
}

function start() {
  var savedToken = getSetting("token");
  if (savedToken != null && savedToken != "") {
    $('#timelineToken').val(savedToken);
  }
  $('#timelineToken').focusout(function() {
    setSetting("token",$('#timelineToken').val());
  });

  $( "#pinIcon" ).change(function() {
    $("#IconPreview").prop("src","img/" + $('#pinIcon').val() + ".svg");
  });

  if ($('#pinTime').val() != "A") { $('#advancedTime').hide(); }
  $("#IconPreview").prop("src","img/" + $('#pinIcon').val() + ".svg");

  $("#pinTime").change(function() {
    if ($('#pinTime').val() == "A") {
      $('#advancedTime').show();
    } else {
      $('#advancedTime').hide();
    }
  });
}
