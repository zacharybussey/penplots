const square = (x, y, size) => {
  const path = [
    [x - size, y - size],
    [x + size, y - size],
    [x + size, y + size],
    [x - size, y + size]
  ];

  path.push(path[0]);
  return path;
};

function draw(width, height) {
  const cx = width / 2;
  const cy = height / 2;

  const lines = [];
  for (let i = 0; i < 12; i++) {
    const size = i + 1;
    const margin = 0.25;
    lines.push(square(cx, cy, size));
    lines.push(square(cx, cy, size + margin));
  }
  return lines;
}

export default draw;
