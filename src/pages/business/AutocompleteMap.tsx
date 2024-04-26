import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
    Suggestion,
} from "react-places-autocomplete";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Component } from "react";
import { Divider, IconButton } from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { alpha } from "@mui/system";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

interface LocationSearchInputState {
    address: string;
}

type LocationData = {
    lat: number;
    lng: number;
    address: string;
};

class LocationSearchInput extends Component<object, LocationSearchInputState> {
    constructor(props: object) {
        super(props);
        this.state = { address: "" };
    }

    handleChangeAddress = ({ lat, lng, address }: LocationData): void => {
        const locationData: LocationData = { lat, lng, address };
        const jsonData = JSON.stringify(locationData);
        localStorage.setItem("locationData", jsonData);
    };

    handleChange = (address: string) => {
        this.setState({ address });
    };

    handleSelect = (address: string) => {
        geocodeByAddress(address)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                this.handleChangeAddress({
                    lat: latLng.lat,
                    lng: latLng.lng,
                    address: address,
                });
                this.setState({ address });
            })
            .catch((error) => console.error("Error", error));
    };

    render() {
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}>
                {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                }) => (
                    <>
                        <form className="mt-4 border-black">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <SearchOutlinedIcon
                                        sx={{ color: "#8B8B8B" }}
                                    />
                                </div>
                                <input
                                    {...getInputProps({
                                        placeholder: "Search Places ...",
                                        className: "location-search-input",
                                    })}
                                    value={this.state.address}
                                    type="search"
                                    id="default-search"
                                    style={{ color: "#8B8B8B" }}
                                    className="w-full p-4 border-black ps-10 text-sm border rounded-lg focus:outline-none"
                                    placeholder="Name, street, building ..."
                                />
                                {this.state.address != "" && (
                                    <div
                                        onClick={() => this.handleChange("")}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <CloseOutlinedIcon
                                            sx={{ color: "#8B8B8B" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </form>
                        <div
                            className="flex justify-center mt-2 p-2 rounded-lg gap-2"
                            style={{ backgroundColor: "rgb(2, 8, 115, 0.1)" }}>
                            <div>
                                <MapOutlinedIcon sx={{ color: "#020873" }} />
                            </div>
                            <div
                                className="font-medium"
                                style={{ color: "#020873" }}>
                                Open map
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion: Suggestion) => {
                                    const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";
                                    const style = suggestion.active
                                        ? {
                                              backgroundColor: "#fafafa",
                                              cursor: "pointer",
                                          }
                                        : {
                                              backgroundColor: "#ffffff",
                                              cursor: "pointer",
                                          };
                                    return (
                                        <div
                                            {...getSuggestionItemProps(
                                                suggestion,
                                                {
                                                    className,
                                                    style,
                                                }
                                            )}
                                            key={suggestion.placeId}>
                                            <span key={suggestion.placeId}>
                                                <IconButton
                                                    sx={{
                                                        background: `${alpha(
                                                            "#020873",
                                                            0.1
                                                        )}`,
                                                        mr: "8px",
                                                    }}
                                                    size="small">
                                                    <FmdGoodOutlinedIcon
                                                        sx={{
                                                            color: "#020873",
                                                            width: "20px",
                                                            height: "20px",
                                                        }}
                                                    />
                                                </IconButton>
                                                {suggestion.description}
                                            </span>
                                            <Divider
                                                sx={{
                                                    marginBottom: "16px",
                                                    marginTop: "16px",
                                                    border: `0.5px solid ${alpha(
                                                        "#8B8B8B",
                                                        0.5
                                                    )}`,
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </PlacesAutocomplete>
        );
    }
}

export default LocationSearchInput;
