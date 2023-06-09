gsap.registerPlugin(TextPlugin);

const words = ["Hardik Bishnoi 👋🏽", "a Coder 👨🏽‍💻", "a Researcher 📑", "a Writer ✒️"]

gsap.to('#cursor', {opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "power2.inout"})

let tlMaster = gsap.timeline({repeat: -1})

words.forEach((word) => {
    let tlText = gsap.timeline({repeat: 1, yoyo: true, duration: 0.6});
    tlText.to('#animated-text', {duration: 1.5, text: word});
    tlMaster.add(tlText);
});