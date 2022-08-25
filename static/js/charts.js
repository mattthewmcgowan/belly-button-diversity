function demographic(id) {
  let data = d3.json("data/samples.json").then(data => {
      const metadata = data.metadata;
      let demoPanel = d3.select('#sample-metadata')
      demoPanel.html('');
      let filteredData = metadata.filter(sampleName => sampleName.id == id)[0]
      Object.entries(filteredData).forEach(([key, value]) => {
          demoPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}

function optionChanged(userChoice) {
  demographic(userChoice)
  BuildCharts(userChoice)
}




function BuildCharts(sampleId) {
  let data = d3.json("data/samples.json").then(data => {
      const samples = data.samples;
      const metadata = data.metadata;

      //samples_values
      let filteredSample = samples.filter(sampleName => sampleName.id == sampleId)[0] // Arrow function to extract the data
      let filteredMetaSample = metadata.filter(sampleName => sampleName.id == sampleId)[0]
      let otu_ids = filteredSample.otu_ids
      let otu_labels = filteredSample.otu_labels
      let samples_values = filteredSample.sample_values
      let wfreq = parseInt(filteredMetaSample.wfreq)

      console.log(otu_ids)
      console.log(otu_labels)
      console.log(samples_values)
      console.log(wfreq)

      function unpack(rows, index) {
          return rows.map(function (row) {
              return row[index];
          });
      }
            
      function updatePlotly(newdata) {
        let layout = { 
          paper_bgcolor: "lavender",
        };
          Plotly.restyle("pie", "values", [newdata], "layout");
      }
      // Horizontal Chart
      function horizontalChart(dataID) {
          let yticksBar = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
          let data = [
              {   
                  y: yticksBar,//otu_ids top10
                  x: samples_values.slice(0,10).reverse(),
                  text: otu_labels.slice(0,10).reverse(), //out_labels  top10
                  type: 'bar',
                  orientation: 'h',
                  width: 0.6,
                  marker: { 
                    color: 'peach',
                  },
              },
          ];
          let layout = {
              title: 'Top 10 OTU',

              showlegend: false,
              xaxis: {
                  tickangle: 0,
                  zeroline: true,
                  title: "Sample Value",
              },
              yaxis: {
                  zeroline: true,
                  gridwidth: 1,
                  title: "OTU ID"
              },
              //bargap: 0.01,
              height: 370,
              width: 750,
              margin: { t:40 , l: 90, b: 35, r: 20 },
              barmode: 'stack',
              paper_bgcolor: "lavender",

          };
          Plotly.newPlot('bar', data, layout);
      }

      // Function Bubble chart
      // https://plotly.com/javascript/bubble-charts/
      function bubbleChart(dataID) {
          //let xticksBubble = otu_ids
          var trace1 = {
              x: otu_ids, //otu_id
              y: samples_values, // sample_values
              text: otu_labels, // otu_labels
              mode: 'markers',
              marker: {
                color: otu_ids,
                size: samples_values //size = sample value
              }
          };

          let dataBubble = [trace1];

          var layout = {
              title: 'Bacteria Cultures Per Sample',
              showlegend: false,
              height: 600,
              width: 1177,
              margin: { t:40 , l: 70, b: 35, r: 20 },
              showlegend: false,
              xaxis: {
                  tickangle: 0,
                  zeroline: false,
                  title: "OTU ID"
              },
              yaxis: {
                  zeroline: false,
                  gridwidth: 1,
                  title: "Sample Value",
              },
              paper_bgcolor: "lavender",
          };
          console.log(data)
          Plotly.newPlot('bubble', dataBubble, layout, {scrollZoom: true});
      }
      // Gauge Chart https://plotly.com/javascript/gauge-charts/
      function gauge(dataID) {
          var data = [
              {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: wfreq, //Washing frequency
                  title: 'Belly Button Washing Frequency',
                  subtitle: 'sub',
                  type: "indicator",
                  mode: "gauge+number",
                  delta: { reference: 2, increasing: { color: 'green' } },
                  gauge: {
                      axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
                      showTicks: true,
                      bar:{color: 'black'},
                      bgcolor: "white",
                      borderwidth: 2,
                      bordercolor: "black",
                      steps: [
                          { range: [0, 2], color: "red" },
                          { range: [2, 4], color: "orange" },
                          { range: [4, 6], color: "yellow" },
                          { range: [6, 8], color: "forestgreen" },
                          { range: [8, 10], color: "darkgreen" },
                      ],
                      threshold: {
                          line: { color: "yellow", width: 4 },
                          thickness: 1,
                          value: 10
                      }
                  }
              }
          ];
          var layout = {
              width: 300,
              height: 370,
              margin: { t: 25, r: 25, l: 25, b: 25 },
              paper_bgcolor: "lavender",
              font: { color: "Black", family: "Arial" }
          };

          
          Plotly.newPlot('gauge', data, layout);
      }
      horizontalChart(sampleId)
      bubbleChart(sampleId)
      gauge(sampleId)
  })
}

let data = d3.json("data/samples.json").then(data => {
  console.log(data)
  const samples = data.samples;
  const metadata = data.metadata;
  const names = data.names;
  console.log(samples)
  console.log(metadata)

  // dropDown button
  let dropDown = d3.select('#selDataset')
  // dropDown.on('change', handleChange)
  names.forEach(name => {
      dropDown.append('option').text(name).property('value', name);
  });
  demographic('940');
  BuildCharts('940')
})