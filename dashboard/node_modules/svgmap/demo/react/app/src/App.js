// React
import React, { Component } from 'react';
import './App.css';

// svgMap
import svgMap from 'svgmap';
import 'svgmap/dist/svgMap.min.css';

class App extends Component {

  componentDidMount() {
    if (!this.svgMap) {

      console.log(this.state);

      var mySvgMap = new svgMap({
        targetElementID: 'svgMap',
        data: {
          data: {
            gdp: {
              name: 'GDP per capita',
              format: '{0} USD',
              thousandSeparator: ',',
              thresholdMax: 50000,
              thresholdMin: 1000
            },
            change: {
              name: 'Change to year before',
              format: '{0} %'
            }
          },
          applyData: 'gdp',
          values: {
            AF: { gdp: 587, change: 4.73 },
            AL: { gdp: 4583, change: 11.09 },
            DZ: { gdp: 4293, change: 10.01 }
            // ...
          }
        }
      });

      this.svgMap = mySvgMap;
    }
  }

  render() {
    return (
      <div className='app'>
        <h1>svgMap React demo</h1>
        <div id='svgMap'></div>
      </div>
    );
  }
}

export default App;
