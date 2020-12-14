const maxApi = require('max-api-or-not')

if (typeof TextEncoder === 'undefined' && typeof TextDecoder === 'undefined') {

    const encoding = require('text-encoding'); // polyfill

    global.TextEncoder = encoding.TextEncoder;

    global.TextDecoder = encoding.TextDecoder;

}


const { MUSE_SERVICE, MuseClient, zipSamples, channelNames } = require('muse-js');
const noble = require('noble');
const bleat = require('bleat').webbluetooth;


noble.stopScanning();

async function connect() {
    let device = await bleat.requestDevice({
        filters: [{ services: [MUSE_SERVICE] }]
    });
    const gatt = await device.gatt.connect();
    maxApi.post('Device name:', gatt.device.name);

    const client = new MuseClient();
    await client.connect(gatt);

    await client.start();
    maxApi.post('Connected!');
    client.eegReadings.subscribe(reading => {
        maxApi.outlet(reading);
      });
	//client.telemetryReadings.subscribe(reading => maxApi.outlet(reading));
	//client.eegReadings.subscribe(reading => maxApi.outlet(reading));
}

noble.on('stateChange', (state) => {
	console.log(state);
    if (state === 'poweredOn') {
		console.log("Attempting to connect")
        connect();
    }
});;