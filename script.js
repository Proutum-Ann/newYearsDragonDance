const vue_app = Vue.createApp({
      // This automatically imports your movies.json file and puts it into
      //   the variable: movies
      created () {
            fetch('levels.json').then(response => response.json()).then(json => {
                  this.level = json
            })

            fetch('lions.json').then(response => response.json()).then(json => {
                  this.lion = json
            })
      },
      data() {
        return {
            level: [],
            lion: []
      }
    },
    methods: {

    },
    computed: {

    }
})

vue_app.mount("#vue_app")