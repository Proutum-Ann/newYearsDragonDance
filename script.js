const vue_app = Vue.createApp({
      // This automatically imports your movies.json file and puts it into
      //   the variable: movies
      created () {
            fetch('lions.json').then(response => response.json()).then(json => {
                  this.lion = json
            })
      },
      data() {
        return {
            lion: []
      }
    },
    methods: {

    },
    computed: {

    }
})

vue_app.mount("#vue_app")