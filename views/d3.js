// import * as d3 from 'https://d3js.org/d3.v7.min.js';

async function getData() {
    await fetch("/purchase/getGenderComperason", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        // Data for the chart

        const dataForChart = data.group.map(item => ({
            label: item._id,         // Use item._id as the label
            value: item.totalPrice    // Use item.totalPrice as the value
        }));

                // Chart dimensions and margins
        const width = 400;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        // Create the SVG container
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Set up scales
        const x = d3.scaleBand()
            .domain(dataForChart.map(d => d.label))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataForChart, d => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Create X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "axis-label");

        // Create Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("class", "axis-label");

        // Create bars
        svg.selectAll(".bar")
            .data(dataForChart)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.label))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - margin.bottom - y(d.value));




    })






    await fetch("/purchase/getProductComperason", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)



                // Data for the chart (item names and quantities purchased)
        const purchaseData = data.group.map(itemName => {
            return {
                itemName: itemName._id,
                quantity: itemName.totalQuantity
            };
        });

        // Chart dimensions and radius
        const chartWidth = 300;
        const chartHeight = 300;
        const chartRadius = Math.min(chartWidth, chartHeight) / 2;

        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(purchaseData.map(entry => entry.itemName))
            .range(d3.schemeSet2);

        // Create the SVG container and center it
        const svgContainer = d3.select("#pieChart")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight / 2})`);

        // Create the pie and arc functions
        const pieGenerator = d3.pie()
            .value(entry => entry.quantity);

        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(chartRadius);

        // Bind data and create the pie chart arcs
        svgContainer.selectAll(".arc")
            .data(pieGenerator(purchaseData))
            .enter()
            .append("g")
            .attr("class", "arc")
            .append("path")
            .attr("d", arcGenerator)
            .attr("fill", entry => colorScale(entry.data.itemName));

        // Create a legend below the chart
        const legend = d3.select("#legend")
            .selectAll(".legend-item")
            .data(purchaseData)
            .enter()
            .append("div")
            .attr("class", "legend-item")
            .style("display", "flex")
            .style("align-items", "center")
            .style("margin-bottom", "5px");

        // Add colored box and product name for each legend item
        legend.append("div")
            .style("width", "20px")
            .style("height", "20px")
            .style("background-color", entry => colorScale(entry.itemName))
            .style("margin-right", "10px");

        legend.append("span")
            .text(entry => `${entry.itemName}: ${entry.quantity}`);


    })




}













