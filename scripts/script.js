const margin = {t: 50, r:50, b: 50, l: 50};
const padding = 15;
const size = {w: 1000, h: 800};
const svg = d3.select('svg#area');

svg.attr('width', size.w)
    .attr('height', size.h);

const containerG = svg.append('g')
    .classed('container', true)

// size.w = size.w - margin.l - margin.r;
// size.h = size.h - margin.t - margin.b;

containerG.attr('transform', `translate(${size.w/2}, ${size.h/2})`)

const columns = ['hp', 'speed', 'attack', 'defense', 'spAtk', 'spDef'];
const colorScale = d3.scaleOrdinal()
    .domain(columns)
    .range(d3.schemeSet2);

d3.csv('data/Pokemon_subset.csv', function(d) {
    d.total = +d.total;
    d.hp = +d.hp;
    d.attack = +d.attack;
    d.defense = +d.defense;
    d.spAtk = +d.spAtk;
    d.spDef = +d.spDef;
    d.speed = +d.speed;

    let attr = [];
    columns.forEach(k => {
        attr.push({name: d.name, key: k, value:d[k]})
    })

    d.attr = attr.sort((a, b) => a.key - b.key);

    let comVal = 0;
    d.attr.forEach(k => {
        k.previousValue = comVal;
        comVal += k.value;
    });

    return d;
})
.then(function(data) {

    data = data.sort((a, b) => a.total - b.total);

    let radialChart = new RadialAreaChart();

    radialChart.data(data)
        .canvasSize(size)
        .selection(containerG)
        .colorScale(colorScale)
        .draw();
});