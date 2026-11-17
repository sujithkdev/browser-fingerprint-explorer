// target elements
const commandLine = document.querySelector(".command-line");
const screen = document.querySelector(".screen");
const output = document.querySelector(".output");

function runPrint() {
  const categories = [
    {
      title: "Device Information",
      readings: [
        `<b>Device name:</b> <span data-reading="deviceName"></span>`,
        `<b>Device vendor:</b> ${deviceVendor}`,
        `<b>Device type:</b> ${deviceType}`,
      ],
    },
    {
      title: "Hardware Information",
      readings: [
        `<b>Ram:</b> ${Ram}`,
        `<b>Number of logical processors:</b> ${numCores}`,
        `<b>GPU manufacturer:</b> ${vendor}`,
        `<b>GPU model:</b> ${renderer}`,
      ],
    },
    {
      title: "Operating System Information",
      readings: [
        `<b>Device OS:</b> ${Os}`,
        `<b>OS version:</b> ${OSversion}`,
        `<b>Platform:</b> ${osName}`,
      ],
    },
    {
      title: "Browser Information",
      readings: [
        `<b>Browser name:</b> ${BrowserName}`,
        `<b>Browser version:</b> ${BrowserVersion}`,
        `<b>Browser engine:</b> ${BrowserEngine}`,
        `<b>Browser vendor:</b> ${browserVendor}`,
        `<b>Browser language:</b> ${BrowserLanguage}`,
        `<b>Character encoding:</b> ${acceptCharset}`,
      ],
    },
    {
      title: "Display Information",
      readings: [
        `<b>Screen size:</b> ${ScreenSize}`,
        `<b>Viewport size:</b> ${viewportSize}`,
        `<b>Device pixel ratio:</b> ${devicePixelRatio}`,
        `<b>Color depth:</b> ${colorDepth}`,
        `<b>Device's orientation:</b> ${orientation}`,
        `<b>Font Families:</b> ${allFontFamilies}`,
        `<b>Font Style:</b> ${fontStyle}`,
      ],
    },
    {
      title: "Network Information",
      readings: [
        `<b>Ip address:</b> <span data-reading="Ip"></span>`,
        `<b>Ip version:</b> <span data-reading="ipVersion"></span>`,
        `<b>ISP name:</b> <span data-reading="IPS"></span>`,
        `<b>Autonomous system number:</b> <span data-reading="ASN"></span>`,
        `<b>Network Type:</b> ${networkType}`,
        `<b>Round-trip time (RTT):</b> ${Rtt}`,
        `<b>Internet connection speed:</b> ${ics}`,
        `<b>Network Name:</b> ${networkName}`,
        `<b>Online status:</b> ${onlineStatus}`,
        `<b>Data saver mode:</b> ${dataSaver}`,
        `<b>Maximum available bandwidth:</b> ${maximumBandwidth}`,
      ],
    },
    {
      title: "Location Information",
      readings: [
        `<b>Latitude:</b> <span data-reading="Latitude"></span>`,
        `<b>Longitude:</b> <span data-reading="Longitude"></span>`,
        `<b>City:</b> <span data-reading="City"></span>`,
        `<b>Region/State:</b> <span data-reading="Region"></span>`,
        `<b>Country:</b> <span data-reading="Country"></span>`,
        `<b>Timezone:</b> ${timezone}`,
        `<b>Region/State code:</b> <span data-reading="Regioncode"></span>`,
        `<b>Country code:</b> <span data-reading="Countrycode"></span>`,
        `<b>Capital of the country:</b> <span data-reading="countryCapital"></span>`,
        `<b>Country calling code:</b> <span data-reading="CountryCallingCode"></span>`,
        `<b>Currency:</b> <span data-reading="Currency"></span>`,
        `<b>Languages spoken:</b> <span data-reading="Languages"></span>`,
      ],
    },
    {
      title: "Browser Capabilities",
      readings: [
        `<b>Cookie Enabled:</b> ${cookieEnabled}`,
        `<b>Touch supports:</b> ${touchSupports}`,
        `<b>Browser's maximum touch points:</b> ${maxTouchPoints}`,
        `<b>Available sensors:</b> ${sensorsWithSpace}`,
        `<b>Supported audio formats:</b> ${SupportedAudioFormats}`,
        `<b>Supported video formats:</b> ${supportedVideoFormats}`,
        `<b>Plugin name:</b> ${PluginName}`,
        `<b>Plugin filename:</b> ${PluginFilename}`,
        `<b>Speech recognition support:</b> ${speechRecognitionSupport}`,
        `<b>WebGL vendor:</b> ${WebGLVendor}`,
        `<b>WebGL renderer:</b> ${WebGLRenderer}`,
        `<b>WebGL version:</b> ${WebGLVersion}`,
        `<b>VR display support:</b> ${vrDisplaySupport}`,
        `<b>Virtual keyboard support:</b> ${virtualKeyboardSupport}`,
        `<b>Do Not Track:</b> ${dntEnabled}`,
        `<b>Ad block enabled:</b> <span data-reading="Adblock"></span>`,
      ],
    },
    {
      title: "User Activity Information",
      readings: [
        `<b>Mouse X:</b> <span id="mouseXValue">${MouseX}</span>`,
        `<b>Mouse Y:</b> <span id="mouseYValue">${MouseY}</span>`,
        `<b>Clicked on:</b> <span id="Clicked-element">${Clickedelement}</span>`,
        `<b>Input Text:</b> <span id="typed-Text">null</span>`,
        `<b>Input Activity:</b> <span id="input-Activity">null</span>`,
        `<b>Visit on site:</b> ${visit}`,
        `<b>Referrer information:</b> ${referrer}`,
        `<b>Referrer source:</b> ${referrerSource}`,
        `<b>Fingers use to touch the screen:</b> <span id="fingers-Touched">${fingersTouch}</span>`,
      ],
    },
    {
      title: "System & Session Information",
      readings: [
        `<b>Battery level:</b> <span data-reading="BatteryLevel"></span>`,
        `<b>Charging status:</b> <span data-reading="ChargingStatus"></span>`,
        `<b>Time:</b> <span id="current-Time">${currentTime}</span>`,
        `<b>Frame rate:</b> <span id="frame-count">${frameRate}</span>`,
        `<b>Memory used by javascript:</b> ${Memoryused}`,
        `<b>Total javascript heap:</b> ${Memorytotal}`,
        `<b>User prefers:</b> ${UserPrefers}`,
        `<b>URL:</b> ${siteURL}`,
        `<b>Host name:</b> ${hostName}`,
        `<b>Page load time:</b> ${PageLoadTime}`,
      ],
    },
  ];

  for (const [index, category] of categories.entries()) {
    const section = document.createElement("section");
    const heading = document.createElement("h2");
    heading.className = "category-heading";
    heading.textContent = (index + 1) + ". " + category.title;
    section.appendChild(heading);
    for (const html of category.readings) {
      const div = document.createElement("div");
      div.innerHTML = html;
      section.appendChild(div);
    }
    output.appendChild(section);
  }
  refreshReadings();
  runCommand();
}

document.addEventListener("DOMContentLoaded", runPrint, { once: true });





