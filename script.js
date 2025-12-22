const lion = document.getElementById("lion");

let spriteData = {};
let currentKey = null;

const vueApp = Vue.createApp({

  data() {
    return {
      sprites: {},
      currentState: "idle",
      currentKey: null
    };
  },

  created() {
    fetch("avatars.json")
      .then(res => res.json())
      .then(json => {
        this.sprites = json.sprites;
      });
  },

  computed: {
    lionSrc() {
      return this.sprites[this.currentState];
    }
  },

  methods: {
    keyDown(e) {
      if (e.repeat) return;

      const key = e.key.toLowerCase();
      this.currentKey = key;

      if (key === "w") this.currentState = "up";
      else if (key === "s") this.currentState = "down";
      else if (key === "a") this.currentState = "left";
      else if (key === "d") this.currentState = "right";
    },

    keyUp(e) {
      if (e.key.toLowerCase() === this.currentKey) {
        this.currentState = "idle";
        this.currentKey = null;
      }
    }
  }
});

vueApp.mount("#app");