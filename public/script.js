var io = io.connect("http://115.187.46.39:8080/");
let canvas = document.getElementById("canvas");
canvas.height = 0.97 * window.innerHeight;
canvas.width = window.innerWidth;
const line=document.getElementById('line');
const rectangle=document.getElementById('rectangle');
const rubber=document.getElementById('rubber');
const pencil=document.getElementById('pencil');
let ctx = canvas.getContext("2d");
let paint = false;
let is_pencil = false,
  is_rubber = false,
  is_rectangle = false,
  is_line = false;
let first_rect;
let prevX, prevY;
function startDraw() {
  paint = true;
  flag = true;
  first_rect = true;
  io.emit("initialize", { paint, flag, first_rect });
}
io.on("on_initialize", (data) => {
  console.log(io);
  paint = data.paint;
  flag = data.flag;
  first_rect = data.first_rect;
});
io.on("on_executingEnd", () => {
  console.log("k");
  endDraw();
});
function ending() {
  io.emit("executingEnd");
  endDraw();
}
function endDraw() {
  paint = false;
  console.log(is_line);
  if (is_line) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(prevX, prevY);
    ctx.stroke();
  }
  //io.emit('propogate',{x,y,c});
  ctx.beginPath();
}
// io.on("onpropogate", ({ x, y, c }) => {
//   // ctx.strokeStyle=c;
//   console.log(c);
//   ctx.lineTo(x, y);
//   ctx.stroke();
// });
let startX,
  startY,
  flag = true;
  io.on("on_executingDraw", (data) => {
    
    var evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: data.x,
      clientY:data.y
      /* whatever properties you want to give it */
  });
    Draw(evt);
  });  
function moving(event) {
  var x=event.clientX;
  var y=event.clientY;
  // console.log(x+" "+y);
  io.emit("executingDraw", { x,y });
  Draw(event);
}

function Draw(event) {
  console.log(event+" "+paint+" "+is_rectangle);
  if (!paint) return;
  ctx.lineCap = "round";
  if (flag) {
    startX = event.clientX;
    startY = event.clientY;
    flag = false;
    console.log("hi"+event.clientX,event.clientY);
  }
  if (is_pencil || is_rubber) {
    x = event.clientX;
    y = event.clientY;
    c = ctx.strokeStyle;
    //io.emit("propogate", { x, y, c });
    ctx.lineTo(event.clientX, event.clientY);
  } else if (is_rectangle) {
    console.log(is_rectangle)
    const currentX = event.clientX;
    const currentY = event.clientY;

    const width = currentX - startX;
    const height = currentY - startY;
    if (first_rect) {
      console.log(first_rect);
      first_rect = false;
    } else ctx.clearRect(startX, startY, prevX-startX, prevY-startY);
    //console.log(width+" "+height);
    ctx.rect(startX, startY, width, height);
    prevX = event.clientX;
    prevY = event.clientY;
    console.log("rectangle active");
  } else if (is_line) {
    prevX = event.clientX;
    prevY = event.clientY;
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(event.clientX, event.clientY);
}
io.on("oncol_change", (c) => {
  ctx.strokeStyle = c;
  console.log("in on_col" + ctx.strokeStyle);
});
function change(value) {
  ctx.strokeStyle = value;
  io.emit("col_change", value);
  console.log(ctx.strokeStyle);
}
io.on("on_activate", (data) => {
  console.log(data);
  is_pencil = data.is_pencil;
  is_rubber = data.is_rubber;
  is_rectangle = data.is_rectangle;
  is_line = data.is_line;
  pencil.style.background=data.col.pencil;
  rubber.style.background=data.col.rubber;
  rectangle.style.background=data.col.rectangle;
  line.style.background=data.col.line;
});
function active_pencil() {
  is_pencil = true;
  is_rubber = false;
  is_rectangle = false;
  is_line = false;
  
  pencil.style.background='#E8D5C4';
  rubber.style.background='#FFF1DC';
  rectangle.style.background='#FFF1DC';
  line.style.background='#FFF1DC';
  console.log(pencil.style.background);
  var col={
  pencil:'#E8D5C4',
  rubber:'#FFF1DC',
  rectangle:'#FFF1DC',
  line:'#FFF1DC'
  }
  io.emit("activate", { is_pencil, is_rubber, is_rectangle, is_line ,col});
}
function active_rubber() {
  is_pencil = false;
  is_rubber = true;
  is_rectangle = false;
  is_line = false;
  pencil.style.background='#FFF1DC';
  rubber.style.background='#E8D5C4';
  rectangle.style.background='#FFF1DC';
  line.style.background='#FFF1DC';
  var col={
    pencil:'#FFF1DC',
    rubber:'#E8D5C4',
    rectangle:'#FFF1DC',
    line:'#FFF1DC'
    }
  io.emit("activate", { is_pencil, is_rubber, is_rectangle, is_line,col });
}
function active_rectangle(value) {
  is_pencil = false;
  is_rubber = false;
  is_rectangle = true;
  is_line = false;
  pencil.style.background='#FFF1DC';
  rubber.style.background='#FFF1DC';
  rectangle.style.background='#E8D5C4';
  line.style.background='#FFF1DC';
  var col={
    pencil:'#FFF1DC',
    rubber:'#FFF1DC',
    rectangle:'#E8D5C4',
    line:'#FFF1DC'
    }
  io.emit("activate", { is_pencil, is_rubber, is_rectangle, is_line,col });
  change(value);
}
function active_line(value) {
  is_pencil = false;
  is_rubber = false;
  is_rectangle = false;
  is_line = true;
  pencil.style.background='#FFF1DC';
  rubber.style.background='#FFF1DC';
  rectangle.style.background='#FFF1DC';
  line.style.background='#E8D5C4';
  var col={
    pencil:'#FFF1DC',
    rubber:'#FFF1DC',
    rectangle:'#FFF1DC',
    line:'#E8D5C4'
    }
  io.emit("activate", { is_pencil, is_rubber, is_rectangle, is_line , col});
  change(value);
}
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", ending);
canvas.addEventListener("mousemove", moving);
