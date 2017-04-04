import React from 'react';
import ReactDOM from 'react-dom';
import './Map.css'

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
    constructor(props) {
        super(props);
        this.state = {
            inputStyle: {
                margin: '10px',
                padding: '5px',
                width: '30em',
                fontSize: 'x-large'
            }
        }
    }


    componentDidMount() {

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
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        let mustRender = nextProps.mustRender;
        if (JSON.stringify(this.state.inputStyle) !== JSON.stringify(nextState.inputStyle)) {
            mustRender = true;
        }
        return mustRender;
    }

    componentWillUpdate(nextProps) {
        if (nextProps) {
            const { lat, lng } = nextProps.getLocation();
            if (lat === '' || lng === '') return;
            const center = new this.props.google.maps.LatLng(lat, lng);
            this.map.setCenter(center);
            this.marker.setPosition(center);
        }
    }
    loadSearchBox() {
        const { google } = this.props;
        const autocompleteNode = ReactDOM.findDOMNode(this.refs.autocomplete);
        this.autocomplete = new google.maps.places.SearchBox(autocompleteNode);
        this.autocomplete.bindTo('bounds', this.map);
        this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(autocompleteNode);
        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            icon: 'http://maps.google.com/mapfiles/kml/paddle/stop.png'
            // icon: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png'
            // icon: 'http://maps.google.com/mapfiles/kml/paddle/wht-circle.png'
        });


        const { lat, lng } = {
            lat: '-12.054432177698004',
            lng: '-77.1039048501953'
        }
        const center = new this.props.google.maps.LatLng(lat, lng);
        this.marker.setPosition(center);
        this.circle = new this.props.google.maps.Circle({
            map: this.map,
            radius: 100,
            fillCOlor: '#FF0000',
            fillOpacity: 0.2
        });
        this.circle.setCenter(center);



        google.maps.event.addListener(this.autocomplete, 'places_changed', (e) => {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            const places = this.autocomplete.getPlaces();
            console.log(places);
            const place = places[0];
            if (!place) {
                return;
            };

            this.map.setCenter(place.geometry.location);
            this.map.setZoom(19);

            // if(!this.circle) {
            //     this.circle = new this.props.google.maps.Circle({
            //         map: this.map,
            //         radius: 100,
            //         fillCOlor: '#FF0000',
            //         fillOpacity: 0.2
            //     });
            // }

            this.circle.setCenter(place.geometry.location);
            


            this.marker.setPosition(place.geometry.location)

            this.props.onFind(place.geometry.location);

            this.props.getAddress(this.refs.autocomplete.value);

        });

        google.maps.event.addListener(this.marker, 'dragend', (e) => {
            const latLng = e.latLng;
            const lastLocation = this.circle.getCenter();

            // if(!this.circle) {
            //     this.circle = new this.props.google.maps.Circle({
            //         map: this.map,
            //         radius: 100,
            //         fillCOlor: '#AA0000'
            //     });
            //     this.circle.setCenter(latLng);
            // }
            // this.circle.bindTo('center', this.marker, 'position');

            const distance = this.props.google.maps.geometry.spherical.computeDistanceBetween(lastLocation, latLng);
            if(distance > 100){
                this.circle.setCenter(latLng);
                this.setAddress({ lat: latLng.lat(), lng: latLng.lng() });
                
            }
            this.map.setCenter(latLng);            

            
            this.props.onDragend(latLng);

        })


    }

    setAddress(location) {
        const { google } = this.props;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
            console.log(results[0])
            if (status === this.props.google.maps.GeocoderStatus.OK) {
                const address = results[0].formatted_address;
                this.refs.autocomplete.value = address;
                this.props.getAddress(address);
                
            }
        })
    }

    changeColor(color) {
        this.setState({
            inputStyle: { ...this.state.inputStyle, outlineColor: color }
        })
    }

    hanleChange = (e) => {
        const value = e.target.value;
        if (value === '') return;

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.functionTimer(value);
        }, 500);
    }

    functionTimer(value) {
        const { google } = this.props;
        let service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: value }, (prediction, status) => {
            console.log(prediction);
            if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                this.changeColor('red');

            } else {
                this.changeColor('black');
            }
        });
    }

    render() {
        const mapStyle = {
            width: '1222px',
            height: '1000px'
        }

        return (
            <div ref="map" style={mapStyle} onClick={this.handleClick}>
                <input className="search-box" ref="autocomplete" type="text" style={this.state.inputStyle} placeholder="Escriba el lugar a buscar" onChange={this.hanleChange} />
            </div>
        )
    };
}

export default Map;