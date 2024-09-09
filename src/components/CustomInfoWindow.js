export class CustomInfoWindow extends google.maps.OverlayView {
  constructor(position, content) {
    super();
    this.position = position;
    this.content = content;
    this.div = null;
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.backgroundColor = 'white';
    this.div.style.padding = '10px';
    this.div.style.borderRadius = '5px';
    this.div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    this.div.style.transform = 'translate(-50%, -100%)';
    this.div.style.whiteSpace = 'nowrap';
    this.div.innerHTML = this.content;

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


