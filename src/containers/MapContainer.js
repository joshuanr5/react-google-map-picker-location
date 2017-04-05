import React from 'react';
import GoogleApiComponent from '../lib/GoogleApiComponent';
import Map from '../components/Map';
const __GAPI_KEY__ = 'AIzaSyDyeDEjXziWUwb6po-q1vy47vsw2QjYiQI';
import LocalList from '../components/LocalList';

class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
            currentAddress: '',
            currentLocation: {
                lat: '-12.054432177698004',
                lng: '-77.1039048501953'
            },
            locals: []
        }
        this.handleLatChange = this.handleLatChange.bind(this);
        this.handleLngChange = this.handleLngChange.bind(this);
        this.handleFind = this.handleFind.bind(this);
        this.handleDragend = this.handleDragend.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.handleShowClick = this.handleShowClick.bind(this);
        this.changeRender = this.changeRender.bind(this);
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
        this.setState({
            render: true
        })
    }

    getLocation(location, address) {
        return {location, address};
    }

    handleSave() {
        const { lat, lng } = this.state.currentLocation;
        const address = this.state.currentAddress;
        const id = this.state.locals.length + 1;

        if(address === '') return;

        this.setState({
            locals: [...this.state.locals, {id, address, lat, lng}]
        });
    }

    getAddress(address) {
        this.setState({
            currentAddress: address
        });
    }

    handleShowClick(local) {
        const {address, lat, lng} = local;

        this.setState({
            render: true,
            currentAddress: address,
            currentLocation: {
                lat,
                lng
            }
        });
    }

    changeRender() {
        this.setState({
            render: false
        })
    }

    render() {
        const { currentLocation } = this.state;

        return (
            <div>
                {!this.props.loaded && 'loagind...'}
                {this.props.loaded &&
                    <Map
                        google={this.props.google}
                        onFind={this.handleFind}
                        onDragend={this.handleDragend}
                        mustRender={this.state.render}
                        getLocation={this.getLocation.bind(null, currentLocation, this.state.currentAddress)}
                        getAddress={this.getAddress}
                        changeRender={this.changeRender}
                    />
                }
                <hr />
                <span>lat: </span>
                <input
                    className="lat"
                    type="text"
                    value={currentLocation.lat}
                    onChange={this.handleLatChange}
                    onBlur={this.handleBlur}
                />
                <span style={{marginLeft: '2em'}}>lng: </span>
                <input
                    className="lng"
                    type="text"
                    value={currentLocation.lng}
                    onChange={this.handleLngChange}
                    onBlur={this.handleBlur}
                />
                <button style={{marginLeft: '53em'}} onClick={this.handleSave}>Save local</button>
                <hr/>
                <LocalList locals={this.state.locals} onShowClick={this.handleShowClick} />
            </div>
        );
    }
}

export default GoogleApiComponent({
    apiKey: __GAPI_KEY__
})(MapContainer);

