const serverUrl = 'http://localhost:3000'

let app = new Vue({
    el: '#app',
    data: {
        isLoggedIn: false,
        currentPage: 'homepage',
        currentJoke: '',
        favorites: [],
        login: {
            email: '',
            password: ''
        }
    },
    created() {
        let token = localStorage.getItem('token')
        if (token) this.verify()
        this.getJoke()
        this.getFavorites()
    },
    methods: {
        verify: function () {
            let token = localStorage.getItem('token')
            axios
                .post(`${serverUrl}/verify`, { token }, { headers: { token } })
                .then(({ data }) => {
                    this.isLoggedIn = true
                    console.log(data.message)
                })
                .catch((err) => {
                    const { message } = err.response.data
                    swal("Error!", message, "error");
                    localStorage.removeItem('token')
                    localStorage.removeItem('UserId')
                    localStorage.removeItem('email')
                })
        },
        signIn: function () {
            const { email, password } = this.login
            axios
                .post(`${serverUrl}/login`, { email, password })
                .then(({ data }) => {
                    const { details, token } = data
                    const { id, email } = details
                    swal('Success!', data.message, 'success')
                    this.isLoggedIn = true
                    localStorage.setItem('UserId', id)
                    localStorage.setItem('token', token)
                    localStorage.setItem('email', email)
                    this.getJoke()
                    this.getFavorites()
                })
                .catch((err) => {
                    console.log(err)
                    const { message } = err.response.data
                    swal('Error!', message, 'error')
                })
        },
        signOut: function () {
            swal('Success!', 'Bye!', 'success')
            this.isLoggedIn = false
            localStorage.removeItem('UserId')
            localStorage.removeItem('token')
            localStorage.removeItem('email')
        },
        getJoke: function () {
            let token = localStorage.getItem('token')
            axios
                .get(`${serverUrl}/getJoke`, { headers: { token } })
                .then(({ data }) => {
                    const { joke } = data
                    this.currentJoke = joke
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getFavorites: function () {
            let token = localStorage.getItem('token')
            axios
                .get(`${serverUrl}/favorites`, { headers: { token } })
                .then(({ data }) => {
                    this.favorites = data
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        addToFavorites: function () {
            let token = localStorage.getItem('token')
            axios
                .post(`${serverUrl}/favorites`, {
                    joke: this.currentJoke
                }, { headers: { token } })
                .then(({ data }) => {
                    swal('Success!', data.message, 'success')
                    this.getJoke()
                    this.getFavorites()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        deleteFavorites: function (JokeId) {
            swal({
                title: "Are you sure?",
                text: "But it's funny :( ",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        let token = localStorage.getItem('token')
                        axios
                            .delete(`${serverUrl}/favorites/${JokeId}`, { headers: { token } })
                            .then(({ data }) => {
                                swal('Success!', data.message, 'success')
                                // this.getJoke()
                                this.getFavorites()
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        swal("Yay! Joke is saved :D ");
                    }
                });
        }
    }
})
