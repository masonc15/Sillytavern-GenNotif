// GenNotif extension for SillyTavern
import { extension_settings, getContext } from "../../../extensions.js";
import { eventSource, event_types } from "../../../../script.js";

const extensionName = "GenNotif";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
let notificationSound = null;

// Default settings
const defaultSettings = {
    enabled: true,
    playSound: false,
};

function loadSettings() {
    // Initialize settings
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
    
    $('#gennotif_enabled').prop('checked', extension_settings[extensionName].enabled);
    $('#gennotif_sound').prop('checked', extension_settings[extensionName].playSound);
}

function showNotification(message) {
    if (!extension_settings[extensionName].enabled) return;

    if ("Notification" in window) {
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

    if (extension_settings[extensionName].playSound && notificationSound) {
        notificationSound.play();
    }
}

function onSettingsChange() {
    extension_settings[extensionName].enabled = $('#gennotif_enabled').prop('checked');
    extension_settings[extensionName].playSound = $('#gennotif_sound').prop('checked');
}

// This function is called when the extension is loaded
jQuery(async () => {
    const settingsHtml = `
    <div class="gennotif-settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>GenNotif</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <label class="checkbox_label">
                    <input id="gennotif_enabled" type="checkbox" />
                    Enable notifications
                </label>
                <label class="checkbox_label">
                    <input id="gennotif_sound" type="checkbox" />
                    Play sound
                </label>
            </div>
        </div>
    </div>`;

    $('#extensions_settings2').append(settingsHtml);
    
    $('#gennotif_enabled, #gennotif_sound').on('change', onSettingsChange);

    loadSettings();
    
    // Load notification sound
    notificationSound = new Audio(`${extensionFolderPath}/notification.mp3`);

    // Listen for the message generation end event
    eventSource.on(event_types.GENERATION_ENDED, function (data) {
        showNotification("A new message has been generated!");
    });
});
