
const VAPID_PUBLIC_KEY =
  "BBd_sVl5SW-RLeEKwiJ5JIAfWtNboUj5P8OscRWttY36le9wr-CF3SCzwp35dGO8cYkmIhz1JZwfCPwR9SO7HW4";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported by this browser.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  return subscription.toJSON();
}


export async function enablePushNotifications() {
  const subscription = await subscribeToPushNotifications();

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in before enabling notifications.");
  }

  const response = await fetch("http://localhost:5000/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subscription }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to enable notifications.");
  }

  return data;
}

