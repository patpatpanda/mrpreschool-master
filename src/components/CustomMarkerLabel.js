function CustomMarkerLabel(map, position, labelText) {
  this.position = position;
  this.labelText = labelText;

  // Skapa ett div-element för etiketten
  const labelDiv = document.createElement('div');
  labelDiv.style.position = 'absolute';
  labelDiv.style.backgroundColor = '#ffffff'; // Vit bakgrund för texten
  labelDiv.style.color = '#333'; // Textfärg
  labelDiv.style.fontSize = '16px'; // Textstorlek
  labelDiv.style.fontFamily = 'Roboto, Arial, sans-serif'; // Typsnitt
  labelDiv.style.padding = '4px 8px'; // Padding runt texten
  labelDiv.style.borderRadius = '4px'; // Rundade hörn
  labelDiv.style.border = '1px solid #333'; // Kantlinje
  labelDiv.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)'; // Liten skugga
  labelDiv.style.textShadow = '2px 2px 4px #ffffff'; // Textskugga
  labelDiv.innerHTML = labelText;

  // Koppla elementet till Google Maps-overlay
  this.div = labelDiv;
  this.setMap(map);
}

CustomMarkerLabel.prototype = new google.maps.OverlayView();

CustomMarkerLabel.prototype.onAdd = function() {
  const panes = this.getPanes();
  panes.overlayImage.appendChild(this.div);
};

CustomMarkerLabel.prototype.draw = function() {
  const overlayProjection = this.getProjection();
  const position = overlayProjection.fromLatLngToDivPixel(this.position);

  // Positionera etiketten korrekt på kartan
  const div = this.div;
  div.style.left = position.x + 'px';
  div.style.top = position.y + 'px';
};

CustomMarkerLabel.prototype.onRemove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};
