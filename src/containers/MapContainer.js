import React from 'react';
import GoogleApiComponent from '../lib/GoogleApiComponent';
import Map from '../components/Map';
const __GAPI_KEY__ = 'AIzaSyDyeDEjXziWUwb6po-q1vy47vsw2QjYiQI';

class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
            currentLocation: {
                lat: '-12.054432177698004',
                lng: '-77.1039048501953'
            }
        }
        this.handleLatChange = this.handleLatChange.bind(this);
        this.handleLngChange = this.handleLngChange.bind(this);
        this.handleFind = this.handleFind.bind(this);
        this.handleDragend = this.handleDragend.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleLatChange(e) {
        const lat = e.target.value;
        const fc = lat[0] || '';
        const rs = lat.substr(1, lat.length - 1);

        if (fc === '-' || !isNaN(fc) || fc === '') {
            if (!isNaN(rs) || rs === '') {
                this.setState({
                render: false,
                    currentLocation: { ...this.state.currentLocation, lat }
                });
            }
        }
    }

    handleLngChange(e) {
        const lng = e.target.value;
        const fc = lng[0] || '';
        const rs = lng.substr(1, lng.length - 1);

        if (fc === '-' || !isNaN(fc) || fc === '') {
            if (!isNaN(rs) || rs === '') {
                this.setState({
                    render: false,
                    currentLocation: { ...this.state.currentLocation, lng }
                });
            }
        }
    }

    handleFind(location) {
        const lat = location.lat().toString();
        const lng = location.lng().toString();
        this.setState({
            render: false,
            currentLocation: {
                lat,
                lng
            }
        });
    }
    
    handleDragend(location) {
        const lat = location.lat().toString();
        const lng = location.lng().toString();
        this.setState({
            render: false,
            currentLocation: {
                lat,
                lng
            }
        });
    }

    handleBlur(e) {
        // console.log('poniendo render a true')
        this.setState({
            render: true
        })
    }

    getLocation(location) {
        return location;
    }

    render() {
        // console.log('render mapcon', this.props, this.state);
        const { currentLocation } = this.state;
        return (
            <div>
                {this.props.loaded &&
                    <Map 
                        google={this.props.google} 
                        onFind={this.handleFind}
                        onDragend={this.handleDragend} 
                        mustRender={this.state.render} 
                        getLocation={this.getLocation.bind(null,currentLocation)}
                    />
                }
                <hr />
                <p>lat: </p>
                <input 
                    className="lat" 
                    type="text" 
                    value={currentLocation.lat} 
                    onChange={this.handleLatChange} 
                    onBlur={this.handleBlur}
                />
                <p>lng: </p>
                <input 
                    className="lng" 
                    type="text" 
                    value={currentLocation.lng} 
                    onChange={this.handleLngChange} 
                    onBlur={this.handleBlur}
                />
            </div>
        );
    }
}

export default GoogleApiComponent({
    apiKey: __GAPI_KEY__
})(MapContainer);

