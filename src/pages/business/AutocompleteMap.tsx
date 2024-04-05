import React, { useEffect, useRef } from "react";

const AutocompleteMap: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const google = window.google;
        if (!google) {
            console.error("Google Maps API not loaded");
            return;
        }

        const map = new google.maps.Map(mapRef.current!, {
            center: { lat: 40.749933, lng: -73.98633 },
            zoom: 13,
            mapTypeControl: false,
        });

        const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current!,
            {
                fields: ["formatted_address", "geometry", "name"],
                strictBounds: false,
            }
        );

        autocomplete.bindTo("bounds", map);

        const infowindow = new google.maps.InfoWindow();
        const infowindowContent =
            document.getElementById("infowindow-content")!;
        infowindow.setContent(infowindowContent);

        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
        });

        autocomplete.addListener("place_changed", () => {
            infowindow.close();
            marker.setVisible(false);

            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                window.alert(`No details available for input: '${place.name}'`);
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            infowindowContent.querySelector("#place-name")!.textContent =
                place.name ?? "";
            infowindowContent.querySelector("#place-address")!.textContent =
                place.formatted_address ?? "";
            infowindow.open(map, marker);
        });

        const biasInputElement = document.getElementById(
            "use-location-bias"
        ) as HTMLInputElement;
        biasInputElement.addEventListener("change", () => {
            if (biasInputElement.checked) {
                autocomplete.bindTo("bounds", map);
            } else {
                autocomplete.unbind("bounds");
                autocomplete.setBounds({
                    east: 180,
                    west: -180,
                    north: 90,
                    south: -90,
                });
                (
                    document.getElementById(
                        "use-strict-bounds"
                    ) as HTMLInputElement
                ).checked = biasInputElement.checked;
            }

            inputRef.current!.value = "";
        });

        const strictBoundsInputElement = document.getElementById(
            "use-strict-bounds"
        ) as HTMLInputElement;
        strictBoundsInputElement.addEventListener("change", () => {
            autocomplete.setOptions({
                strictBounds: strictBoundsInputElement.checked,
            });
            if (strictBoundsInputElement.checked) {
                biasInputElement.checked = strictBoundsInputElement.checked;
                autocomplete.bindTo("bounds", map);
            }

            inputRef.current!.value = "";
        });
    }, []);

    return (
        <div>
            <div className="pac-card" id="pac-card">
                <div>
                    <div id="title">Autocomplete search</div>
                    <div id="type-selector" className="pac-controls">
                        <input
                            type="radio"
                            name="type"
                            id="changetype-all"
                            defaultChecked
                        />
                        <label htmlFor="changetype-all">All</label>
                        <input
                            type="radio"
                            name="type"
                            id="changetype-establishment"
                        />
                        <label htmlFor="changetype-establishment">
                            establishment
                        </label>
                        <input
                            type="radio"
                            name="type"
                            id="changetype-address"
                        />
                        <label htmlFor="changetype-address">address</label>
                        <input
                            type="radio"
                            name="type"
                            id="changetype-geocode"
                        />
                        <label htmlFor="changetype-geocode">geocode</label>
                        <input
                            type="radio"
                            name="type"
                            id="changetype-cities"
                        />
                        <label htmlFor="changetype-cities">(cities)</label>
                        <input
                            type="radio"
                            name="type"
                            id="changetype-regions"
                        />
                        <label htmlFor="changetype-regions">(regions)</label>
                    </div>
                    <br />
                    <div id="strict-bounds-selector" className="pac-controls">
                        <input
                            type="checkbox"
                            id="use-location-bias"
                            defaultChecked
                        />
                        <label htmlFor="use-location-bias">
                            Bias to map viewport
                        </label>
                        <input type="checkbox" id="use-strict-bounds" />
                        <label htmlFor="use-strict-bounds">Strict bounds</label>
                    </div>
                </div>
                <div id="pac-container">
                    <input
                        ref={inputRef}
                        id="pac-input"
                        type="text"
                        placeholder="Enter a location"
                    />
                </div>
            </div>
            <div ref={mapRef} id="map" style={{ height: "500px" }}></div>
            <div id="infowindow-content">
                <span id="place-name" className="title"></span>
                <br />
                <span id="place-address"></span>
            </div>
        </div>
    );
};

export default AutocompleteMap;
