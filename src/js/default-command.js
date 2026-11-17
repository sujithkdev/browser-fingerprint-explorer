var Latitude, Longitude;
let activeDemo;
let generation = 0;

function addText(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function runCommand() {
  const line = document.createElement("div");
  line.className = "command-line";
  line.innerHTML = '<span class="prompt"><b>root@koko:</b>~</span><input type="text" class="command" aria-label="Terminal command" placeholder="type help" autocomplete="off">';
  output.appendChild(line);
  const input = line.querySelector("input");
  input.addEventListener("input", inputData);
  input.focus();
  screen.scrollTop = output.scrollHeight;
}

function stopDemo() {
  generation++;
  if (activeDemo) activeDemo();
}

async function preview(kind, panel) {
  stopDemo();
  if (kind === "screen" && !window.isSecureContext) {
    panel.textContent = "Open the app on localhost or HTTPS, then enter screen again.";
    return;
  }
  if (kind === "screen" && !navigator.mediaDevices?.getDisplayMedia) {
    panel.textContent = "Screen sharing is unavailable in this browser. Try a desktop browser.";
    return;
  }
  const token = generation;
  const status = addText(panel, "p", "Waiting for browser permission…");
  const button = addText(panel, "button", "Stop " + kind);
  let stream, context, frame;
  function stop() {
    if (activeDemo !== stop) return;
    activeDemo = undefined;
    generation++;
    stream?.getTracks().forEach(track => track.stop());
    if (context) context.close().catch(() => {});
    cancelAnimationFrame(frame);
    panel.querySelector("video")?.remove();
    panel.querySelector("meter")?.remove();
    button.remove();
    status.textContent = "Preview stopped.";
  }
  activeDemo = stop;
  button.onclick = stop;
  if (kind === "screen") {
    status.textContent = "Choose a tab, window, or screen in the browser picker and select Share.";
  }
  try {
    if (kind === "screen") {
      stream = await navigator.mediaDevices.getDisplayMedia({video:true, audio:false});
    } else {
      stream = await navigator.mediaDevices.getUserMedia({video:kind === "camera", audio:kind === "microphone"});
    }
    if (token !== generation) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    for (const track of stream.getTracks()) track.addEventListener("ended", stop, {once:true});
    status.textContent = "Local preview active.";
    if (kind === "microphone") {
      context = new AudioContext();
      const analyser = context.createAnalyser();
      context.createMediaStreamSource(stream).connect(analyser);
      const meter = addText(panel, "meter", "");
      meter.setAttribute("aria-label", "Microphone level");
      const samples = new Uint8Array(analyser.fftSize);
      await context.resume();
      function draw() {
        if (token !== generation) return;
        analyser.getByteTimeDomainData(samples);
        meter.value = samples.reduce((peak, sample) => Math.max(peak, Math.abs(sample - 128)), 0) / 128;
        frame = requestAnimationFrame(draw);
      }
      draw();
    } else {
      const video = addText(panel, "video", "");
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await video.play();
      if (kind === "screen" && token === generation) {
        const track = stream.getVideoTracks()[0];
        const surface = track?.getSettings?.().displaySurface;
        const label = {browser:"tab", window:"window", monitor:"screen"}[surface] || "screen";
        status.textContent = "Live " + label + " preview. Use Stop screen or the browser’s Stop sharing control to end it.";
        screen.scrollTop = output.scrollHeight;
      }
    }
  } catch (error) {
    if (token !== generation) return;
    stop();
    if (kind === "screen") {
      const reasons = {
        NotAllowedError: "Screen sharing was canceled or blocked.",
        NotReadableError: "This screen could not be captured. Check your system screen-sharing settings or choose another source.",
        InvalidStateError: "Focus the terminal and enter screen again to open the picker.",
        NotFoundError: "No screen or window is available to share."
      };
      status.textContent = reasons[error.name] || "Screen preview could not start (" + error.name + ").";
      return;
    }
    status.textContent = kind + " unavailable or permission declined (" + error.name + ").";
  }
}

function showCoordinates(panel, lat, lon) {
  if (!panel.isConnected) return;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    panel.textContent = "Coordinates unavailable.";
    return;
  }
  addText(panel, "div", "Latitude: " + lat + "°");
  addText(panel, "div", "Longitude: " + lon + "°");
}

const commands = {
  help: ["List every command", panel => {
    for (const [name, [description]] of Object.entries(commands)) addText(panel, "div", name + " — " + description);
  }],
  permissions: ["Show browser permission states without requesting access", async panel => {
    for (const name of ["geolocation","camera","microphone","display-capture","notifications","clipboard-read","clipboard-write"]) {
      let state = "Status unavailable";
      try {
        const permission = await navigator.permissions.query({name});
        state = {granted:"Allowed", denied:"Blocked", prompt:"Ask"}[permission.state] || state;
      } catch {}
      addText(panel, "div", name + " — " + state);
    }
  }],
  location: ["Request high-accuracy device latitude and longitude", async panel => {
    if (!navigator.geolocation) {
      panel.textContent = "Device location unavailable in this browser. Open the app on localhost or HTTPS.";
      return;
    }
    panel.textContent = "Requesting device location…";
    let position;
    try {
      position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, maximumAge: 0, timeout: 30000
        })
      );
    } catch (error) {
      const messages = {
        1: "Location access blocked. Check location permissions for this site and device, then enter location again.",
        2: "Device position unavailable. Check device location services, then try again.",
        3: "Location request timed out. Enter location to retry."
      };
      panel.textContent = messages[error.code] || "Could not obtain device coordinates.";
      return;
    }
    panel.replaceChildren();
    showCoordinates(panel, position.coords.latitude, position.coords.longitude);
  }],
  "ip location": ["Show approximate IP coordinates", panel => showCoordinates(panel, Latitude, Longitude)],
  camera: ["Request a local camera preview", panel => preview("camera", panel)],
  microphone: ["Request a local microphone level meter", panel => preview("microphone", panel)],
  screen: ["Choose a tab, window, or screen for local preview", panel => preview("screen", panel)],
  stop: ["End the active or pending media preview", panel => {stopDemo(); panel.textContent = "Media previews stopped."; }],
  notifications: ["Request notifications and show one test notification", async panel => {
    const state = await Notification.requestPermission();
    if (state === "granted") new Notification("Browser Fingerprint Explorer", {body:"Your test notification."});
    panel.textContent = "Notification permission: " + state;
  }],
  "clipboard write": ["Copy the sample text “Browser Fingerprint Explorer”", async panel => {
    await navigator.clipboard.writeText("Browser Fingerprint Explorer");
    panel.textContent = "Copied “Browser Fingerprint Explorer”. Enter clipboard read to display it.";
  }],
  "clipboard read": ["Display your current clipboard text. Try clipboard write first.", async panel => {
    const value = await navigator.clipboard.readText();
    panel.style.whiteSpace = "pre-wrap";
    panel.textContent = panel.isConnected ? value || "(Clipboard contains no text)" : "";
  }],
  df: ["Explain browser fingerprinting", panel => {panel.textContent = "Browser fingerprinting combines browser and device readings to help distinguish visits."; }],
  "pip install df": ["Display the fingerprint report again", () => runPrint()],
  clear: ["Stop previews and clear the terminal", () => {
    stopDemo();
    output.replaceChildren();
  }]
};

output.addEventListener("keydown", event => {
  const input = event.target;
  if (event.key !== "Enter" || !input.classList.contains("command") || input.disabled) return;
  event.preventDefault();
  input.disabled = true;
  const name = input.value.toLowerCase().trim();
  const panel = addText(output, "div", "");
  panel.className = "command-result";
  if (Object.hasOwn(commands, name)) {
    try {
      Promise.resolve(commands[name][1](panel)).catch(error => {
        panel.textContent = "Request unavailable or declined. " + error.message;
      });
    } catch (error) { panel.textContent = "Request unavailable. " + error.message; }
  } else panel.textContent = "Unknown command. Type help to list commands.";
  if (name !== "pip install df") runCommand();
});
window.addEventListener("pagehide", stopDemo);
// Browser title change on tab change
let docTitle = document.title;
window.addEventListener("blur", () => {
  document.title = "Come back :(";
});
window.addEventListener("focus", () => {
  document.title = docTitle;
});
