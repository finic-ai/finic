# svgMap

svgMap is a JavaScript library that lets you easily create an interactable world map comparing customizable data for each country.

Live demo: https://stephanwagner.me/create-world-map-charts-with-svgmap#svgMapDemoGDP

---

## Install

### ES6

```bash
npm install --save svgmap
```

```javascript
import svgMap from 'svgmap';
import 'svgmap/dist/svgMap.min.css';
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/StephanWagner/svgMap@v2.10.1/dist/svgMap.min.js"></script>
<link href="https://cdn.jsdelivr.net/gh/StephanWagner/svgMap@v2.10.1/dist/svgMap.min.css" rel="stylesheet">
```

---

## Usage

Create an HTML element where to show your map, then use JavaScript to initialize:

```html
<div id="svgMap"></div>
```

```javascript
new svgMap({
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
```

This example code creates a world map with the GDP per capita and its change to the previous year:
https://stephanwagner.me/create-world-map-charts-with-svgmap#svgMapDemoGDP

---

## Options

You can pass the following options into svgMap:

| Option      | Type | Default |  |
| --- | --- | --- | --- |
| `targetElementID` | `string` | | The ID of the element where the world map will render (Required) |
| `minZoom` | `float` | `1` | Minimal zoom level |
| `maxZoom` | `float` | `25` | Maximal zoom level |
| `initialZoom` | `float` | `1.06` | Initial zoom level |
| `initialPan` | `object` | | Initial pan on x and y axis (e.g. `{ x: 30, y: 60 }`) |
| `showContinentSelector` | `boolean` | `false` | Show continent selector |
| `zoomScaleSensitivity` | `float` | `0.2` | Sensitivity when zooming |
| `showZoomReset` | `boolean` | `false` | Show zoom reset button |
| `mouseWheelZoomEnabled` | `boolean` | `true` | Enables or disables zooming with the scroll wheel |
| `mouseWheelZoomWithKey` | `boolean` | `false` | Allow zooming only when one of the following keys is pressed: SHIFT, CONTROL, ALT, COMMAND, OPTION |
| `mouseWheelKeyMessage` | `string` | `'Press the [ALT] key to zoom'` | The message when trying to scroll without a key |
| `mouseWheelKeyMessageMac` | `string ` | `Press the [COMMAND] key to zoom` | The message when trying to scroll without a key on MacOS |
| `colorMax` | `string` | `'#CC0033'` | Color for highest value |
| `colorMin` | `string` | `'#FFE5D9'` | Color for lowest value |
| `colorNoData` | `string` | `'#E2E2E2'` | Color when there is no data |
| `flagType` | `'image'`, `'emoji'` | `'image'` | The type of the flag in the tooltip |
| `flagURL` | `string` | | The URL to the flags when using flag type `'image'`. The placeholder `{0}` will get replaced with the lowercase [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code. Default: `'https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@latest/svg/{0}.svg'` |
| `hideFlag` | `boolean` | `false` | Hide the flag in tooltips |
| `noDataText` | `string` | `'No data available'` | The text to be shown when no data is present |
| `touchLink` | `boolean` | `false` | Set to `true` to open the link (see `data.values.link`) on mobile devices, by default the tooltip will be shown |
| `onGetTooltip` | `function` | | Called when a tooltip is created to custimize the tooltip content (`function (tooltipDiv, countryID, countryValues) { return 'Custom HTML'; }`) |
| `countries` | `object` | | Additional options specific to countries: |
| &nbsp;&nbsp;&nbsp;`↳ EH` | `boolean` | `true` | When set to `false`, Western Sahara (EH) will be combined with Morocco (MA) |
| &nbsp;&nbsp;&nbsp;`↳ Crimea` | `'UA'`, `'RU'` | `'UA'` | Crimea: Set to 'RU' to make the Crimea part of Russia, by default it is part of the Ukraine |
| `data` | `object` | | The chart data to use for coloring and to show in the tooltip. Use a unique data-id as key and provide following options as value: |
| &nbsp;&nbsp;&nbsp;`↳ name` | `string` | | The name of the data, it will be shown in the tooltip |
| &nbsp;&nbsp;&nbsp;`↳ format` | `string` | | The format for the data value, `{0}` will be replaced with the actual value |
| &nbsp;&nbsp;&nbsp;`↳ thousandSeparator` | `string` | `','` | The character to use as thousand separator |
| &nbsp;&nbsp;&nbsp;`↳ thresholdMax` | `number` | `null` | Maximal value to use for coloring calculations |
| &nbsp;&nbsp;&nbsp;`↳ thresholdMin` | `number` | `0` | Minimum value to use for coloring calculations |
| &nbsp;&nbsp;&nbsp;`↳ applyData` | `string` | | The ID (key) of the data that will be used for coloring |
| &nbsp;&nbsp;&nbsp;`↳ values` | `object` | | An object with the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code as key and the chart data for each country as value |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`↳ color` | `string` | | Forces a color for this country |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`↳ link` | `string` | | An URL to redirect to when clicking the country |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`↳ linkTarget` | `string` | | The target of the link. By default the link will be opened in the same tab. Use `'_blank'` to open the link in a new tab |
| `countryNames` | `object` | | An object with the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code as key and the country name as value |

---

## Localize

Use the option `countryNames` to translate country names. In the folder `demo/html/local` or `demo/es6/local` you can find translations in following languages: Arabic, Chinese, English, French, German, Hindi, Portuguese, Russian, Spanish, Urdu.

To create your own translations, check out [country-list](https://github.com/umpirsky/country-list) by [Saša Stamenković](https://github.com/umpirsky).

---

## Attribution

If you need more detailed maps or more options for your data, there is a great open source project called [datawrapper](https://github.com/datawrapper/datawrapper) out there, with a lot more power than svgMap.

svgMap uses [svg-pan-zoom](https://github.com/bumbu/svg-pan-zoom) by [Anders Riutta](https://github.com/ariutta) (now maintained by [bumpu](https://github.com/bumpu)).

The country flag images are from [country-flags](https://github.com/hampusborgos/country-flags) by [Hampus Joakim Borgos](https://github.com/hampusborgos).

Most data in the demos was taken from [Wikipedia](https://www.wikipedia.org).
