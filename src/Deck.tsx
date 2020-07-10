// @ts-nocheck
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, PolygonLayer } from "@deck.gl/layers";
import {
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight,
} from "@deck.gl/core";
import { scaleThreshold, scaleLinear } from "d3-scale";
// import d from "./mos.json";
import d from "./res.json";
import d2 from "./res2.json";

// Set your mapbox token here
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY3NrZWxldG8iLCJhIjoiY2tjZXcydmIzMGM5YTJ6bnp4cTR4Y3hpdiJ9.OV4dmoz2qVwrGGeCOKOYsw"; // eslint-disable-line

// Source data GeoJSON
const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json"; // eslint-disable-line

// function calcCrow(lat1, lon1, lat2, lon2) {
//   var R = 6371; // km
//   var dLat = toRad(lat2 - lat1);
//   var dLon = toRad(lon2 - lon1);
//   var lat1 = toRad(lat1);
//   var lat2 = toRad(lat2);

//   var a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = R * c;
//   return d;
// }

// // Converts numeric degrees to radians
// function toRad(Value) {
//   return (Value * Math.PI) / 180;
// }
export const COLOR_SCALE = scaleLinear()
  .domain([
    0,
    15,
    45,
    85,
    // -0.6,
    // -0.45,
    // -0.3,
    // -0.15,
    // 0,
    // 0.15,
    // 0.3,
    // 0.45,
    // 0.6,
    // 0.75,
    // 0.9,
    // 1.05,
    // 1.2,
  ])
  .range([
    [255, 255, 255],
    [0, 255, 0],
    [255, 181, 0],
    [255, 0, 0],
    // [65, 182, 196],
    // [127, 205, 187],
    // [199, 233, 180],
    // [237, 248, 177],
    // // zero
    // [255, 255, 204],
    // [255, 237, 160],
    // [254, 217, 118],
    // [254, 178, 76],
    // [253, 141, 60],
    // [252, 78, 42],
    // [227, 26, 28],
    // [189, 0, 38],
    // [128, 0, 38],
  ]);

const INITIAL_VIEW_STATE = {
  latitude: 55.746747948377,
  longitude: 37.583000442239,
  zoom: 11,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 22),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: false,
});

const landCover = [
  [
    [-123.0, 49.196],
    [-123.0, 49.324],
    [-123.306, 49.324],
    [-123.306, 49.196],
  ],
];

function getTooltip({ object }) {
  return (
    object && {
      html: `\
    <div><b>Загруженность парковочной зоны</b></div>
    <div>Всего мест: ${object.properties.total}</div>
    <div>Занято: ${object.properties.busy}</div>
    `,
    }
  );
}

const Deck = ({
  mapStyle = "mapbox://styles/cskeleto/ckcg3k3ut0qqj1io5dxxw7lux",
}) => {
  const [data, setData] = useState(d);

  const [effects] = useState(() => {
    const lightingEffect = new LightingEffect({ ambientLight, dirLight });
    lightingEffect.shadowColor = [0, 0, 0, 0.5];
    return [lightingEffect];
  });

  useEffect(() => {
    console.log(data);
  }, []);

  const layers = [
    // only needed when using shadows - a plane for shadows to drop on
    new PolygonLayer({
      id: "ground",
      data: landCover,
      stroked: false,
      getPolygon: (f) => f,
      getFillColor: [0, 0, 0, 0],
    }),
    new GeoJsonLayer({
      id: "geojson",
      data,
      opacity: 0.4,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getElevation: (f) => {
        return f.properties.busy * 100;
      },
      getFillColor: (f) => {
        return COLOR_SCALE(f.properties.busy);
      },
      getLineColor: [255, 255, 255],
      pickable: true,
    }),
  ];

  return (
    <>
      <DeckGL
        layers={layers}
        effects={effects}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
      <div className="selectSource">
        <button
          onClick={() => {
            setData(d);
          }}
        >
          Пятница
        </button>
        <button
          onClick={() => {
            setData(d2);
          }}
        >
          Суббота
        </button>
      </div>
    </>
  );
};

export default Deck;
