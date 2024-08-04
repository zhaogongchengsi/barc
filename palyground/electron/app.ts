import { app, BrowserWindow } from 'electron';

function createWindow() {
	// Create the browser window
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// Load your HTML file
	mainWindow.loadFile('index.html');

	// Open DevTools (optional)
	mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

console.log({
	__DEV__: __DEV__,
	__TEST__: __TEST__,
	__PROD__: __PROD__,
})