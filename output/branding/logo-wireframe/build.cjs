const fs = require('node:fs');
const path = require('node:path');
const paper = require('/tmp/sanova-logo-wireframe-tools/node_modules/paper');
const sharp = require('../../../node_modules/sharp');
const root = process.cwd();
paper.setup(new paper.Size(1024, 1024));
const input = fs.readFileSync(path.join(root, 'public/branding/logo-assets/sanova-logo-symbol.svg'), 'utf8');
const data = input.match(/<path d="([^"]+)"/)[1];
const compound = new paper.CompoundPath(data);
let outline = compound.children[0].clone();
for (const child of compound.children.slice(1)) {
  const next = outline.unite(child, { insert: false });
  outline.remove();
  outline = next;
}
const contours = outline.children || [outline];
const circle = (x,y,r,attrs='') => `<circle cx="${x}" cy="${y}" r="${r}" ${attrs}/>`;
const line = (a,b) => `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
let dots = [], handles = [];
const landmarks = [
  [60,0],[41,19],[79,19],[60,38],[108,50],[156,38],[137,19],[175,19],[156,0],
  [108,88],[89,69],[127,69],
  [62,50],[43,69],[81,69],[62,88],[108,98],[154,88],[135,69],[173,69],[154,50],
  [108,136],[89,117],[127,117],
  [19,60],[0,79],[19,98],[43,120],[62,139],[89,163],[108,182],
  [127,163],[154,139],[173,120],[197,98],[216,79],[197,60],
  [22,25.5],[7.5,40],[22,54.5],[36.5,40],
  [194,25.5],[179.5,40],[194,54.5],[208.5,40],
];
const selected = [];
for (const target of landmarks) {
  let nearest;
  for (const c of contours) for (const s of c.segments)
    if (!nearest || s.point.getDistance(target) < nearest.point.getDistance(target)) nearest = s;
  if (selected.every(s => s.point.getDistance(nearest.point) > 3)) selected.push(nearest);
}
for (const seg of selected) dots.push(circle(seg.point.x, seg.point.y, 1.35));
// Extend selected tangent guides for an editorial construction drawing.
// These show the original Bézier directions without changing the logo path.
const targets = [[60,0],[0,79],[216,79],[108,182],[62,88]];
for (const target of targets) {
  let nearest;
  for (const c of contours) for (const s of c.segments)
    if (!nearest || s.point.getDistance(target) < nearest.point.getDistance(target)) nearest = s;
  for (const handle of [nearest.handleIn, nearest.handleOut]) {
    if (handle.length < 0.01) continue;
    const end = nearest.point.add(handle.normalize(14));
    handles.push(line(nearest.point,end));
    handles.push(circle(end.x,end.y,.74,'fill="#F0F6EE" stroke="#0B865A" stroke-width=".34"'));
  }
}
const mark = `<g transform="translate(162.08 217.16) scale(3.24)"><g fill="none" stroke="#0B865A" stroke-width=".72" stroke-linecap="round" stroke-linejoin="round"><path d="${outline.pathData}"/></g><g stroke="#0B865A" stroke-width=".34" opacity=".85">${handles.join('')}</g><g fill="#0B865A">${dots.join('')}</g></g>`;
const defs = `<defs><linearGradient id="ground" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#D7EDE1"/><stop offset="1" stop-color="#F6F3E9"/></linearGradient></defs>`;
const full = `<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="3200" viewBox="0 0 1024 1024">${defs}<rect width="1024" height="1024" fill="url(#ground)"/>${mark}</svg>`;
const transparent = `<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="3200" viewBox="0 0 1024 1024">${mark}</svg>`;
const dest = path.join(root,'public/branding/logo');
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'sanova-symbol-wireframe-v2.svg'),full);
fs.writeFileSync(path.join(dest,'sanova-symbol-wireframe-transparent-v2.svg'),transparent);
sharp(Buffer.from(full)).png().toFile(path.join(dest,'sanova-symbol-wireframe-v2.png')).then(()=>console.log(JSON.stringify({contours:contours.length,anchors:dots.length,output:dest})));
