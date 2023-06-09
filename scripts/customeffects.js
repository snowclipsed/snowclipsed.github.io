gsap.registerPlugin(ScrollTrigger);
const hyperspace = document.getElementById("hyperspace");
const hyperspacecontext = hyperspace.getContext("2d");

hyperspace.height = screen.height;
hyperspace.width = screen.width;

const hyperspace_params = {
  frames: 48,
  totaltime: 20,
  images: [],
  currentFrame: 0,
  currentImage: (index) => `./assets/images/hyperspace${index.toString().padStart(2, "0")}.jpg`,
};

for(let i=0; i<=hyperspace_params.frames; i++){
  const img = new Image();
  img.src = hyperspace_params.currentImage(i);
  hyperspace_params.images.push(img);
}

gsap.to(hyperspace_params, {
  currentFrame : hyperspace_params.frames,
  snap: "currentFrame",
  ease: "none",
  scrollTrigger:{
    trigger: hyperspace,
    start: 'top',
    end: `bottom+=${hyperspace_params.frames*hyperspace_params.totaltime}`,
    pin: true,
    scrub: true,
    markers: false,
  },
  onUpdate: render,
});

hyperspace_params.images[0].onload = () =>{
  hyperspacecontext.drawImage(
    hyperspace_params.images[0],-160,-150);
  };

function render(){
  hyperspacecontext.drawImage(hyperspace_params.images[hyperspace_params.currentFrame], -160, -150);
}



