// select variables to reference DOM elements
var dropdownMenu = d3.select("#selDataset")
var demoInfo = d3.select("#sample-metadata")

// read in data, render plots
d3.json("../samples.json").then(function(data) {
    // sort id's
    var ids = data.names.sort((a, b) => a - b);

    // render dropdown menu
    ids.forEach(id => {
        var option = dropdownMenu.append("option");
        option.attr("value", id).text(id);
    });

    // retrieve first id to filter data for initial load
    var selectedId = ids.slice(0,1);

    // load data
    var metadata = data.metadata;
    var samples = data.samples;

    // filter by `selectedId`
    var metaFilter = metadata.filter(md => +md.id === +selectedId);
    var sampleFilter = samples.filter(sm => +sm.id === +selectedId);

    // retrieve sample data
    // ... sample_values, otu_ids, otu_labels
    var sVals = sampleFilter[0].sample_values;
    var otuIds = sampleFilter[0].otu_ids;
    var otuLabs = sampleFilter[0].otu_labels;

    // trace bar chart data
    barData = [{
        x: sVals.sort((a, b) => b - a).slice(0,10),
        y: otuIds.map(id => `OTU ${+id}`).slice(0,10),
        type: "bar",
        text: otuLabs,
        orientation: "h"
    }];

    // bar chart data  - reverse y axis
    barLayout = {
        yaxis: {autorange: "reversed"}
    };

    // plot bar chart
    Plotly.newPlot("bar", barData, barLayout);

    // trace bubble chart data
    bubbleData = [{
        x: otuIds,
        y: sVals,
        mode: "markers",
        text: otuLabs,
        marker: {
            color: otuIds,
            size: sVals
        }
    }];

    // bubble chart layout
    bubbleLayout = {
        xaxis: {title: "OTU ID"}
    };

    // plot bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
});