<template>
  <div>
    <v-layout row justify-center>
      <v-flex md8>

        <div class="text-xs-center mb-4">
          <h4 class="display-1 text-center mb-0">Welcome</h4>
          <p class="grey--text text--darken-1">Sign Up Below To Receive Proposals and Ideas</p>
        </div><!-- /.sign-up-header -->

        <v-card raised style="z-index: 2" class="mb-3">
          <v-card-text class="pa-5" transition="slide-y-transition">

            <form method="post" action="" class="form-sign-up">

                <h5 class="title text-xs-center">Sign in with social media</h5>

                <v-layout row justify-center>
                  <v-flex md12>
                    <v-layout row justify-center align-center class="text-xs-center pt-3">
                      <transition name="slide-transition">
                        <v-flex xs4>
                          <v-icon x-large class="primary--text icon--clickable" :class="{'grey--text text--lighten-2': social.authorized && social.type != 'facebook'}" @click="authenticate('facebook', {'scope': ['email']})">fa-facebook-square</v-icon>
                        </v-flex>
                      </transition>
                      <transition name="slide-transition">
                        <v-flex xs4>
                          <v-icon x-large class="primary--text icon--clickable" :class="{'grey--text text--lighten-2': social.authorized && social.type != 'instagram'}" @click="authenticate('instagram')">fa-instagram</v-icon>
                        </v-flex>
                      </transition>
                      <transition name="slide-transition">
                        <v-flex xs4>
                          <v-icon x-large class="primary--text icon--clickable" :class="{'grey--text text--lighten-2': social.authorized && social.type != 'google'}" @click="authenticate('google')">fa-google</v-icon>
                        </v-flex>
                      </transition>
                      <transition name="slide-transition">
                        <v-flex xs4>
                          <v-icon x-large class="primary--text icon--clickable" :class="{'grey--text text--lighten-2': social.authorized && social.type != 'twitter'}" @click="authenticate('twitter')">fa-twitter-square</v-icon>
                        </v-flex>
                      </transition>
                    </v-layout>
                  </v-flex>
                </v-layout>


              <transition name="fade-transition">
                <h5 class="title text-xs-center mt-5 mb-3">
                  <span v-if="!social.authorized">Or use your email</span>
                  <span v-if="social.authorized"> <strong><v-icon>check</v-icon> Connected! </strong><br> Please provide additional details </span>
                </h5>
              </transition>

              <v-layout row justify-center>
                <v-flex md12>
                  <v-text-field
                      v-model="advertiser.name"
                      name="name"
                      label="Full Name"
                      v-validate="'required'"
                      :error-messages="errors.collect('name')"
                      prepend-icon="fa-user-o"
                  ></v-text-field>

                  <v-text-field
                      v-model="user.email"
                      name="email"
                      label="Email"
                      v-validate="'required|email'"
                      :error-messages="errors.collect('email')"
                      prepend-icon="fa-envelope-o"
                  ></v-text-field>

                  <transition name="slide-y-transition">
                    <v-text-field
                        v-model="user.password"
                        name="password"
                        label="Password"
                        type="password"
                        v-validate="'required|min:3'"
                        :error-messages="errors.collect('password')"
                        prepend-icon="fa-lock"
                        v-if="!social.authorized"
                    ></v-text-field>
                  </transition>
                </v-flex>
              </v-layout>

              <div class="text-xs-center">
                <v-btn large class="mt-5 purple darken-1 white--text" @click="submit" :loading="submitting">Get Started</v-btn>
              </div>

            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    components: {
//      GetStarted, ConnectNetworks
    },
    data() {
      return {
        advertiser: {
          name: null,
        },
        user: {
          email: null,
          password: null
        },
        social: {
          authorized: false,
          type: null,
          account_id: null,
          email: null,
          avatar: null,
          name: null
        },
        invite_code: null,
        submitting: false
      }
    },
    mounted() {

    },
    methods: {
      authenticate(provider, options) {
        this.$auth.authenticate(provider, options).then(result => {
          // Execute application logic after successful social authentication
          if (result.data.login) {
            this.login(result.data.token, false, '/advertiser')
          } else if (result.data.signup && result.data.token) {
            this.login(result.data.token)
          } else {
            this.social = result.data.social
            this.user.email = this.social.email
            this.advertiser.name = this.social.name
          }
        }).catch(error => {
          console.log(error)
        })
      },
      submit() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          this.submitting = true

          this.$http.post('signup/advertiser', {
            'user': this.user,
            'advertiser': this.advertiser,
            'social': this.social
          }).then(result => {
            this.submitting = false
            let data = result.data

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
                'text': 'There was an unknown error signing up. Please try again later.',
                'color': 'red'
              })
            }
          })

        }).catch(error => {
          this.submitting = false
        })
      },
      login(token, signup = true, redirect = '/advertiser') {
        this.$http.defaults.headers.common['Authorization'] = "Bearer " + token

        localStorage.setItem("auth-token", token)

        this.$http.get('user/me').then(response => {
          let userData = {...response.data, signup: signup}
          this.$store.dispatch('authenticateUser', userData)

          this.$router.push('/' + userData.role)
        })
      }
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

  /* ================================================================ *\
    #Networks Connect
  \* ================================================================ */

  .networks-connect {
    margin: 100px auto 200px;
    max-width: 560px;
    background: #fff;
    padding: 40px;
    border: 1px solid #ebebeb;
    border-radius: 5px;
  }

  .networks-connect .header {
    text-align: left;
  }

  .networks-connect .header h2 {
    font-size: 24px;
    font-weight: 800;
    color: #2d2d2d;
    margin-bottom: 5px;
  }

  .networks-connect .header p {
    font-size: 19px;
    font-weight: 300;
    color: #777;
  }

  .networks-connect .content ul {
    display: block;
  }

  .networks-connect .content ul li {
    display: block;
    margin-bottom: 15px;
  }

  .networks-connect .content ul li .list__tile {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .networks-connect .content ul li .network-icon {
    display: inline-block;
    width: 20%;
    vertical-align: top;
  }

  .networks-connect .content ul li .network-icon .icon {
    font-size: 40px;
    width: 60px;
    height: 60px;
    color: #03a9f4;
    background-color: #ebebeb;
    border-radius: 50%;
    padding: 10px;
  }

  .networks-connect .content ul li .content {
    display: inline-block;
    width: 79%;
    padding-top: 15px;
    vertical-align: top;
  }

  .networks-connect .content ul li .content h5 {
    font-size: 18px;
    font-weight: 500;
  }

  .networks-connect .content ul li .content h5 .btn-connect {
    float: right;
    font-size: 12px;
    text-transform: uppercase;
    background: #03a9f4;
    padding: 3px 25px;
    color: #fff;
    border-radius: 5px;
  }

  .networks-connect .content ul li .content h5 .icon {
    float: right;
    font-size: 18px;
    color: #03a9f4;
  }

  .networks-connect .content ul li .content p {
    margin-bottom: 10px;
    font-size: 13px;
  }

  .networks-connect .content ul li .content p .icon {
    color: #03a9f4;
    font-size: 16px;
    position: relative;
    top: -3px;
    margin: 0 10px;
  }

  .networks-connect .content ul li .content p .icon:last-child {
    margin-right: 0;
  }

  .networks-connect .content ul li .content p span:first-child {
    display: inline-block;
    width: 60%;
    vertical-align: top;
  }

  .networks-connect .content ul li .content p span:last-child {
    display: inline-block;
    width: 39%;
    text-align: right;
    color: #777777;
    vertical-align: top;
  }

  @media only screen and (max-width: 767px) {
    .networks-connect .content ul li .network-icon {
      display: block;
      width: 100%;
      text-align: center;
    }

    .networks-connect .content ul li .content {
      display: block;
      width: 100%;
    }

    .networks-connect .content ul li .content h5 {
      line-height: 1;
    }

    .networks-connect .content ul li .content p span:first-child,
    .networks-connect .content ul li .content p span:last-child {
      display: block;
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
    }
  }
</style>