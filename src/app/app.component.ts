import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import MapBrowserPointerEvent from 'ol/MapBrowserEvent';
import { MapService } from './services/map.service';
import { ShipGeneratorService } from './services/ship-generator.service';
import Feature, { FeatureLike } from 'ol/Feature';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MapDemo';
  map?: Map;

  constructor(
    private mapService: MapService,
    private shipGenerator: ShipGeneratorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    const list = this.shipGenerator.getShipList();
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([4.414, 55.422]),
        zoom: 7,
      }),
    });

    this.map.addLayer(this.mapService.addLocationFeatures(list));

    this.map.on('singleclick', this.onClick.bind(this));
  }

  //Event methods
  private onClick(event: MapBrowserPointerEvent) {
    console.log('clicked me', event);
    if (this.map === undefined) {
      return;
    }
    const pixel = event.pixel;

    const clusterFeatures = this.map.getFeaturesAtPixel(pixel);

    if (
      clusterFeatures?.length === 0 ||
      clusterFeatures[0].get('features').length > 1
    ) {
      return;
    }
    const result = this.getFeatureFromCluster(clusterFeatures);
    console.log('clicked', result);
  }

  //Utility methods
  private getFeatureFromCluster(clusterFeatures: FeatureLike[]): Feature {
    return clusterFeatures[0].get('features')[0];
  }
}
