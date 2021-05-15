const credential = 'Ap0AObt84NcDaUThCeWOj52ZqUHv6k4TJhjLibR-DghC-semgoj-0uPbIi8r0E4j';
function GetMap() {
  var navigationBarMode = Microsoft.Maps.NavigationBarMode;
  const map = new Microsoft.Maps.Map('#myMap', {
    center: new Microsoft.Maps.Location(13.785946117539993, -89.00934191406253),
    // navigationBarMode: navigationBarMode.square,
    navigationBarMode: navigationBarMode.compact,
    supportedMapTypes: [
      Microsoft.Maps.MapTypeId.road,
      Microsoft.Maps.MapTypeId.aerial,
      Microsoft.Maps.MapTypeId.grayscale,
      Microsoft.Maps.MapTypeId.canvasDark,
      Microsoft.Maps.MapTypeId.canvasLight,
    ],
    zoom: 9,
  });

  Microsoft.Maps.Events.addHandler(map, 'click', function (event) {
    // map.entities.pop();
    map.entities.clear();
    const {
      location: { latitude, longitude },
    } = event;
    const pin = new Microsoft.Maps.Pushpin(
      { latitude, longitude },
      {
        color: 'red',
        icon: 'https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png',
      }
    );
    map.entities.push(pin);
    // map.setView({ center: { latitude, longitude }, zoom: 11 });
  });
}
