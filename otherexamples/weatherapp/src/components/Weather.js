import React from "react";

class Weather extends React.Component {
    render() {
        return (
            <div id="weatherSection">

                { this.props.icon && <img src={this.props.icon} /> }

                { this.props.temperatureC && this.props.temperatureF &&
                    <div id="tempSection">
                    <p>{this.props.temperatureC}<sup>°C</sup> | {this.props.temperatureF}<sup>°F</sup></p>
                    </div> }

                { this.props.condition &&
                    <p id="condotionSection"> {this.props.condition}</p> }

                { this.props.city && this.props.country &&
                    <p>{this.props.city}, {this.props.country}</p> }

                { this.props.feelsLikeC && this.props.feelsLikeF &&
                    <div id="feelsLikeSection">Feels like
                        <p>{this.props.feelsLikeC}<sup>°C</sup> | {this.props.feelsLikeF}<sup>°F</sup></p>
                    </div> }

                { this.props.uv && <p>UV: {this.props.uv}</p> }

                { this.props.localDateTime && <p id="timeDate"> {this.props.localDateTime}</p> }

                { this.props.error && <p id="error"> {this.props.error}</p> }
            </div>
        )
    }
}


export default Weather;
