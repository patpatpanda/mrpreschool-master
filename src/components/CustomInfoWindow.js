export class CustomInfoWindow extends google.maps.OverlayView {
  constructor(position, content) {
    super();
    this.position = position;
    this.content = content;
    this.div = null;
  }

  onAdd() {
    
    const panes = this.getPanes();
    panes.floatPane.appendChild(this.div);
  }

  draw() {
    const projection = this.getProjection();
    const position = projection.fromLatLngToDivPixel(this.position);
    if (position && this.div) {
      this.div.style.left = `${position.x}px`;
      this.div.style.top = `${position.y}px`;
    }
  }

  onRemove() {
    if (this.div) {
      this.div.remove();
      this.div = null;
    }
  }

  open(map) {
    this.setMap(map);
  }

  close() {
    this.setMap(null);
  }
}


