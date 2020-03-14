// initialize variables to reference DOM elements
var dropdownMenu = d3.select("#selDataset");
var demoInfo = d3.select("#sample-metadata");

// tell d3 how to handle
function optionChanged(id) {
    d3.json("data/samples.json").then(function(data) {
        // load data
        var metadata = data.metadata;
        var samples = data.samples;

        // filter by `id`
        var metaFilter = metadata.filter(md => +md.id === +id)[0];
        var sampleFilter = samples.filter(sm => +sm.id === +id);

        // restyle barchart
        Plotly.restyle("bar", "x", [sampleFilter[0].sample_values.sort((a, b) => b - a).slice(0,10)]);
        Plotly.restyle("bar", "y", [sampleFilter[0].otu_ids.map(id => `OTU ${+id}`).slice(0,10)]);
        Plotly.restyle("bar", "text", [sampleFilter[0].otu_labels])

        // restyle bubble chart
        Plotly.restyle("bubble", "x", [sampleFilter[0].otu_ids]);
        Plotly.restyle("bubble", "y", [sampleFilter[0].sample_values]);
        Plotly.restyle("bubble", "text", [sampleFilter[0].otu_labels]);
        Plotly.restyle("bubble", "marker.color", [sampleFilter[0].otu_ids]);
        Plotly.restyle("bubble", "marker.size", [sampleFilter[0].sample_values]);

        // restyle gauge chart
        Plotly.restyle("gauge", "value", metaFilter.wfreq);

        // re-render demographic info
        demoInfo.html("")

        for (let [key, value] of Object.entries(metaFilter)) {
            demoInfo.append("div").text(`${key}: ${value}`);
        }
    });
};

// read in data, render plots
d3.json("data/samples.json").then(function(data) {
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
    var metaFilter = metadata.filter(md => +md.id === +selectedId)[0];
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

    // trace gauge chart data
    gaugeData = [{
        type: "indicator",
        mode: "gauge+number",
        value: metaFilter.wfreq,
        title: {text: "Belly Button Washing Frequency"},
        gauge: {axis: {range: [0, 9]},
                bar: {color: "#09323d"},
                steps: [
                    {range: [0, 1], color: "#fafa6e"},
                    {range: [1, 2], color: "#bdea75"},
                    {range: [2, 3], color: "#86d780"},
                    {range: [3, 4], color: "#54c18a"},
                    {range: [4, 5], color: "#23aa8f"},
                    {range: [5, 6], color: "#00918d"},
                    {range: [6, 7], color: "#007882"},
                    {range: [7, 8], color: "#1f5f70"},
                    {range: [8, 9], color: "#2a4858"}
                ]}
    }];

    Plotly.newPlot("gauge", gaugeData);

    // render demographic info
    for (let [key, value] of Object.entries(metaFilter)) {
        demoInfo.append("div").text(`${key}: ${value}`);
    }
});