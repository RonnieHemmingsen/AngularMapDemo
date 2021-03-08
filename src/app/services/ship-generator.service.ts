import { Injectable } from '@angular/core';
import { ShipModel } from '../models/ship-model';

@Injectable({
  providedIn: 'root',
})
export class ShipGeneratorService {
  constructor() {}

  getShipList(): ShipModel[] {
    const m1 = new ShipModel();
    m1.id = '123sad';
    m1.name = 'Emma Maersk';
    m1.latitude = 55.422;
    m1.longitude = 4.414;

    const m2 = new ShipModel();
    m2.id = 'asflkjd';
    m2.name = 'Boaty McBoatface';
    m2.latitude = 55.6;
    m2.longitude = 4.414;

    return [m1, m2];
  }
}
