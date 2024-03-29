// Create function to initialize the dashboard
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // Create a variable that holds the samples array. 
    var samplesData = data.samples;
    console.log(samplesData);
    
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    
    //  Create a variable that holds the first sample in the array.
    var sampleResult = samplesArray[0];
    console.log(sampleResult);
    
     // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleResult.otu_ids;
    console.log(otuIds);
    var otuLabels = sampleResult.otu_labels;
    console.log(otuLabels);
    var sampleValues = sampleResult.sample_values.slice(0,10).reverse();
    console.log(sampleValues);
    
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    // Variable for washing frequency
    var washFreq = parseFloat(metadata.wfreq);
    console.log(washFreq);

    // Create the yticks for the bar chart. 
    /*Hint: Get the the top 10 otu_ids and map them in descending order  
     so the otu_ids with the most bacteria are last.
     **/
    var yticks = otuIds.slice(0, 10).map(otuId => `Otu ${otuId}`).sort().reverse()
    console.log(yticks);
     
    // Create the trace for the bar chart. 
    var trace1 = {
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels,
      marker: {
        color: "blue"
      }
    };

    // Data array for plot
    var barData = [trace1];
    
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacterial Cultures Found",     
    };

    // Make plot size responsive to size of page windows
    var config = {
      responsive: true
    };


    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, config);
  

    // Create the trace for the bubble chart.
    var trace2 = {
      x: otuIds,
      y: sampleValues,
      type: "bubble",
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Jet"
      }
    };

    var bubbleData = [trace2];
   

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      hovermode: "closest",
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config);




    // Create the trace for the gauge chart.
    var trace3 = {
      domain: {x: [0, 1], y: [0, 1]},
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week"}, font: {size: 20},
      gauge: {
        axis: {range: [null, 10] },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    };
    
    var gaugeData = [trace3];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 425,
      margin: { t: 0, b: 0}
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
}
init();