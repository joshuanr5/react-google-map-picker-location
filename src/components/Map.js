import React from 'react';
import ReactDOM from 'react-dom';

const mapStyles = [
    {
        featureType: 'all',
        stylers: [
            { saturation: -50 }
        ]
    }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
            { hue: '#00ffee' },
            { saturation: 30 }
        ]
    }, {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [
            { visibility: 'on' }
        ]
    }
];

class Map extends React.Component {

    componentDidMount() {
        // console.log('component did mount')

        this.loadMap();
        this.loadSearchBox();
    }

    loadMap() {
        const { google } = this.props;
        const maps = google.maps;

        const mapRef = this.refs.map;
        const nodeMap = ReactDOM.findDOMNode(mapRef);

        let zoom = 12;
        if (this.map) {
            zoom = this.map.zoom;
        }
        const { lat, lng } = {
            lat: '-12.054432177698004',
            lng: '-77.1039048501953'
        }
        const center = new maps.LatLng(lat, lng);

        const mapConfig = {
            center,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            styles: mapStyles
        }

        this.map = new maps.Map(nodeMap, mapConfig);

        this.map.addListener('click', (e) => {
            // console.log('e', e.latLng.lat());
        })
    }

    shouldComponentUpdate(nextProps) {
        // console.log('should update', nextProps);
        let mustRender = nextProps.mustRender;
        // console.log(JSON.stringify(this.props.getLocation()) === JSON.stringify(nextProps.getLocation()))
        // if(JSON.stringify(this.props.getLocation()) === JSON.stringify(nextProps.getLocation())) {
        //     mustRender = false;
        // }
        return mustRender;
    }

    componentWillUpdate(nextProps) {
        // console.log('will update', this.props, nextProps);
        if (nextProps) {
            const { lat, lng } = nextProps.getLocation();
            if(lat === '' || lng === '') return;
            const center = new this.props.google.maps.LatLng(lat, lng);
            this.map.setCenter(center);
            this.marker.setPosition(center);
        }
    }
    loadSearchBox() {
        const { google } = this.props;
        const autocompleteNode = ReactDOM.findDOMNode(this.refs.autocomplete);
        this.autocomplete = new google.maps.places.Autocomplete(autocompleteNode);
        this.autocomplete.bindTo('bounds', this.map);
        this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(autocompleteNode);
        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            // icon: 'http://maps.google.com/mapfiles/kml/paddle/stop.png'
            icon: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png'
            // icon: 'http://maps.google.com/mapfiles/kml/paddle/wht-circle.png'
        });

         const { lat, lng } = {
            lat: '-12.054432177698004',
            lng: '-77.1039048501953'
        }
        const center = new this.props.google.maps.LatLng(lat, lng);
        this.marker.setPosition(center);



        google.maps.event.addListener(this.autocomplete, 'place_changed', (e) => {
            const place = this.autocomplete.getPlace();
            if (!place.geometry) return;

            // if(place.geometry.viewport) {
            //     this.map.fitBounds(place.geometry.viewport);
            //     this.map.setZoom(18);
            // }
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(18);


            // this.marker.setPlace({
            //     placeId: place.place_id,
            //     location: place.geometry.location
            // });


            this.marker.setPosition(place.geometry.location)

            this.props.onFind(place.geometry.location);

        });

        google.maps.event.addListener(this.marker, 'dragend', (e) => {
            this.map.setCenter(e.latLng);
            this.props.onDragend(e.latLng);
        })

    }

    render() {
        // console.log('render map', this.map)
        const style = {
            width: '1222px',
            height: '1000px'
        }

        return (
            <div ref="map" style={style}>
                <input ref="autocomplete" type="text" style={{ margin: "10px", padding: "5px", width: "20em" }} />
            </div>
        )
    };
}

export default Map;