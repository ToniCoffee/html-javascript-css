// Rotacion Pieza L
const rotationLPiece = {
  rotationLeft: {
    zero: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: 40, y4: 0 },
    noventa: {x1: 20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: 0, y4: 40 },
    cientoOchenta: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: -40, y4: 0 },
    doscientosSetenta: {x1: -20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 0, y4: -40 }
  },
  rotationRight: {
    zero: {x1: 20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: 0, y4: 40 },
    noventa: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: -40, y4: 0 },
    cientoOchenta: {x1: -20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 0, y4: -40 },
    doscientosSetenta: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: 40, y4: 0 }
  }
};

// Rotacion Pieza L Invertida
const rotationInvertedLPiece = {
  rotationLeft: {
    zero: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: 0, y4: 40 },
    noventa: {x1: 20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: -40, y4: 0 },
    cientoOchenta: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: 0, y4: -40 },
    doscientosSetenta: {x1: -20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 40, y4: 0 }
  },
  rotationRight: {
    zero: {x1: 20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: -40, y4: 0 },
    noventa: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: 0, y4: -40 },
    cientoOchenta: {x1: -20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 40, y4: 0 },
    doscientosSetenta: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: 0, y4: 40 }
  }
};

// Rotacion Pieza Cuadrado Invertida
const rotationSquarePiece = {
  rotationLeft: {
    zero: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 },
    noventa: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 },
    cientoOchenta: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 },
    doscientosSetenta: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 }
  },
  rotationRight: {
    zero: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 },
    noventa: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 },
    cientoOchenta: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 },
    doscientosSetenta: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0 }
  }
};

// Rotacion Pieza I
const rotationIPiece = {
  rotationLeft: {
    zero: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: 40, y4: 40 },
    noventa: {x1: 20, y1: -40, x2: 0, y2: -20, x3: -20, y3: 0, x4: -40, y4: 20 },
    cientoOchenta: {x1: 40, y1: 40, x2: 20, y2: 20, x3: 0, y3: 0, x4: -20, y4: -20 },
    doscientosSetenta: {x1: -40, y1: 20, x2: -20, y2: 0, x3: 0, y3: -20, x4: 20, y4: -40 }
  },
  rotationRight: {
    zero: {x1: 40, y1: -20, x2: 20, y2: 0, x3: 0, y3: 20, x4: -20, y4: 40 },
    noventa: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: -40, y4: -40 },
    cientoOchenta: {x1: -20, y1: 40, x2: 0, y2: 20, x3: 20, y3: 0, x4: 40, y4: -20 },
    doscientosSetenta: {x1: -40, y1: -40, x2: -20, y2: -20, x3: 0, y3: 0, x4: 20, y4: 20 }
  }
};

// Rotacion Pieza Z
const rotationZPiece = {
  rotationLeft: {
    zero: {x1: -20, y1: 0, x2: 0, y2: -20, x3: 20, y3: 0, x4: 40, y4: -20 },
    noventa: {x1: -20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: 0, y4: 40 },
    cientoOchenta: {x1: 40, y1: -20, x2: 20, y2: 0, x3: 0, y3: -20, x4: -20, y4: 0 },
    doscientosSetenta: {x1: 0, y1: 40, x2: -20, y2: 20, x3: 0, y3: 0, x4: -20, y4: -20 }
  },
  rotationRight: {
    zero: {x1: 0, y1: -40, x2: 20, y2: -20, x3: 0, y3: 0, x4: 20, y4: 20 },
    noventa: {x1: 20, y1: 0, x2: 0, y2: 20, x3: -20, y3: 0, x4: -40, y4: 20 },
    cientoOchenta: {x1: 20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 0, y4: -40 },
    doscientosSetenta: {x1: -40, y1: 20, x2: -20, y2: 0, x3: 0, y3: 20, x4: 20, y4: 0 }
  }
};

// Rotacion Pieza Z Invertida
const rotationInvertedZPiece = {
  rotationLeft: {
    zero: {x1: -20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: 0, y4: -40 },
    noventa: {x1: -20, y1: 0, x2: 0, y2: 20, x3: 20, y3: 0, x4: 40, y4: 20 },
    cientoOchenta: {x1: 0, y1: -40, x2: -20, y2: -20, x3: 0, y3: 0, x4: -20, y4: 20 },
    doscientosSetenta: {x1: 40, y1: 20, x2: 20, y2: 0, x3: 0, y3: 20, x4: -20, y4: 0 }
  },
  rotationRight: {
    zero: {x1: -40, y1: -20, x2: -20, y2: 0, x3: 0, y3: -20, x4: 20, y4: 0 },
    noventa: {x1: 20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: 0, y4: 40 },
    cientoOchenta: {x1: 20, y1: 0, x2: 0, y2: -20, x3: -20, y3: 0, x4: -40, y4: -20 },
    doscientosSetenta: {x1: 0, y1: 40, x2: 20, y2: 20, x3: 0, y3: 0, x4: 20, y4: -20 }
  }
};

// Rotacion Pieza T
const rotationTPiece = {
  rotationLeft: {
    zero: {x1: -20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 20, y4: 20 },
    noventa: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: -20, y4: 20 },
    cientoOchenta: {x1: 20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: -20, y4: -20 },
    doscientosSetenta: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: 20, y4: -20 }
  },
  rotationRight: {
    zero: {x1: -20, y1: -20, x2: 0, y2: 0, x3: 20, y3: 20, x4: -20, y4: 20 },
    noventa: {x1: 20, y1: -20, x2: 0, y2: 0, x3: -20, y3: 20, x4: -20, y4: -20 },
    cientoOchenta: {x1: 20, y1: 20, x2: 0, y2: 0, x3: -20, y3: -20, x4: 20, y4: -20 },
    doscientosSetenta: {x1: -20, y1: 20, x2: 0, y2: 0, x3: 20, y3: -20, x4: 20, y4: 20 }
  }
};