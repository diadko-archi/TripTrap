import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddPlanningComponent } from './add-planning/add-planning.component';
import { TriptrapService } from 'src/app/services/triptrap.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements AfterViewInit {

  constructor(
    private _bottomSheet: MatBottomSheet,
    private TriptrapService: TriptrapService
    ) { }

  private planningMap: any;
  IsPlanningMapRedrawNeeded$ = this.TriptrapService.IsPlanningMapRedrawNeeded$;
  Planning$ = this.TriptrapService.Planning$;
  private routingControl: any;
  private triptrapMarker = this.TriptrapService.triptrapMarker;

  private redrawMap = this.IsPlanningMapRedrawNeeded$.subscribe(() => {
    if (this.IsPlanningMapRedrawNeeded$.value) {
      this.planningMap = L.map('planning-map', {
        center: [ 46.44302692468426, 30.749383483911494 ],
        zoom: 11
      });

      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.planningMap);
    }
  })

  private drawPlanning = this.Planning$.subscribe((planning) => {
    if (this.IsPlanningMapRedrawNeeded$.value) {
      const waypoints = [
        L.latLng(planning.startPoint.lat, planning.startPoint.lng),
        L.latLng(planning.endPoint.lat, planning.endPoint.lng)
      ];

      if (this.routingControl) {
        this.planningMap.removeControl(this.routingControl);
      }

      this.routingControl = L.Routing.control({
        waypoints: waypoints,
        plan: L.Routing.plan(waypoints, {
          createMarker: (i, wp) => {
            return L.marker(wp.latLng, {
              icon: this.triptrapMarker
            });
          }
        })
      }).addTo(this.planningMap);
    }
  })

  openBottomSheet(): void {
    this._bottomSheet.open(AddPlanningComponent);
  }

  ngAfterViewInit(): void {

  }
}
