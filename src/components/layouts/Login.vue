<template>
  <div>
    <v-layout row justify-center>
      <v-flex xs12 md5>

        <h4 class="headline text-xs-center mb-3">Sign Into Your Account</h4>

        <v-card>
          <form @submit.prevent.stop="login">
            <v-card-text class="pa-5">
              <v-layout row justify-center align-center class="text-xs-center mb-4">
                <transition name="slide-transition">
                  <v-flex xs4>
                    <v-icon x-large class="primary--text icon--clickable" @click="authenticate('facebook', {'scope': ['email']})">fa-facebook-square</v-icon>
                  </v-flex>
                </transition>
                <transition name="slide-transition">
                  <v-flex xs4>
                    <v-icon x-large class="primary--text icon--clickable" @click="authenticate('instagram')">fa-instagram</v-icon>
                  </v-flex>
                </transition>
                <transition name="slide-transition">
                  <v-flex xs4>
                    <v-icon x-large class="primary--text icon--clickable" @click="authenticate('google')">fa-google</v-icon>
                  </v-flex>
                </transition>
                <transition name="slide-transition">
                  <v-flex xs4>
                    <v-icon x-large class="primary--text icon--clickable" @click="authenticate('twitter')">fa-twitter-square</v-icon>
                  </v-flex>
                </transition>
              </v-layout>
              <div class="title text-xs-center grey--text text--darken-3 mb-2">Or sign in with</div>
              <v-text-field
                  name="email"
                  class="mb-2"
                  label="E-mail"
                  v-model="email"
                  v-validate="'required|email'"
                  :error-messages="errors.collect('email')"
              ></v-text-field>

              <v-text-field
                  name="password"
                  label="Password"
                  type="password"
                  class="mb-2"
                  v-model="password"
                  v-validate="'required|min:3'"
                  :error-messages="errors.collect('password')"
              ></v-text-field>

              <div class="text-xs-center">
                <v-btn class="mt-5 purple darken-1 white--text" @click="submit" :loading="submitting">Sign In</v-btn>
              </div>
            </v-card-text>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        email: null,
        password: null,
        submitting: false
      }
    },
    mounted() {
    },
    methods: {
      submit() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          this.submitting = true

          this.$http.post('auth/login', { email: this.email, password: this.password }).then(response => {
            this.submitting = false
            let data = response.data

            if (!data.token) {
              this.$store.dispatch('alert', {
                'text': 'There was an error trying to log in! Please try again later.',
                'color': 'red'
              })

              return
            }

            this.login(data.token)
          }).catch(error => {
            this.submitting = false
            let data = error.response.data

            // Display response errors from backend
            if (data.error !== undefined) {
              this.$store.dispatch('alert', {
                'text': data.error.message,
                'color': 'red'
              })
            } else {
              this.$store.dispatch('alert', {
                'text': 'There was an error trying to log in! Please try again later.',
                'color': 'red'
              })
            }
          })
        }).catch(error => {
        })
      },
      login(token, redirect = null) {
        this.$http.defaults.headers.common['Authorization'] = "Bearer " + token

        localStorage.setItem("auth-token", token)

        this.$http.get('user/me').then(response => {
          this.$store.dispatch('authenticateUser', response.data)

          if (response.data.role === 'advertiser') this.$router.push('/advertiser')
          else if (response.data.role === 'influencer') {
            this.$router.push(redirect || '/influencer')
          }
        }).catch(error => {
          console.error(error);
        })
      },
      authenticate(provider, options) {
        this.$auth.authenticate(provider, options).then(result => {
          // Execute application logic after successful social authentication
          if (result.data.login) {
            this.login(result.data.token)
          } else if (result.data.signup && result.data.token) {
            this.login(result.data.token, '/influencer/start')
          } else {
            this.$router.push('/signup/advertiser')
          }
        }).catch(error => {
          console.log(error)
        })
      },
    }
  }
</script>

<style>
  .icon--clickable {
    cursor: pointer;
    padding: 10px;
  }
  .icon--huge {
    font-size: 40px;
  }
</style>