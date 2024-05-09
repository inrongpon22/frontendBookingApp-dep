import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
    Suggestion,
} from "react-places-autocomplete";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Divider, IconButton } from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { alpha } from "@mui/system";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import { ILocation } from "./interfaces/business";
import { useTranslation } from "react-i18next";

type LocationData = {
    lat: number;
    lng: number;
    address: string;
};

interface IParameter {
    handleChangeLocation: (inputData: ILocation) => void;
    oldAddress?: string;
}

export default function SearchMap(props: IParameter) {
    const { t } = useTranslation();
    const [address, setAddress] = useState(props.oldAddress ?? "");

    const handleChangeAddress = ({ lat, lng, address }: LocationData): void => {
        const locationData: LocationData = { lat, lng, address };
        props.handleChangeLocation(locationData);
    };

    const handleChange = (address: string) => {
        setAddress(address);
    };

    const handleSelect = (address: string) => {
        geocodeByAddress(address)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                handleChangeAddress({
                    lat: latLng.lat,
                    lng: latLng.lng,
                    address: address,
                });
                setAddress(address);
            })
            .catch((error) => console.error("Error", error));
    };

    return (
        <div>
            <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}>
                {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                }) => (
                    <>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <SearchOutlinedIcon sx={{ color: "#8B8B8B" }} />
                            </div>
                            <input
                                {...getInputProps({
                                    placeholder: "Search Places ...",
                                    className: "location-search-input",
                                })}
                                value={address}
                                type="search"
                                id="default-search"
                                style={{
                                    borderColor: `${alpha("#000000", 0.2)}`,
                                }}
                                className="ps-10 mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                                placeholder={t("placeholder:location")}
                            />
                            {/* {address != "" && (
                <div
                  onClick={() => handleChange("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                >
                  <CloseOutlinedIcon sx={{ color: "#8B8B8B" }} />
                </div>
              )} */}
                        </div>
                        {/* <div
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
                        </div> */}
                        <div className="mt-2">
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
        </div>
    );
}
