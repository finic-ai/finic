import svgMap from 'svgmap';
import 'svgmap/dist/svgMap.min.css';

// Demo GDP
import dataGDP from './data/gdp';

new svgMap({
  targetElementID: 'svgMapGPD',
  data: dataGDP
});

// Demo population
import dataPopulation from './data/population';

new svgMap({
  targetElementID: 'svgMapPopulation',
  data: dataPopulation,
  flagType: 'emoji',
  mouseWheelZoomEnabled: true,
  mouseWheelZoomWithKey: true
});

// Demo person height in German
import dataPersonHeight from './data/personHeight';
import countriesDE from './local/countriesDE';

new svgMap({
  targetElementID: 'svgMapPersonHeight',
  countryNames: countriesDE,
  data: dataPersonHeight,
  colorMin: '#FFF0F9',
  colorMax: '#730B62',
  hideFlag: true,
  noDataText: 'Keine Daten vorhanden',
  mouseWheelZoomEnabled: true,
  mouseWheelZoomWithKey: true,
  mouseWheelKeyMessage: 'Bitte [ALT] drücken um zu zoomen',
  mouseWheelKeyMessageMac: 'Bitte [COMMAND] drücken um zu zoomen'
});

// Demo EURO as currency

var svgMapEuroCurrency = new svgMap({
  targetElementID: 'svgMapEuroCurrency',
  data: {
    data: {
      euro: {}
    },
    applyData: 'euro',
    values: {
      AT: { euro: 1, eurozone: 1 }, // Austria
      BE: { euro: 1, eurozone: 1 }, // Belgium
      CY: { euro: 1, eurozone: 1 }, // Cyprus
      EE: { euro: 1, eurozone: 1 }, // Estonia
      FI: { euro: 1, eurozone: 1 }, // Finland
      FR: { euro: 1, eurozone: 1 }, // France
      DE: { euro: 1, eurozone: 1 }, // Germany
      GR: { euro: 1, eurozone: 1 }, // Greece
      IE: { euro: 1, eurozone: 1 }, // Ireland
      IT: { euro: 1, eurozone: 1 }, // Italy
      LV: { euro: 1, eurozone: 1 }, // Latvia
      LT: { euro: 1, eurozone: 1 }, // Lithuania
      LU: { euro: 1, eurozone: 1 }, // Luxembourg
      MT: { euro: 1, eurozone: 1 }, // Malta
      NL: { euro: 1, eurozone: 1 }, // Netherlands
      PT: { euro: 1, eurozone: 1 }, // Portugal
      ES: { euro: 1, eurozone: 1 }, // Spain
      SI: { euro: 1, eurozone: 1 }, // Slovenia
      SK: { euro: 1, eurozone: 1 }, // Slovakia

      // Countries using euro but not in eurozone
      XK: { euro: 1, eurozone: 0, color: '#528FCC' }, // Kosovo
      ME: { euro: 1, eurozone: 0, color: '#528FCC' }, // Montenegro
      AD: { euro: 1, eurozone: 0, color: '#528FCC' }, // Andorra
      MC: { euro: 1, eurozone: 0, color: '#528FCC' }, // Monaco
      SM: { euro: 1, eurozone: 0, color: '#528FCC' }, // San Marino
      VA: { euro: 1, eurozone: 0, color: '#528FCC' }, // Vatican City

      // Countries in eurozone but not using euro
      BG: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Bulgaria
      CZ: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Czech Republic
      DK: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Denmark
      HR: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Croatia
      HU: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Hungary
      PL: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Poland
      RO: { euro: 0, eurozone: 1, color: '#a6d2ff' }, // Romania
      SE: { euro: 0, eurozone: 1, color: '#a6d2ff' } // Sweden
    }
  },
  colorMin: '#E2E2E2',
  colorMax: '#297ACC',
  colorNoData: '#E2E2E2',
  thresholdMax: 1,
  thresholdMin: 0,
  initialZoom: 3,
  initialPan: {
    x: 420,
    y: 50
  },
  mouseWheelZoomEnabled: true,
  mouseWheelZoomWithKey: true,
  onGetTooltip: function (tooltipDiv, countryID, countryValues) {
    // Geting the list of countries
    var countries = svgMapEuroCurrency.countries;

    // Create tooltip content element
    var tooltipContentElement = document.createElement('div');
    tooltipContentElement.style.padding = '16px 24px';

    // Fill content
    var innerHTML =
      '<div style="margin: 0 0 10px; text-align: center"><img src="https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@latest/svg/{0}.svg" alt="" style="height: 40px; width: auto; border: 2px solid #eee"></div>'.replace(
        '{0}',
        countryID.toLowerCase()
      );

    innerHTML +=
      '<div style="min-width: 180px; font-weight: bold; margin: 0 0 15px; text-align: center">' +
      countries[countryID] +
      '</div>';

    if (countryValues && countryValues.eurozone == 1) {
      innerHTML +=
        '<div style="margin-bottom: 8px"><span style="color: #6d0; display: inline-block; margin-right: 4px; width: 20px; text-align: center">✔</span>Part of eurozone</div>';
    } else {
      innerHTML +=
        '<div style="margin-bottom: 8px; color: #aaa"><span style="color: #f03; display: inline-block; margin-right: 4px; width: 20px; text-align: center">✘</span>Not a part of eurozone</div>';
    }

    if (countryValues && countryValues.euro == 1) {
      innerHTML +=
        '<div style="margin-bottom: 8px"><span style="color: #6d0; display: inline-block; margin-right: 4px; width: 20px; text-align: center">✔</span>Uses Euro</div>';
    } else {
      innerHTML +=
        '<div style="margin-bottom: 8px; color: #aaa"><span style="color: #f03; display: inline-block; margin-right: 4px; width: 20px; text-align: center">✘</span>Does not use Euro</div>';
    }

    // Return element with custom content
    tooltipContentElement.innerHTML = innerHTML;
    return tooltipContentElement;
  }
});
