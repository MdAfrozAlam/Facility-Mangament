/*
 * Reads the user's current coordinates from the browser.
 * Rejects with a user-friendly message when location is unavailable.
 */
export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(
        new Error("Location is not supported by this browser.")
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) =>
        reject(
          new Error(
            error.code === error.PERMISSION_DENIED
              ? "Location access is blocked. Allow location for this site and try again."
              : "Unable to get your location. Please try again."
          )
        ),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
