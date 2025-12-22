// credit to my cousin bc he is awesome at fixing my shit
const vueApp = Vue.createApp({

  data() {
    return {
      avatars: [],          // loaded from JSON
      avatarIndex: 0,       // current avatar (Lion)
      currentState: "idle",
      currentKey: null
    };
  },

  created() {
    fetch("avatars.json")
      .then(response => response.json())
      .then(json => {
        this.avatars = json;
      });
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