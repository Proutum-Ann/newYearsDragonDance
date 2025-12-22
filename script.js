// credit to my cousin bc he is awesome at fixing my shit
const vueApp = Vue.createApp({

  created() {
    fetch("avatars.json")
      .then(response => response.json())
      .then(json => {
        this.avatars = json;
      });
  },
  data() {
    return {
      avatars: [],          // loaded from JSON
      avatarIndex: 0,       // current avatar (Lion)
      currentState: "idle",
      currentKey: null
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
 },
  computed: {
    // gets current character
    avatar() {
      return this.avatars[this.avatarIndex];
    },
    // switches sprites based on current state
    avatarSrc() {
      if (!this.avatar) return "";
      return this.avatar.sprites[this.currentState];
    }
  },
  methods: {
    keyDown(e) {
      if (e.repeat) return;
      if (this.currentState === "dead") return; // Ignore keys while dead

      const key = e.key.toLowerCase();
      this.currentKey = key;

      if (key === "w") this.currentState = "up";
      else if (key === "s") this.currentState = "down";
      else if (key === "a") this.currentState = "left";
      else if (key === "d") this.currentState = "right";
    },

    keyUp(e) {
      if (e.key.toLowerCase() === this.currentKey) {
        if (this.currentState !== "dead")
        this.currentState = "idle";
        this.currentKey = null;
      }
    },
    becomeDead() {
        this.isDead = !this.isDead

        if (this.isDead === true) {
            this.currentState = "dead";
        } else {
            this.currentState = "idle";
        }
    }
  }
});

vueApp.mount("#app");