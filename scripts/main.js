var SeamshotWorker = null;
var bspFile = null;
var sarMode = false;

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

var SeamshotWorker = null;
var bspFile = null;
var sarMode = false;

function log(msg) {
    document.querySelector("#log").innerHTML = msg;
}

function sarModechange() {
    sarMode = document.getElementById('sar_mode').checked;
}


function requestBSPFile() {
    if (bspFile == null) {
        bspFile = document.createElement('input');
        bspFile.setAttribute('type', 'file');
        bspFile.setAttribute('accept', ".bsp");
        bspFile.style.display = 'none';
        document.body.appendChild(bspFile);

        bspFile.onchange = () => {
            let name = "Choose a BSP map file."
            if(bspFile.files && bspFile.files[0]){
                name = bspFile.files[0].name;
            }
            document.querySelector("#bspFileInput").value = name;
            document.querySelector("#bspFileLoad").disabled = false;
            
        }
    }
    bspFile.click();
}


function loadFile() {
    if (typeof window.FileReader !== 'function') {
        log("Error: FileReader API isn't supported on this browser.");
        return;
    }

    if (!window.Worker) {
        log("Error: Web Worker isn't supported in this browser.");
        return;
    }

    if (SeamshotWorker != null) {
        log("Error: Web Worker is processing something already.");
        return;
    }

    if (!bspFile || !bspFile.files || !bspFile.files[0]) {
        log("Error: File could not be loaded.");
        return;
    }

    const file = bspFile.files[0]; // Fix: Define the file variable here

    document.querySelector("#bspFileInput").disabled = true;
    document.querySelector("#bspFileLoad").disabled = true;

    let fr = new FileReader();
    fr.onload = function () {
        try {
            SeamshotWorker = new Worker('scripts/seamshot-finder.js');
            SeamshotWorker.onmessage = function (e) {
                try {
                    if (typeof (e.data) == "string") {
                        log(e.data);
                    } else {
                        let filename = file.name.split(".")[0] + "_seams.cfg";
                        outputSeamshotsIntoFile(e.data, filename);
                        SeamshotWorker = null;
                        document.querySelector("#bspFileInput").disabled = false;
                        document.querySelector("#bspFileLoad").disabled = false;
                    }
                } catch (workerError) {
                    log("Error in Web Worker: " + workerError.message);
                }
            };

            SeamshotWorker.onerror = function (workerError) {
                log("Web Worker Error: " + workerError.message);
            };

            SeamshotWorker.postMessage(fr.result);
        } catch (readerError) {
            log("Error initializing Web Worker: " + readerError.message);
        }
    };

    fr.onerror = function () {
        log("Error reading file: " + fr.error.message);
    };

    fr.readAsArrayBuffer(file); // Use the defined file variable
}


function round(num, places) {
    return Math.round((num + Number.EPSILON) * (Math.pow(10, places))) / (Math.pow(10, places))
}


// converts seamshot array into a drawline commands string, then requests download.
function outputSeamshotsIntoFile(seamshots, filename) {
    const MAX_SIZE = 1048576; // TF2 cfg file size limit is 1MB!
    let r = 2;
    let files = [];
    let fileIndex = 1;

    const header =
        "// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
        "// Source drawline is limited to 20 lines at one time\n" +
        "// Bind these aliases to step through batches\n" +
        "bind mwheelup dl_n // next\n" +
        "bind mwheeldown dl_p // prev\n" +
        "alias dl_n drb0\n" +
        "alias dl_p \"\"\n\n\n";

    let output = header; // Start first file with header

    function addFile() {
        let name = filename.replace(/\.cfg$/, "") + (fileIndex > 1 ? `_part${fileIndex}` : "") + ".cfg";
        files.push({ name, content: output });
        fileIndex++;
        output = header; // Start new file with header
    }

    if (sarMode) {
        for (let seamshot of seamshots) {
            let line =
                "sar_drawline "
                + round(seamshot.point1.x, r) + " " + round(seamshot.point1.y, r) + " " + round(seamshot.point1.z, r) + " "
                + round(seamshot.point2.x, r) + " " + round(seamshot.point2.y, r) + " " + round(seamshot.point2.z, r) + " "
                + (seamshot.planenum > 1 ? "0 255 0" : (seamshot.type == 0 ? "255 150 0" : "255 0 0"))
                + "\n";
            if ((output.length + line.length) > MAX_SIZE) addFile();
            output += line;
        }
        sarMode = false;
    }

    if (sarMode == false) {
        for (let i = 0; i * 5 < seamshots.length; i += 1) {
            let aliasLine = "alias drb" + i + " \"";
            for (let j = 0; j < 5 && (i * 5 + j) < seamshots.length; j++) {
                let seamshot = seamshots[i * 5 + j];
                aliasLine += "drawline "
                    + round(seamshot.point1.x, r) + " " + round(seamshot.point1.y, r) + " " + round(seamshot.point1.z, r) + " "
                    + round(seamshot.point2.x, r) + " " + round(seamshot.point2.y, r) + " " + round(seamshot.point2.z, r) + " "
                    + (seamshot.planenum > 1 ? "0 255 0" : (seamshot.type == 0 ? "255 150 0" : "255 0 0"))
                    + "; ";
            }
            if (i !== 0) {
                aliasLine += "alias dl_p drb" + (i - 1) + "; ";
            }
            aliasLine += "alias dl_n drb" + (i + 1) + "; ";
            aliasLine += "\"\n";
            if ((output.length + aliasLine.length) > MAX_SIZE) addFile();
            output += aliasLine;
        }
    }

    // Add the last file if there's any content left (beyond just the header)
    if (output.length > header.length) addFile();

    // Download all files
    for (const file of files) {
        download(file.name, file.content);
    }
}

// download text in a file.
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
