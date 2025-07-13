// LocationPicker.tsx
import React, { useState } from "react";
import MapModal from "./MapModal";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onChangeHandler: (location: Location) => void;
  initialLocation?: Location | null;
  buttonText?: string;
  buttonClassName?: string;
  showDetails?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onChangeHandler,
  initialLocation = null,
  buttonText = "Select Location",
  buttonClassName = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md",
  showDetails = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleLocationSelected = (location: Location) => {
    onChangeHandler(location);
    closeModal();
  };

  return (
    <>
      <button type="button" onClick={openModal} className={buttonClassName}>
        {buttonText}
      </button>
      {showDetails && (
        <p>
          Initial Location:{" "}
          {initialLocation?.lat && initialLocation?.lng
            ? `${initialLocation.lat}, ${initialLocation.lng}`
            : "No location selected"}
        </p>
      )}

      {/* Only render the map component when modal is open */}
      {isOpen && (
        <MapModal
          onClose={closeModal}
          onConfirm={handleLocationSelected}
          initialLocation={initialLocation}
        />
      )}
    </>
  );
};

export default LocationPicker;
