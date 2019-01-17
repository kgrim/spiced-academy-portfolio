import React from "react";

import Form from "./components/Form";
import Weather from "./components/Weather";

const apiKey = "3c0082f27441477b879131530191601";



class App extends React.Component {
    state = {
            condition: undefined,
            icon: undefined,
            temperatureC: undefined,
            temperatureF: undefined,
            feelsLikeC: undefined,
            feelsLikeF: undefined,
            uv: undefined,
            city: undefined,
            country: undefined,
            localDateTime: undefined,
            error: undefined
    }
    getWeather = async e => {
        e.preventDefault();
        const city = e.target.elements.city.value;
        const apiCall = await fetch(`http://api.apixu.com/v1/current.json?key=${apiKey}&q=${city}`)
        const data = await apiCall.json();
        console.log(data);
        if (data.current) {
            this.setState({
                condition: data.current.condition.text,
                icon: data.current.condition.icon,
                temperatureC: data.current.temp_c,
                temperatureF: data.current.temp_f,
                feelsLikeC: data.current.feelslike_c,
                feelsLikeF: data.current.feelslike_f,
                uv: data.current.uv,
                city: data.location.name,
                country: data.location.country,
                localDateTime: data.location.localtime,
                error: ""
            });
        } else {
            this.setState({
                condition: undefined,
                icon: undefined,
                temperatureC: undefined,
                temperatureF: undefined,
                feelsLikeC: undefined,
                feelsLikeF: undefined,
                uv: undefined,
                city: undefined,
                country: undefined,
                localDateTime: undefined,
                error: "Please check the city!"
            })
        }
    }
    render() {
        return (
            <div>

                <Form getWeather={this.getWeather}/>

                <Weather condition={this.state.condition}
                icon={this.state.icon}
                temperatureC={this.state.temperatureC}
                temperatureF={this.state.temperatureF}
                feelsLikeC={this.state.feelsLikeC}
                feelsLikeF={this.state.feelsLikeF}
                uv={this.state.uv}
                error={this.state.error}
                city={this.state.city}
                country={this.state.country}
                localDateTime={this.state.localDateTime}
                error={this.state.error}
                />

            </div>
        );
    }
}



export default App;
