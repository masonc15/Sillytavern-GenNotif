import { eventSource, event_types } from "../../../script.js";

// Function to show notification
function showNotification(message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification("SillyTavern", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification("SillyTavern", { body: message });
            }
        });
    }
}

// Listen for the message generation end event
eventSource.on(event_types.GENERATION_ENDED, function (data) {
    showNotification("A new message has been generated!");
});

// Initialize the extension
jQuery(async () => {
    console.log("Message Notification extension loaded");
});
