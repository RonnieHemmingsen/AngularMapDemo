import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import Point from 'ol/geom/Point';
import { Vector as VectorSource, OSM, Cluster } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Style, Fill, Stroke, Text } from 'ol/style';
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
          image: new CircleStyle({
            radius: 15,
            stroke: new Stroke({
              color: '#000',
              width: 1,
            }),
            fill: new Fill({
              color: '#1E90FF',
            }),
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
