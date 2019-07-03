// Unit 15 Assigment - Belly Button Biodiversity
// @PLOTLY.JS AND HEROKU
// @version 1.0
// @author Martha Meses 

function buildMetadata(sample){
  // @TODO: Complete the following function that builds the metadata panel
  // Use d3 to select the panel with id of `#sample-metadata`
  var sampleMeta = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  sampleMeta.html("");
  // // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then((data) => {  
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
    tableSM = sampleMeta.append("table");
    Object.entries(data).forEach(([key, value]) => {  
      rowSM = tableSM.append("tr");
        rowSM.append("p").html(`${key}: <strong>${value}</strong `);
    });
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);  
  });
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((data) => {
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).  
    var trace1={
        labels:data.otu_ids.slice(1,10),
        values:data.sample_values.slice(1,10),
        hovertext:data.otu_labels.slice(1,10), 
        type:'pie'
      };
    var data2=[trace1];
    var layout = {
        // title:'PIE',
        height: 400,
        width: 400
      };
    Plotly.newPlot('pie',data2,layout);
  });

  d3.json("/samples/" + sample).then((data) => {
  // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
        x:data.otu_ids,
        y:data.sample_values,
        text:data.otu_labels,
        mode: 'markers',
        marker: {
          color: data.otu_ids,
          size: data.sample_values
        }
      };
      
    var data3 = [trace1];
    var layout = {
        xaxis: { 
          title: "<b>OTU ID</b>"
        },
        showlegend: false,
        height: 600,
        width: 1400
      };
      
    Plotly.newPlot('bubble', data3, layout);
  });
}

function buildGauge(value){
//   // BONUS: Build the Gauge Chart
//   buildGauge(data.WFREQ);
//   //GAUGE//
  // Enter a speed between 0 and 180
  var level = value;
  // Trig to calc meter point
  var degrees = 9 - level,
      radius = .5;
  var radians = degrees * Math.PI / 9;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);
  var data = [{ type: 'scatter',
    x: [0], y:[0],
      marker: {size: 28, color:'black'},
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,  50/9,  50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['red','red','orange','lightorange','lightorange','yellow','yellow','greenyellow','green','rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
    hoverinfo: 'label',
    hole: .3,
    type: 'pie',
    showlegend: false
  }];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'black',
      line: {
        color: 'black'
      }
  }],
  title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
  height: 600,
  width: 600,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
//gauge//
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
