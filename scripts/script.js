const margin = {t: 50, r:50, b: 50, l: 50};
const padding = 15;
const size = {w: 1000, h: 800};
const svg = d3.select('svg#area');

svg.attr('width', size.w)
    .attr('height', size.h);

const containerG = svg.append('g')
    .classed('container', true)
    .attr('transform', `translate(${margin.t}, ${margin.l})`);

size.w = size.w - margin.l - margin.r;
size.h = size.h - margin.t - margin.b;

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
    return d;
})
.then(function(data) {
    data = data.sort((a, b) => a.total < b.total);
});