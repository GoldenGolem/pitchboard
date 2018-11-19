<template>
  <v-app
      id="pitchboard"
      standalone>
    <v-container v-scroll="onScroll" class="main-container">
      <v-toolbar class="white elevation-0 navbar" :height="toolbarHeight" :class="{ 'elevation-3': offsetTop > 0, 'toolbar--thin': offsetTop > 0 }" fixed app>
          <v-layout row align-center>
            <v-flex sm2>
              <div class="pt-2 pb-2 ml-3">
                <img src="../../assets/logo.svg">
              </div>
            </v-flex>
            <v-flex sm12 class="text-xs-center">
              <router-link :to="{ 'path': '/advertiser/dashboard' }" class="link">
                Dashboard
              </router-link>
              <!--<router-link :to="{ 'path': '/advertiser/tasks' }" class="link">-->
                <!--<v-badge right color="primary">-->
                  <!--Task List-->
                  <!--<span slot="badge">30</span>-->
                <!--</v-badge>-->
              <!--</router-link>-->
              <router-link :to="{ 'path': '/advertiser/campaigns' }" class="link">
                Campaigns
              </router-link>
              <router-link :to="{ 'path': '/advertiser/messages' }" class="link">
                Messages
              </router-link>
              <router-link :to="{ 'path': '/advertiser/account' }" class="link">
                Account
              </router-link>
            </v-flex>
            <v-flex sm2>
              <v-menu bottom offset-y full-width :nudge-top="-20">
                <v-flex d-flex slot="activator" align-center justify-end>
                  <span>{{ user.advertiser.name }}</span>
                  <v-badge color="purple" overlap left>
                    <span slot="badge">3</span>
                    <v-avatar :size="offsetTop > 0 ? '40px' : '60px'">
                      <img :src="user.avatar">
                    </v-avatar>
                  </v-badge>
                  <div class="mr-3">
                    <v-icon>expand_more</v-icon>
                  </div>
                </v-flex>
                <v-list dense>
                  <v-list-tile @click="$router.push({ path: '/logout' })">
                    <v-list-tile-action>
                      <v-icon>sms_failed</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Notifications</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile @click="$router.push({ path: '/logout' })">
                    <v-list-tile-action>
                      <v-icon>mail</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Messages</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile @click="$router.push({ path: '/logout' })">
                    <v-list-tile-action>
                      <v-icon>fa-sign-out</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Log Out</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>

          <!--<v-spacer></v-spacer>-->
          <!--<p>Welcome, {{ user.username }}</p>-->
      </v-toolbar>
      <v-content>
        <v-layout column class="mt-4 mb-5">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </v-layout>
      </v-content>

    </v-container>

    <v-snackbar
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        :multi-line="snackbar.mode === 'multi-line'"
        bottom
        right
        v-model="snackbarActive"
    >
      <span v-html="snackbar.text"></span>
      <v-btn dark flat @click.native.prevent="$store.dispatch('closeAlert')">Close</v-btn>
    </v-snackbar>

    <footer>
      <v-container>
        <v-layout align-center justify-center class="pt-3">
          <div class="text-sm-center caption">
            &copy; PitchBoard Media, Inc. All rights reserved.<br>
            <a href="#">Terms Of Service</a> &middot; <a href="#">Privacy Policy</a>
          </div>
        </v-layout>
      </v-container>
    </footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        'offsetTop': 0,
        'dialog': false
      }
    },
    computed: {
      user() {
        return this.$store.state.user.data
      },
//      authenticated() {
//        return this.$store.state.user.authenticated
//      },
      toolbarHeight() {
        return this.offsetTop > 0 ? null : 90;
      },
      snackbarActive: {
        get() {
          return this.$store.state.ui.alert.active
        },
        set(value) {
          if (!value) this.$store.dispatch('closeAlert')
        }
      },
      snackbar() {
        return this.$store.state.ui.alert
      }
    },
    watch: {
    },
    mounted() {
      this.$http.get('me/credit-cards').then(result => {
        this.$store.dispatch('saveCards', {'cards': result.data.cards, 'default': result.data.default})
      })
    },
    methods: {
      onScroll(e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .btn.global-back {
    margin-left: 0;
  }

  .btn.global-back .btn__content {
    padding-left: 0;
  }
</style>
