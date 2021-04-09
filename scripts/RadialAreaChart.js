function RadialAreaChart(){

    //INITIALIZING VARIABLES
    this._data = null;
    this._sel = null;
    this._canvasSize = null;
    this._colorScale = null;
    this._outerRadius = 400;
    this._innerRadius = 160;

    //ASSIGNING VALUES
    this.data = function(){
        if(arguments.length > 0){
            this._data = arguments[0];
            return this;
        }
        return this._data;
    }

    this.canvasSize = function(){
        if(arguments.length > 0){
            this._canvasSize = arguments[0];
            return this;
        }
        return this._canvasSize;
    }

    this.selection = function(){
        if(arguments.length > 0){
            this._sel = arguments[0];
            return this;
        }
        return this._sel;
    }

    this.colorScale = function(){
        if(arguments.length > 0){
            this._colorScale = arguments[0];
            return this;
        }
        return this._colorScale;
    }

    this.size = function(){
        if(arguments.length > 0){
            this._size = arguments[0];
            return this;
        }
        return this._size;
    }

    //CREATING CHART
    this.draw = function(){
        let scaleX = d3.scaleBand()
            .domain(this._data.map(d => d.name))
            .range([0, Math.PI*2]);

        let scaleY = d3.scaleLinear()
            .domain([0, d3.max(this._data, d => d.total)])
            .range([this._innerRadius, this._outerRadius]);
        
        let columns = this._data[0].attr.map(d => d.key);

        this._drawAxisX(scaleX);
        this._drawAxisY(scaleY);
        this._drawLegend(columns);

        //radial path function
        let area = d3.areaRadial()
            .curve(d3.curveLinearClosed)
            .angle(d => scaleX(d.name) + Math.PI / 2);
        
        //creating areas
        let areaG = this._sel.append('g')
            .classed('area', true);

        areaG.selectAll('g')
            .data([...Array(6).keys()])
            .join('g')
            .call(g => {
                g.selectAll('path')
                .data(i => [i])
                .join('path')
                .attr('fill',i => this._colorScale(columns[i]))
                .style('opacity', 0.5)
                .attr('d', i => area
                    .innerRadius(d => scaleY(d.previousValue))
                    .outerRadius(d => scaleY(d.previousValue + d.value))(this._data.map(v => v.attr[i])))
            })
    }

    this._drawAxisX = function(scaleX){
        let axisXG = this._sel
            .append('g')
            .classed('axis-x', true);

        axisXG.selectAll('g')
            .data(scaleX.domain())
            .join('g')
            .attr('transform', d => {
                //let radians = scaleX(d) + scaleX.bandwidth()/2;
                let radians = scaleX(d);
                let angle = radians * 180 / Math.PI;
                return `rotate(${angle}) translate(${this._innerRadius - 20}, 0)`
            })
            .call(g => {
                g.selectAll('text')
                    .data(d => [d])
                    .join('text')
                    .attr('transform', d => {
                        let angle = 90;
                        let radians = (scaleX(d) + scaleX.bandwidth()/2) % (Math.PI * 2);
                        if(radians < Math.PI) angle = -90;
                        return `rotate(${angle})`
                    })
                    .style('text-anchor', 'middle')
                    .style('dominant-baseline', 'middle')
                    .text(d => d);
            })
            .call(g => {
                g.selectAll('line')
                    .data([0])
                    .join('line')
                    .classed('xline', true)
                    .attr('x1', 10)
                    .attr('x2', this._outerRadius - this._innerRadius);
            });
    }

    this._drawAxisY = function(scaleY){
        let axisYG = this._sel
            .append('g')
            .classed('axis-y', true);
        
        axisYG.selectAll('g')
            .data(scaleY.ticks(3))
            .join('g')
            .call(g => {
                g.append('circle')
                .classed('yline', true)
                    .attr('r', d => scaleY(d));
            })
            .call(g => {
                g.append('text')
                        .attr('y', d => -scaleY(d))
                        .style('text-anchor', 'middle')
                        .attr('stroke', '#fff')
                        .attr('stroke-width', 5)
                        .attr('dy', '0.35em')
                        .text(d => d)
                    //following reference: https://observablehq.com/@d3/radial-area-chart
                    .clone(true)
                        .attr('y', d => scaleY(d))
                    .selectAll(function(){return [this, this.previousSibling]})
                        .clone(true)
                        .attr('fill', 'currentColor')
                        .attr('stroke', 'none');
            });
    }

    this._drawLegend = function(columns){
        let legendG = this._sel.append('g')
            .classed('legend', true)
            .attr('transform', `translate(350, 220)`);
        
        let legendSize = 12;

        legendG.selectAll('g')
            .data(columns)
            .join('g')
            .call(g => {
                g.selectAll('rect')
                    .data(d => [d])
                    .join('rect')
                    .attr('y', d => columns.indexOf(d) * legendSize * 1.6)
                    .attr('width', legendSize)
                    .attr('height', legendSize)
                    .attr('fill', d => this._colorScale(d))
            })
            .call(g => {
                g.selectAll('text')
                    .data(d => [d])
                    .join('text')
                    .attr('x', legendSize * 1.2)
                    .attr('y', d => columns.indexOf(d) * legendSize * 1.6 + legendSize / 2)
                    .style('dominant-baseline', 'middle')
                    .style('font-size', '12px')
                    .text(d => d)
            });
    }
}