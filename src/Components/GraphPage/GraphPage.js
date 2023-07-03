import React from 'react'
import './GraphPage.css';
import { useState, useEffect } from 'react';
import TextButton from '../Common/TextButton/TextButton';
import { ExportToCsv } from 'export-to-csv';
import { VictoryChart, VictoryAxis, VictoryArea, VictoryScatter, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

const GraphPage = ({ projectionData, useMetricSystem }) => {

    const [xTicks, setXTicks] = useState('');
    const [horizLineData, setHorizLineData] = useState([{x:0,y:0},{x:0,y:0}]);
    const [vertLineData, setVertLineData] = useState([{x:0,y:0},{x:0,y:0}]);

    const csvOptions = { 
        filename: 'WeightForecast',
        title: 'Weight forecast',
        showLabels: true, 
        showTitle: true,
        headers: ['Day', 'Date', `Weight (${useMetricSystem ? 'kg' : 'lb'})`]
      };
    const csvExporter = new ExportToCsv(csvOptions);

    const getDateFromTickValue = (tickValue) => {
        let startDate = projectionData.startDate;
        let tickDate = new Date(startDate.getTime() + tickValue * 86400000);

        // Format finishDate to string
        const options = { day: 'numeric', month: 'short', year: '2-digit'};
        const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
        const parts = dateTimeFormat.formatToParts(tickDate);
        const tickDateString = `${parts[2].value} ${parts[0].value}`;
        
        return tickDateString;
    }

    const updateTooltipAxes = (toolTipCoords) => {
        const x = toolTipCoords._voronoiX;
        const y = toolTipCoords._voronoiY;

        setHorizLineData([{x:0, y}, {x, y}]);
        setVertLineData([{x, y:0}, {x, y}]);
    }

    const exportToCsv = () => {
        let csvData = [];
        for (let i = 0; i < projectionData.xMax; i++) {
            const date = new Date(projectionData.startDate.getTime() + i * 86400000);
            const options = { day: '2-digit', month: '2-digit', year: 'numeric'};
            const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
            const parts = dateTimeFormat.formatToParts(date);
            const dateString = `${parts[4].value}-${parts[0].value}-${parts[2].value}`;
    
            csvData.push({
                day: i+1,
                date: dateString,
                weight: (projectionData.xy[i].y).toFixed(1)
            })
        }
        csvExporter.generateCsv(csvData)
    }

    useEffect(() => {
        if (!!projectionData) {
            const tickInterval = Math.floor(projectionData.xMax / 10);
            let tickValues = [];
            for (let i = 1; i <= 10; i++) {
                tickValues.push(i * tickInterval);
            }
            setXTicks(tickValues);

        }
    }, [projectionData]);

  return (
    <div>
        <div className='page-container'>
            { !!projectionData && !!xTicks &&
                <div className='graph-page'>
                    <div className='victory-container'>
                        <VictoryChart 
                            theme={VictoryTheme.material}
                            padding={{ top: 20, bottom: 40, left: 45, right: 0 }}
                            containerComponent={ 
                                <VictoryVoronoiContainer 
                                    onActivated={points => updateTooltipAxes(points[0])}
                                /> 
                            }
                            domain={{
                                x: [0, projectionData.xMax], 
                                y: [projectionData.yMin, projectionData.yMax]
                            }}
                            width={580}
                            height={360}
                        >
                            <VictoryArea
                                labels={({datum}) => `${getDateFromTickValue(datum.x)} (Day ${datum.x})\n- ${datum.y.toFixed(1)}kg -`}
                                labelComponent={
                                    <VictoryTooltip
                                        flyoutStyle={{stroke:''}}
                                        cornerRadius={12}
                                    />
                                }
                                style={{
                                    data: { stroke: '#88cb66', strokeWidth: 2, fill:'#bdea7a', fillOpacity: 0.5 },
                                    parent: { border: '1px solid #000000'}
                                }}
                                data={projectionData.xy}
                            />
                            <VictoryScatter 
                                labelComponent={
                                    <VictoryTooltip
                                    active={false}
                                    />
                                }
                                data={projectionData.xy}
                                size={({ active }) => active ? 5 : 1}
                                style={{ data: { fill: "#88cb66" } }}
                            />
                            <VictoryLine
                                data={horizLineData}  
                                style={{
                                    data: { stroke: "#6e6e6e", strokeWidth: 0.5}
                                }}
                            />
                            <VictoryLine
                                data={vertLineData}    
                                style={{
                                    data: { stroke: "#6e6e6e", strokeWidth: 0.5}
                                }}
                            />
                            <VictoryAxis crossAxis
                                width={580}
                                height={360}
                                tickValues={xTicks}
                                tickFormat={(t) => getDateFromTickValue(t)}
                                theme={VictoryTheme.material}
                                label="Date"
                                style={{
                                    axis: {stroke: 'black'},
                                    axisLabel: {fontSize: 12, padding: 40},
                                    grid: {stroke: "#6e6e6e", strokeWidth: 0.5},
                                    ticks: {stroke: "black", size: 5},
                                    tickLabels: {fontSize: 10, angle: 45, transform: 'translate(15, 4)'}
                                }}
                                standalone={false}
                            />
                            <VictoryAxis dependentAxis crossAxis
                                width={580}
                                height={360}
                                tickCount={7}
                                theme={VictoryTheme.material}
                                standalone={false}
                                label={`Weight (${useMetricSystem ? 'kg' : 'lb'})`}
                                style={{
                                    axis: {stroke: 'black'},
                                    axisLabel: {fontSize: 12, padding: 30},
                                    grid: {stroke: ({ tick }) => tick > projectionData.yMin ? "#6e6e6e" : "black", strokeWidth: 0.5},
                                    ticks: {stroke: "black", size: 5},
                                    tickLabels: {fontSize: 10, padding: 5}
                                }}
                            />
                        </VictoryChart> 
                    </div>
                    <div className='export-container'>
                        <TextButton text='Export JPEG' icon='fa-solid fa-file-image' color='#ceed88'/>
                        <TextButton text='Export CSV' icon='fa-solid fa-file-csv' color='#ceed88' callback={exportToCsv}/>
                    </div>
                </div>
            }
        </div>
        <div className='page-spacer'/>
    </div>
  )
}

export default GraphPage