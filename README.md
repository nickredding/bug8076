## Created to demonstrate Capacitor bug 8076

This app provides a test case for this bug report.

It posts {number: 1234} via capacitor http. The server responds with the post data received.

For iOS this is number (string) => (string)

That is, the value is sent as an empty string.

For Android this is number (string) => 1234 (string)

That is, the value is sent as the string representation of the number.

### Running this app

To run the app, copy the files and then add Capacitor core, cli and Android/iOS.

