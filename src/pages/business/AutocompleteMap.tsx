import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
    Suggestion,
} from "react-places-autocomplete";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Component } from "react";

interface LocationSearchInputState {
    address: string;
}

class LocationSearchInput extends Component<object, LocationSearchInputState> {
    constructor(props: object) {
        super(props);
        this.state = { address: "" };
    }

    handleChange = (address: string) => {
        this.setState({ address });
    };

    handleSelect = (address: string) => {
        geocodeByAddress(address)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                console.log("Success", latLng);
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
                            </div>
                        </form>
                        <div>
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
                                                {suggestion.description}
                                            </span>
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
