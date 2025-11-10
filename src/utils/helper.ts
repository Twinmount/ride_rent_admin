export const generateWhatsappUrl = (vehicle: {
  whatsappPhone: string | undefined | null;
  whatsappCountryCode: string | undefined | null;
  model: string;
  vehicleDetailsPageLink: string;
}): string | null => {
  console.log("vehicle: ", vehicle);

  if (!vehicle.whatsappPhone) {
    return null;
  }

  const whatsappPageLink = `https://ride.rent/${vehicle.vehicleDetailsPageLink}`;
  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${vehicle.model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${vehicle.whatsappPhone}?text=${encodedMessage}`;
};
