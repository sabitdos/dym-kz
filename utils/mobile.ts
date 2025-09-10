import { Capacitor } from "@capacitor/core"
import { PushNotifications } from "@capacitor/push-notifications"
import { Geolocation } from "@capacitor/geolocation"
import { Camera, CameraResultType } from "@capacitor/camera"

export const isMobile = () => Capacitor.isNativePlatform()

export const initializePushNotifications = async () => {
  if (!isMobile()) return

  // Request permission
  const permission = await PushNotifications.requestPermissions()

  if (permission.receive === "granted") {
    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register()
  }

  // Listen for registration
  PushNotifications.addListener("registration", (token) => {
    console.log("Push registration success, token: " + token.value)
    // Send token to your server
  })

  // Listen for push notifications
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Push received: ", notification)
  })
}

export const getCurrentLocation = async () => {
  if (!isMobile()) {
    // Fallback to web geolocation
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  const coordinates = await Geolocation.getCurrentPosition()
  return coordinates
}

export const takePicture = async () => {
  if (!isMobile()) return null

  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
  })

  return image.webPath
}
