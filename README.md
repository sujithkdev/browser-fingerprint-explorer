# Browser Fingerprint Explorer

A hands-on privacy awareness project. Open the terminal-style page to see which details your browser exposes, which details the page estimates, and which actions involve another service or a browser permission.

## Try it locally

Download or clone this repository and open index.html in a browser. The project uses HTML, CSS, and JavaScript and has no build step. An internet connection is required for the IP lookup, hosted fonts, and map resources. Browser support and privacy settings affect the results.

For a local web server, run the following from the repository directory if Python is installed, then open http://localhost:8000.

    python -m http.server 8000 --bind 127.0.0.1

## Read the report

| Section | Examples | How to interpret it |
| --- | --- | --- |
| Device Information | Model, vendor, device type | Browser hints and identification-string estimates can be generic. |
| Hardware Information | RAM, processor count, GPU | These are the values exposed to the page. Actual hardware specifications can differ. |
| Operating System Information | OS, version, platform | Platform strings and version guesses can be ambiguous. Device OS and platform currently use the same browser value. |
| Browser Information | Browser, engine, language | Names and versions are inferred from browser strings. Browser language describes a setting. |
| Display Information | Screen, viewport, pixel ratio | Screen dimensions and the area available to the page are separate measurements. |
| Network Information | Public IP, provider, latency, speed | IP metadata comes from an external lookup. Connection speed is a browser estimate. The Network Name field displays the effective connection class. |
| Location Information | City, coordinates, country, time zone | The IP lookup estimates a network location. Currency and languages describe the estimated country. The time zone comes from the browser. |
| Browser Capabilities | Touch, media formats, sensors, plugins | An exposed interface indicates browser support. It does not establish that a sensor is active. |
| User Activity Information | Pointer, clicks, terminal input, previous visit | Events are observed on this page. Previous visit uses timestamps saved by this project in local browser storage. |
| System & Session Information | Battery, current time, frame rate, memory | These readings describe the current session. Some vary over time or are unavailable. |

## What happens when you open the page?

- JavaScript reads browser properties and displays the report in the page. Many display, language, and capability readings are available without a permission prompt.
- The page automatically requests network information from ipapi.co. The service receives the public IP used for that request and returns an approximate location and network metadata. A VPN or mobile network can change the result.
- When the terminal prompt starts, the app separately requests device location through the browser. Your browser controls permission and may remember an earlier choice. Denying this request still allows the IP-based estimate. The location command uses the available coordinates and requests map tiles from OpenStreetMap.
- The page loads fonts from Google Fonts and map software from a CDN. Opening the HTML file locally can still initiate these network requests.
- Terminal input activity is displayed locally. Visit timestamps use the visitTimes key in local storage. Clearing this site's browser data removes those timestamps. The project has no application backend for receiving complete reports.

## Two experiments

1. Record the screen and viewport sizes. Resize the browser window and reload. Compare both readings to see which measurement follows the window.
2. Deny device location when asked and inspect the city field. If the IP lookup succeeds, a city estimate can still appear because it comes from the network lookup.

## Terminal commands

| Command | Action |
| --- | --- |
| help | List commands. |
| df | Explain the demonstration. |
| pip install df | Display the report again. This is a simulated terminal command. |
| location | Show the available coordinates on a map. |
| clear | Clear the terminal display. Saved visit timestamps persist. |

## What is browser fingerprinting?

Fingerprinting combines observations such as language, screen dimensions, and graphics information to help distinguish browsers. Many people share individual values, and some readings change across visits. This project displays potential fingerprinting signals. It does not calculate a uniqueness score or establish anyone's identity.

## Credits and license

Adapted from [Digital Fingerprint by Rakesh Chowdhury](https://github.com/rakeshid03/digital-fingerprint). This edition organizes the report into ten categories and customizes the terminal presentation. The original copyright notice is included in the [MIT license](LICENSE).
