var mapimg,
  clat = 0,
  clon = 0,
  lat = 0,
  lon = 0,
  zoom = 1,
  earthquakes,
  ww,
  hh,
  slider,
  margin = 25,
  daysslider,
  magtext = 0,
  datastring =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv",
  a = 0,
  sortedquakes = [],
  sortedmag = [],
  dpre = 0,
  currentd = 0;

//48.8566° N, 2.3522° E
//lat = 48.8566;
//lon = 2.3522;

function preload() {
  mapimg = loadImage(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0," +
      zoom +
      ",0,0/" +
      1280 +
      "x" +
      (windowHeight - margin) +
      "?access_token=pk.eyJ1Ijoic2phaW4xNCIsImEiOiJja3N1M3pvbWcxYzhrMzJvZDN3YzkweGcwIn0._rl3XMY0Wu7x7obOZPPUhg"
  );

  earthquakes = loadStrings(datastring);
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);

  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function show(quakes, mags, days) {
  //earthquakes = loadStrings(datastring);

  imageMode(CENTER);
  image(mapimg, 0, 0);

  var cx = mercX(clon);
  var cy = mercY(clat);

  for (var i = 0; i < quakes.length; i++) {
    var data = quakes[i].split(/,/);
    var lat = data[1];
    var lon = data[2];
    var mag = data[4];

    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;

    mag = pow(10, mag);
    mag = sqrt(mag);
    //make change in last variable of map to change the size of ellipse
    var d = map(mag, 0, sqrt(pow(10, 10)), 0, 400);
    stroke(255, 0, 185);
    fill(255, 0, 185, 200);
    ellipse(x, y, d, d);
    //ellipse(x, y, 18, 18);

    //print(a);
    //a = +1;
  }
  noStroke();
  fill(25, 26, 26);
  rect(-(width / 2), height / 2 - 35, 180, 35);
  textSize(18);

  //text("Sahaj", 0,0 );

  fill(100);
  text("Mag :", -(width / 2) + 5, height / 2 - 5);
  fill(255, 0, 185, 200);
  text("" + mags + "+", -(width / 2) + 5 + 51, height / 2 - 5);

  fill(100);
  text("Past ", -(width / 2) + 5 + 110, height / 2 - 5);
  fill(255, 0, 185, 200);
  text("" + days, -(width / 2) + 95 + 60, height / 2 - 5);
  fill(100);
  text("Days ", -(width / 2) + 5 + 90 + 83, height / 2 - 5);

  fill(100);
  text("Count : ", -(width / 2) + 120 + 130, height / 2 - 5);
  fill(255, 0, 185, 200);
  text(" " + quakes.length, -(width / 2) + 210 + 99, height / 2 - 5);
}

function setup() {
  //createCanvas(1024, 512);

  // if (windowWidth > 1024 ) {
  ww = 1024;
  // } else {
  //   ww = 1024 ;
  // }
  // if (windowHeight > 512) {
  hh = windowHeight - margin;
  // } else {
  //   hh = 512;
  // }

  createCanvas(ww, hh);
  background(25, 26, 26);
  translate(width / 2, height / 2);

  //noprotect

  show(earthquakes, 0, 30);
  sortedmag = earthquakes;

  //slider = createSlider(0.0,12,0,0.25);
  slider = createInput("0");
  //whenever the slider is changed, do this:
  slider.input(magsliderChange);
  slider.position(6, windowHeight-margin+3);
  slider.size(30);

  //daysslider = createSlider(0.0,30,30,1);
  daysslider = createInput("30");
  daysslider.input(magsliderChange);
  daysslider.position(115, windowHeight-margin+3);
  daysslider.size(30);
}

function magsliderChange() {
  //slider.value(float(input1.value()))

  var sortedmagvalue = float(slider.value());
  sortedmag = [];

  for (var i = 0; i < earthquakes.length; i++) {
    var data = earthquakes[i].split(/,/);
    var mag = data[4];

    if (mag >= sortedmagvalue) {
      append(sortedmag, earthquakes[i]);
    }
  }
  //print(sortedmag.length)
  daysliderChange(sortedmagvalue);
}

//functions for data display to to get sorted quakes

function daysliderChange(sortedmagvalue) {
  currentd = 0;
  dpre = 0;
  sortedquakes = [];
  var marker = 0; // will go till number of days of data
  var r = 0;
  var daysofdata = int(daysslider.value());

  //finding currentd and dpre for sortedquakes
  for (var i = 1; i < sortedmag.length; i++) {
    var data = sortedmag[i].split(/,/);
    var date = data[0].split("T");
    var day = date[0].split("-");

    if (currentd == 0) {
      currentd = parseInt(day[2]);
      r = currentd;
    } else {
      if (dpre == 0) {
        if (parseInt(day[2]) == r) {
          continue;
        } else {
          if (marker == daysofdata + 1) {
            dpre = parseInt(day[2]);
          } else {
            marker += 1;
            r = parseInt(day[2]);
          }
        }
      } else {
        if (dpre != 0) {
          break;
        } else {
          continue;
        }
      }
    }
  }
  //finding sortedquakes
  for (var j = 1; j < sortedmag.length; j++) {
    var dta = sortedmag[j].split(/,/);
    var dte = dta[0].split("T");
    var dy = dte[0].split("-");

    if (parseInt(dy[2]) != dpre) {
      append(sortedquakes, sortedmag[j]);
    } else {
      break;
    }
  }
  //print(currentd, dpre);
  //print(sortedquakes.length);
  show(sortedquakes, sortedmagvalue, daysofdata);
}

// function datapast30days() {
//   show(sortedmag);
// }
