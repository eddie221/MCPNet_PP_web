window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/images/examples";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    // $(".navbar-burger").click(function() {
    //   // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    //   $(".navbar-burger").toggleClass("is-active");
    //   $(".navbar-menu").toggleClass("is-active");

    // });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    // preloadInterpolationImages();

    // $('#interpolation-slider').on('input', function(event) {
    //   setInterpolationImage(this.value);
    // });
    // setInterpolationImage(0);
    // $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})


// Custom JS for explanation section
// function displayImage(imageSrc) {
//     const mainImage = document.getElementById('mainImage');
//     mainImage.src = "static/images/examples/" + imageSrc;
//     const selDiv = document.getElementById(imageSrc.replace(".png", "_img")).parentNode;
//     // console.log(imageSrc.replace(".png", "_img"));
//     selDiv.classList.add("selected");
// }

function setToggleActive(activeBtn, inactiveBtn) {
    activeBtn.classList.add('toggle-btn-active');
    inactiveBtn.classList.remove('toggle-btn-active');
}

function switchExpResult(type) {
    var img = document.getElementById('exp-result-img');
    var btnCnn = document.getElementById('btn-cnn');
    var btnTransformer = document.getElementById('btn-transformer');
    if (type === 'cnn') {
        img.src = 'static/images/paper/More_exp_CNN.png';
        setToggleActive(btnCnn, btnTransformer);
    } else {
        img.src = 'static/images/paper/More_exp_transformer.png';
        setToggleActive(btnTransformer, btnCnn);
    }
}

// Relation between Caption and Visualization chart
(function () {
    var rcvAllData = {
        cnn: {
            beforeImg:   'static/images/ConceptResponse/CNN_before.png',
            afterImg: 'static/images/ConceptResponse/CNN_after.png',
            arrowLabel: 'Turn Fur Grey',
            concepts: [
                { captions: ['Water', 'Blue', 'Aquatic Environment'], original:  -0.02, edited:  0.8 },
                { captions: ['Greenery/Grass/Plants', 'Animals', 'Outdoor/Natural Environment'],               original:  0.08, edited:  0.04 },
                { captions: ['Water', 'Marine Animals', 'Ocean/Aquatic Environment'],      original:  -0.01, edited:  0.3 },
            ],
        },
        transformer: {
            beforeImg:   'static/images/ConceptResponse/Transformer_before.png',
            afterImg: 'static/images/ConceptResponse/Transformer_after.png',
            arrowLabel: 'Turn Fur Grey',
            concepts: [
                { captions: ['Colorful Obejcts(red)', 'Environmental Context', 'Animal Companionship'], original:  0.01, edited:  0.5 },
                { captions: ['Fur Texture', 'Vibrant Colors(pink)', 'Compansionship or Clustering'],               original:  0.55, edited:  0.8 },
                { captions: ['Aquatic Environment', "Dynamic Movement", 'Black and White Coloration'],      original:  0.6, edited:  0.4 },
            ],
        },
    };

    var RCV_MIN = -1, RCV_MAX = 1;
    var RCV_RANGE = RCV_MAX - RCV_MIN;
    var RCV_ZERO_PCT = (-RCV_MIN / RCV_RANGE) * 100;

    function barGeometry(value) {
        var widthPct = Math.abs(value) / RCV_RANGE * 100;
        var leftPct  = value >= 0 ? RCV_ZERO_PCT : RCV_ZERO_PCT - widthPct;
        return { left: leftPct + '%', width: widthPct + '%' };
    }

    function buildRcvChart(backbone) {
        var data = rcvAllData[backbone];
        if (!data) return;

        document.getElementById('rcv-original').src            = data.beforeImg;
        document.getElementById('rcv-edited').src              = data.afterImg;
        document.getElementById('rcv-arrow-label').textContent = data.arrowLabel;

        var chart = document.getElementById('rcv-chart');
        if (!chart) return;
        chart.innerHTML = '';

        data.concepts.forEach(function (concept) {
            var row = document.createElement('div');
            row.className = 'cf-bar-row';

            var labelEl = document.createElement('div');
            labelEl.className = 'cf-bar-label';
            concept.captions.forEach(function (cap, idx) {
                var line = document.createElement('div');
                line.textContent = (idx + 1) + '. ' + cap;
                labelEl.appendChild(line);
            });

            var barWrap = document.createElement('div');
            barWrap.className = 'cf-bar-wrap';

            var zeroLine = document.createElement('div');
            zeroLine.className = 'cf-zero-line';
            zeroLine.style.left = RCV_ZERO_PCT + '%';

            var barOrig = document.createElement('div');
            barOrig.className = 'cf-bar-orig';
            var gOrig = barGeometry(concept.original);
            barOrig.style.left  = gOrig.left;
            barOrig.style.width = gOrig.width;
            barOrig.dataset.type = 'rcv-orig';

            var barEdit = document.createElement('div');
            barEdit.className = 'cf-bar-edit';
            var gEdit = barGeometry(concept.edited);
            barEdit.style.left  = gEdit.left;
            barEdit.style.width = gEdit.width;
            barEdit.dataset.type = 'rcv-edit';

            barWrap.appendChild(barOrig);
            barWrap.appendChild(barEdit);
            barWrap.appendChild(zeroLine);
            row.appendChild(labelEl);
            row.appendChild(barWrap);
            chart.appendChild(row);
        });
    }

    function bindRcvHover() {
        var imgOrig = document.getElementById('rcv-original');
        var imgEdit = document.getElementById('rcv-edited');
        if (!imgOrig || !imgEdit) return;

        function highlight(activeType) {
            document.querySelectorAll('#rcv-chart .cf-bar-orig, #rcv-chart .cf-bar-edit').forEach(function (bar) {
                bar.classList.remove('cf-dimmed', 'cf-highlighted');
                bar.classList.add(bar.dataset.type === activeType ? 'cf-highlighted' : 'cf-dimmed');
            });
        }

        function reset() {
            document.querySelectorAll('#rcv-chart .cf-bar-orig, #rcv-chart .cf-bar-edit').forEach(function (bar) {
                bar.classList.remove('cf-dimmed', 'cf-highlighted');
            });
        }

        imgOrig.addEventListener('mouseover', function () { highlight('rcv-orig'); });
        imgOrig.addEventListener('mouseout',  reset);
        imgEdit.addEventListener('mouseover', function () { highlight('rcv-edit'); });
        imgEdit.addEventListener('mouseout',  reset);
    }

    window.switchRcvBackbone = function (backbone) {
        buildRcvChart(backbone);
        var btnCnn         = document.getElementById('rcv-btn-cnn');
        var btnTransformer = document.getElementById('rcv-btn-transformer');
        setToggleActive(backbone === 'cnn' ? btnCnn : btnTransformer,
                        backbone === 'cnn' ? btnTransformer : btnCnn);
    };

    document.addEventListener('DOMContentLoaded', function () {
        buildRcvChart('cnn');
        bindRcvHover();
    });
})();

// Counterfactual Result chart
(function () {
    var cfAllData = {
        cnn: {
            wrongImg:    'static/images/Counterfact/CNN_Wrong.png',
            correctImg:  'static/images/Counterfact/CNN_Correct.png',
            wrongPred:   'Squirrel',
            correctPred: 'Wolf',
            arrowLabel:  'Turn Fur Light Brown',
            concepts: [
                { captions: ['Fur Texture', 'Brown/Reddish Coloring', 'Natural Environment'],           original:  0.1, edited:  0.45 },
                { captions: ['Foxes', 'Red/Orange Fur', 'Natural Environment'],                  original:  0.45, edited: 0.80 },
                { captions: ['Fur Texture', 'Color (reddish-brown)', 'Animal Features'], original:  0.30, edited: 0.60 },
            ],
        },
        transformer: {
            wrongImg:    'static/images/Counterfact/Transformer_Wrong.png',
            correctImg:  'static/images/Counterfact/Transformer_Correct.png',
            wrongPred:   'Fox',
            correctPred: 'Wolf',
            arrowLabel:  'Turn Fur Grey',
            concepts: [
                { captions: ['Fur/Animal Texture', 'Greenery/Grass', 'Wildlife'],           original:  0.45, edited:  0.85 },
                { captions: ['Water', 'Brown Animals', 'Natural Textures'],                  original:  0.25, edited: -0.40 },
                { captions: ['Animal Skin Texture', 'Color (brown)', 'Large Land Animals'], original:  0.20, edited: -0.20 },
            ],
        },
    };

    // Fixed display range [-1, 1]; zero line sits at 50% of the bar track
    var CF_MIN = -1, CF_MAX = 1;
    var CF_RANGE = CF_MAX - CF_MIN;
    var ZERO_PCT = (-CF_MIN / CF_RANGE) * 100; // 50

    function barGeometry(value) {
        var widthPct = Math.abs(value) / CF_RANGE * 100;
        var leftPct  = value >= 0 ? ZERO_PCT : ZERO_PCT - widthPct;
        return { left: leftPct + '%', width: widthPct + '%' };
    }

    function buildChart(backbone) {
        var data = cfAllData[backbone];
        if (!data) return;

        // Update images, predictions, arrow label
        document.getElementById('cf-original').src            = data.wrongImg;
        document.getElementById('cf-edited').src              = data.correctImg;
        document.getElementById('cf-pred-wrong').textContent  = '\u2717 Prediction: ' + data.wrongPred;
        document.getElementById('cf-pred-correct').textContent = '\u2713 Prediction: ' + data.correctPred;
        document.getElementById('cf-arrow-label').textContent = data.arrowLabel;

        // Rebuild bar chart
        var chart = document.getElementById('cf-chart');
        if (!chart) return;
        chart.innerHTML = '';

        data.concepts.forEach(function (concept) {
            var row = document.createElement('div');
            row.className = 'cf-bar-row';

            var labelEl = document.createElement('div');
            labelEl.className = 'cf-bar-label';
            concept.captions.forEach(function (cap, idx) {
                var line = document.createElement('div');
                line.textContent = (idx + 1) + '. ' + cap;
                labelEl.appendChild(line);
            });

            var barWrap = document.createElement('div');
            barWrap.className = 'cf-bar-wrap';

            var zeroLine = document.createElement('div');
            zeroLine.className = 'cf-zero-line';
            zeroLine.style.left = ZERO_PCT + '%';

            var barOrig = document.createElement('div');
            barOrig.className = 'cf-bar-orig';
            var gOrig = barGeometry(concept.original);
            barOrig.style.left  = gOrig.left;
            barOrig.style.width = gOrig.width;
            barOrig.dataset.type = 'orig';

            var barEdit = document.createElement('div');
            barEdit.className = 'cf-bar-edit';
            var gEdit = barGeometry(concept.edited);
            barEdit.style.left  = gEdit.left;
            barEdit.style.width = gEdit.width;
            barEdit.dataset.type = 'edit';

            barWrap.appendChild(barOrig);
            barWrap.appendChild(barEdit);
            barWrap.appendChild(zeroLine);
            row.appendChild(labelEl);
            row.appendChild(barWrap);
            chart.appendChild(row);
        });
    }

    function bindCfHover() {
        var imgOrig = document.getElementById('cf-original');
        var imgEdit = document.getElementById('cf-edited');
        if (!imgOrig || !imgEdit) return;

        function highlight(activeType) {
            document.querySelectorAll('#cf-chart .cf-bar-orig, #cf-chart .cf-bar-edit').forEach(function (bar) {
                bar.classList.remove('cf-dimmed', 'cf-highlighted');
                bar.classList.add(bar.dataset.type === activeType ? 'cf-highlighted' : 'cf-dimmed');
            });
        }

        function reset() {
            document.querySelectorAll('#cf-chart .cf-bar-orig, #cf-chart .cf-bar-edit').forEach(function (bar) {
                bar.classList.remove('cf-dimmed', 'cf-highlighted');
            });
        }

        imgOrig.addEventListener('mouseover', function () { highlight('orig'); });
        imgOrig.addEventListener('mouseout',  reset);
        imgEdit.addEventListener('mouseover', function () { highlight('edit'); });
        imgEdit.addEventListener('mouseout',  reset);
    }

    window.switchCfBackbone = function (backbone) {
        buildChart(backbone);
        var btnCnn         = document.getElementById('cf-btn-cnn');
        var btnTransformer = document.getElementById('cf-btn-transformer');
        setToggleActive(backbone === 'cnn' ? btnCnn : btnTransformer,
                        backbone === 'cnn' ? btnTransformer : btnCnn);
    };

    document.addEventListener('DOMContentLoaded', function () {
        buildChart('cnn');
        bindCfHover();
    });
})();

