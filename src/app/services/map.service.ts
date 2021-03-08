import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import Point from 'ol/geom/Point';
import { Vector as VectorSource, OSM, Cluster } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import {
  Circle as CircleStyle,
  Style,
  Fill,
  Stroke,
  Text,
  Icon,
} from 'ol/style';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  features: Feature[];

  static readonly DEFAULT_SHIP: Style = new Style({
    image: new CircleStyle({
      radius: 10,
      stroke: new Stroke({
        color: '#ff0000',
        width: 1,
      }),
      fill: new Fill({
        color: '#ff0000',
      }),
    }),
  });

  constructor() {
    this.features = [];
  }

  /**
   * For each location generate a point on the map,
   * Add this point to the feature list
   * Style the feature as per the design,
   * Add the feature to a vector source and then a vector layer
   * Return the layer
   * @param list List of the locations to add to the layer
   */
  addLocationFeatures(list: any[]): VectorLayer {
    this.features = [];
    list.forEach((ship) => {
      let circle = new Point(fromLonLat([ship.longitude, ship.latitude]));
      let feature = new Feature(circle);
      feature.setId(ship.id);

      this.features.push(feature);
    });

    this.features.forEach((feature) => {
      const style: Style[] = [MapService.DEFAULT_SHIP];
      feature.setStyle(style);
    });

    let vectorSource = new VectorSource({
      features: this.features,
    });

    let clusterSource = new Cluster({
      distance: 45,
      source: vectorSource,
    });

    let layer = new VectorLayer({
      zIndex: 100,
      source: clusterSource,
      style: function (feature) {
        const length = feature.get('features').length;
        //Create the collapsed circles
        return new Style({
          image: new Icon({
            src:
              'data:image/svg+xml;base64,' +
              'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgd2lkdGg9IjE0LjE5NTM5OG1tIgogICBoZWlnaHQ9IjE0LjY1MzIzNG1tIgogICB2aWV3Qm94PSIwIDAgMTQuMTk1Mzk4IDE0LjY1MzIzNCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMjIyNCI+CiAgPGRlZnMKICAgICBpZD0iZGVmczIyMTgiPgogICAgPGZpbHRlcgogICAgICAgaWQ9ImZpbHRlcjIzX2QiCiAgICAgICB4PSI2MjAiCiAgICAgICB5PSIzNDAiCiAgICAgICB3aWR0aD0iNTMuNjUxOTAxIgogICAgICAgaGVpZ2h0PSI1NS4zODIzMDEiCiAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICA8ZmVGbG9vZAogICAgICAgICBmbG9vZC1vcGFjaXR5PSIwIgogICAgICAgICByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgaWQ9ImZlRmxvb2QxMDI2IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgxMDI4IiAvPgogICAgICA8ZmVPZmZzZXQKICAgICAgICAgaWQ9ImZlT2Zmc2V0MTAzMCIgLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMi41IgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxMDMyIiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIgogICAgICAgICBpZD0iZmVDb2xvck1hdHJpeDEwMzQiIC8+CiAgICAgIDxmZUJsZW5kCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93IgogICAgICAgICBpZD0iZmVCbGVuZDEwMzYiIC8+CiAgICAgIDxmZUJsZW5kCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93IgogICAgICAgICByZXN1bHQ9InNoYXBlIgogICAgICAgICBpZD0iZmVCbGVuZDEwMzgiIC8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMjIyMSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi40Nzg2NiwxNzYuNjU5OTUpIj4KICAgIDxnCiAgICAgICBmaWx0ZXI9InVybCgjZmlsdGVyMjNfZCkiCiAgICAgICBpZD0iZzI4MCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsLTM0Ni41MjAzMiwtMjY2LjYxODI4KSI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Im0gNjYxLjExNiwzNjMuMzI0IC0yNS4xMjMsMjcuMDU4IC0xLjQxNCwtOS41IC05LjU3OSwtMC43MDYgMjUuMTIzLC0yNy4wNTggMTMuMDMzLC0zLjAxNSB6IgogICAgICAgICBmaWxsPSIjZmYwMDAwIgogICAgICAgICBpZD0icGF0aDI3OCIgLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=',
          }),
          text: new Text({
            text: feature.get('features').length.toString(),
            fill: new Fill({
              color: '#fff',
            }),
          }),
        });
      },
    });

    return layer;
  }
}
