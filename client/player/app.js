$(function() {

  var renderAudio = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('player');

    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    // Bind our analyser to the media element source.
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var frequencyData = new Uint8Array(100);

    var svgHeight = '100';
    var svgWidth = '675';
    var barPadding = '1';

    function createSvg(parent, height, width) {
      return d3.select(parent).append('svg').attr('height', height).attr('width', width);
    }

    var svg = createSvg('#visualizer', svgHeight, svgWidth);

    // Create our initial D3 chart.
    svg.selectAll('rect')
      .data(frequencyData)
      .enter()
      .append('rect')
      .attr('x', function(d, i) {
        return i * (svgWidth / frequencyData.length);
      })
      .attr('width', svgWidth / frequencyData.length - barPadding);

    // Continuously loop and update chart with frequency data.
    renderChart = function() {
      requestAnimationFrame(renderChart);

      // Copy frequency data to frequencyData array.
      analyser.getByteFrequencyData(frequencyData);

      // Update d3 chart with new data.
      svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
          return svgHeight - (d / 255 * 100);
        })
        .attr('height', function(d) {
          return d / 255 * 100;
        })
        .attr('fill', function(d) {
          return '#00CCFF';
        });
    }

    renderChart(); 
  }


  renderAudio();
});
