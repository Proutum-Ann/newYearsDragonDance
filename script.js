const lion = document.getElementById("lion");

let spriteData = {};
let currentKey = null;

const vueApp = Vue.createApp({
    created () {
        fetch('avatars.json').then(response => response.json()).then(json => {
           this.avatars = json
      }),
      lion.src = spriteData.sprites.idle;
   },
    data() {
        return {
            avatars: [],
            currentAvatar: avatars[0],
            title: 'New Year\'s Dance'
        }
    },
    computed: {
        
    },
    methods: {
        keyUp(e){
            if (e.key.toLowerCase() === currentKey) {
                lion.src = spriteData.sprites.idle;
                currentKey = null;
            }
        },
        keyDown(e){
            if (e.repeat) return;

            const key = e.key.toLowerCase();

            if (spriteData.sprites[key]) {
                lion.src = spriteData.sprites[key];
                currentKey = key;
            }
        }
    }     
});

vueApp.mount('#app');