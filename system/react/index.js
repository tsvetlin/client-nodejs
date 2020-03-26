/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 19.
 */

import React, {Component} from 'react'
import socketIOClient from 'socket.io-client'
import moment from 'moment'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts'

export default class ReactApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      historian: []
    }
  }

  componentDidMount() {
    const socket = socketIOClient('https://10.9.2.25:5000')
    socket.on('dashboard', data => {
      this.setState({data})
    })
    socket.on('historian', historian => {
      console.log('historian', historian)
      this.setState({historian})
    })
  }

  createHistorianView(historianData) {
    let historianView = []
    for (const entry of historianData) {
      historianView.push(
        <div className="card">
          <h3>{entry.systemName}</h3>
          <div className="bn">{entry.service.bn}</div>
          <span>{moment(entry.service.bt * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
          <div>{this.drawCharts(entry.offerings)}</div>
        </div>
      )
    }
    return historianView
  }

  drawCharts(offerings) {
    let offeringsView = []
    for (const key in offerings) {
      offeringsView.push(
        <div>
          <hr/>
          <div className="offeringName">{key}</div>
          <div className="diagram">{this.drawChart(offerings[key])}</div>
        </div>
      )
    }
    return offeringsView
  }

  drawChart(chartData) {
    const unit = chartData[0].u
    const fontSize = 16
    return (
      <LineChart width={600} height={300} data={chartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis type="number" dataKey="t" label={{value: 'Time', position: 'insideBottom', offset: -5, fontSize}} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(tickItem) => moment(tickItem * 1000).format('YYYY-MM-DD HH:mm:ss')}/>
        <YAxis dataKey='v' domain={['dataMin', 'dataMax + 1']} label={{value: `Unit: ${unit}`, fontSize, angle: -90, position: 'insideLeft'}}/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip unit={unit} labelFormatter={t => moment(t * 1000).format('YYYY-MM-DD HH:mm:ss')} formatter={(value, name, props) => [`${value} ${unit}`, 'Value']}/>
        <Line type="monotone" dataKey="v" stroke="#012172" activeDot={{r: 8}}/>
      </LineChart>
    )
  }

  render() {
    const { historian } = this.state
    return (
      <div className="historianContainer">
        {this.createHistorianView(historian)}
      </div>
    )
  }
}
