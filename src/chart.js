// draws a rectangle with a rounded top
Chart.helpers.drawRoundedTopRectangle = function (ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  // top right corner
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  // bottom right	corner
  ctx.lineTo(x + width, y + height);
  // bottom left corner
  ctx.lineTo(x, y + height);
  // top left
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
  draw: function () {
    var ctx = this._chart.ctx;
    var vm = this._view;
    var left, right, top, bottom, signX, signY, borderSkipped;
    var borderWidth = vm.borderWidth;

    if (!vm.horizontal) {
      // bar
      left = vm.x - vm.width / 2;
      right = vm.x + vm.width / 2;
      top = vm.y;
      bottom = vm.base;
      signX = 1;
      signY = bottom > top ? 1 : -1;
      borderSkipped = vm.borderSkipped || 'bottom';
    } else {
      // horizontal bar
      left = vm.base;
      right = vm.x;
      top = vm.y - vm.height / 2;
      bottom = vm.y + vm.height / 2;
      signX = right > left ? 1 : -1;
      signY = 1;
      borderSkipped = vm.borderSkipped || 'left';
    }

    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderWidth) {
      // borderWidth shold be less than bar width and bar height.
      var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
      borderWidth = borderWidth > barSize ? barSize : borderWidth;
      var halfStroke = borderWidth / 2;
      // Adjust borderWidth when bar top position is near vm.base(zero).
      var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
      var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
      var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
      var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
      // not become a vertical line?
      if (borderLeft !== borderRight) {
        top = borderTop;
        bottom = borderBottom;
      }
      // not become a horizontal line?
      if (borderTop !== borderBottom) {
        left = borderLeft;
        right = borderRight;
      }
    }

    // calculate the bar width and roundess
    var barWidth = Math.abs(left - right);
    var roundness = this._chart.config.options.barRoundness || 0.5;
    var radius = barWidth * roundness * 0.5;

    // keep track of the original top of the bar
    var prevTop = top;

    // move the top down so there is room to draw the rounded top
    top = prevTop + radius;
    var barRadius = top - prevTop;

    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;

    // draw the rounded top rectangle
    Chart.helpers.drawRoundedTopRectangle(
      ctx,
      left,
      top - barRadius + 1,
      barWidth,
      bottom - prevTop,
      barRadius,
    );

    ctx.fill();
    if (borderWidth) {
      ctx.stroke();
    }

    // restore the original top value so tooltips and scales still work
    top = prevTop;
  },
});

Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);

Chart.controllers.roundedBar = Chart.controllers.bar.extend({
  dataElementType: Chart.elements.RoundedTopRectangle,
});

var ctx = document.getElementById('canvas').getContext('2d');
var myBar = new Chart(ctx, {
  type: 'roundedBar',
  data: {
    labels: [
      '8:00',
      ' ',
      '9:00',
      '',
      '10:00',
      '',
      '11:00',
      ' ',
      '12:00',
      '',
      '13:00',
      '',
      '14:00',
      ' ',
      '15:00',
      '',
      '16:00',
      '',
      '17:00',
      ' ',
      '18:00',
      '',
      '19:00',
      '',
      '20:00',
      ' ',
      '21:00',
      '',
      '22:00',
    ],
    datasets: [
      {
        label: {
          display: false,
        },
        data: [
          25, 41, 41, 36, 12, 22, 36, 66, 61, 51, 39, 37, 34, 20, 26, 39, 34, 58, 45, 54, 54, 39,
          39, 32, 48, 38, 32, 25, 17,
        ],
        backgroundColor: [
          'rgba(255, 197, 155, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(255, 197, 155, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(230,78,33, 1)',
          'rgba(230,78,33, 1)',
          'rgba(230,78,33, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(255, 197, 155, 1)',
          'rgba(255, 197, 155, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(230,78,33, 1)',
          'rgba(230,78,33, 1)',
          'rgba(230,78,33, 1)',
          'rgba(230,78,33, 1)',
          'rgba(248,140,108, 1)',
          'rgba(248,140,108, 1)',
          'rgba(255, 197, 155, 1)',
          'rgba(230,78,33, 1)',
          'rgba(248,140,108, 1)',
          'rgba(255, 197, 155, 1)',
          'rgba(255, 197, 155, 1)',
          'rgba(255, 197, 155, 1)',
        ],

        borderWidth: 1,
      },
    ],
  },
  options: {
    tooltips: {
      enabled: false,
    },
    //title: {
        //    display: true,
          //  text: 'Návštěvnost firmy',
          //   fontSize: 21,
             //position:bottom,

             
             

       // },
    responsive: true,
    barRoundness: 1,
    scales: {
      xAxes: [
        {
          ticks: {
            stepSize: 15,
            fontSize: 12,
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
          },
          barPercentage: 0.7,
          categoryPercentage: 1.5,
          gridLines: {
            drawOnChartArea: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 150,
            stepSize: 1,
          },
          display: false,
          gridLines: {
            drawOnChartArea: false,
          },
        },
      ],
    },

    legend: {
      display: false,
    },
  },
});
