import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let geo: any = this.route.snapshot.paramMap.get('geo');
    console.log(geo);
    geo = geo.substr(4);
    geo = geo.split(',');
    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

  }
  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmFjaG9icDMiLCJhIjoiY2s4dDZybjBqMDBlbzNlczF6aXJhdmRyMCJ9.hL7fWbjbg6T0EiNOvfNVbQ';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng,this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load',  () => {

      map.resize();
      // Insert the layer beneath any symbol layer.
      let layers = map.getStyle().layers;

      new mapboxgl.Marker().setLngLat({lng: this.lng, lat:this.lat}).addTo(map);

      let labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
      
    });

  }
}
