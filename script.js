let data;
let months;
let labels = ["-1°C", "0°C", "1°C"];
let circles = [100, 250, 500];

let currentRow = 1;
let currentMonth = 0;
let previousAnomaly = 0;

function preload() {
  data = loadTable("./giss-data-sept-21-2023.csv", "csv", "header", () => {});
}

function setup() {
  class Utils {
    // Calculate the Width in pixels of a Dom element
    static elementWidth(element) {
      return (
        element.clientWidth -
        parseFloat(
          window
            .getComputedStyle(element, null)
            .getPropertyValue("padding-left")
        ) -
        parseFloat(
          window
            .getComputedStyle(element, null)
            .getPropertyValue("padding-right")
        )
      );
    }

    // Calculate the Height in pixels of a Dom element
    static elementHeight(element) {
      return (
        element.clientHeight -
        parseFloat(
          window.getComputedStyle(element, null).getPropertyValue("padding-top")
        ) -
        parseFloat(
          window
            .getComputedStyle(element, null)
            .getPropertyValue("padding-bottom")
        )
      );
    }
  }

  //   Dynamic Resizing
  function windowResized() {
    resizeCanvas(Utils.elementWidth(p5Div), Utils.elementHeight(p5Div), true);
  }
  let resizeObserver = new ResizeObserver(() => {
    windowResized();
  });
  resizeObserver.observe(climateCanvas);

  //   Create Canvas
  p5Div = document.getElementById("climateCanvas");
  const p5Canvas = createCanvas(
    Utils.elementWidth(p5Div),
    Utils.elementHeight(p5Div)
  );
  p5Canvas.parent(p5Div);

  let tRow = data.getRow(0);
  months = data.columns.slice(1, 13);
}

function draw() {
  clear();
  translate(width / 2, height / 2);

  //   Year
  // let year = data.getRow(currentRow).get("Year");
  // textSize(24);
  // textAlign(CENTER, CENTER);
  // text(year, 0, 0);

  //   Climate Curve
  beginShape();
  noFill();
  stroke(255);
  strokeWeight(3);
  let firstValue = true;

  for (let j = 0; j < currentRow; j++) {
    let tRow = data.getRow(j);

    let totalMonths = months.length;
    if (j == currentRow - 1) {
      totalMonths = currentMonth;
    }

    for (let i = 0; i < totalMonths; i++) {
      let anomaly = tRow.get(months[i]);
      if (anomaly !== "***") {
        anomaly = parseFloat(anomaly);
        let angle = map(i, 0, months.length, 0, TWO_PI) + PI / 2;
        let pr = map(previousAnomaly, 0, 1, circles[1] / 2, circles[2] / 2);
        let r = map(anomaly, 0, 1, circles[1] / 2, circles[2] / 2);
        let x1 = r * cos(angle);
        let y1 = r * sin(angle);
        let x2 = pr * cos(angle - PI / 6);
        let y2 = pr * sin(angle - PI / 6);

        if (!firstValue) {
          let year = data.getRow(currentRow).get("Year");
          let avg = (anomaly + previousAnomaly) * 0.5;
          let cold = color(0, 0, 255);
          let warm = color(255, 0, 0);
          let zero = color(255);
          let lineColor = zero;
          if (avg < 0) {
            lineColor = lerpColor(zero, cold, abs(avg));
          } else {
            lineColor = lerpColor(zero, warm, abs(avg));
          }
          stroke(lineColor);
          line(x1, y1, x2, y2);

          textSize(28);
          strokeWeight(1);
          textAlign(CENTER, CENTER);
          text(year, 0, 0);
        }
        firstValue = false;
        previousAnomaly = anomaly;
      }
    }
  }
  endShape();

  currentMonth = currentMonth + 1;
  if (currentMonth == months.length) {
    currentMonth = 0;
    currentRow = currentRow + 1;
    //   Stops Loop When Animation is Complete
    if (currentRow == data.getRowCount()) {
      noLoop();
    }
  }

  //   Circles and Circle Label Positions
  for (let i = 0; i < labels.length; i++) {
    if (i != 1) {
      stroke(255);
      textSize(20);
      textStyle(NORMAL);
    } else {
      stroke("#019A17");
      textStyle(BOLD);
    }
    strokeWeight(4);
    noFill();
    circle(0, 0, circles[i]);
    if (i != 1) {
      fill(255);
    } else {
      fill(255);
    }
    noStroke();

    text(
      labels[i],
      (circles[i] / 2 + 20) * sin((135 * PI) / 180),
      (circles[i] / 2 + 20) * cos((135 * PI) / 180)
    );
  }

  //   Months Labels
  for (let i = 0; i < months.length; i++) {
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(24);
    let angle = map(i, 0, months.length, 0, TWO_PI) - PI / 2;
    push();
    let x = 264 * cos(angle);
    let y = 264 * sin(angle);
    translate(x, y);
    rotate(angle + PI / 2);
    text(months[i], 0, 0);
    pop();
  }

  frameRate(84);
}

// DATA REFERENCE: GISS Surface Temp: https://data.giss.nasa.gov/gistemp/
