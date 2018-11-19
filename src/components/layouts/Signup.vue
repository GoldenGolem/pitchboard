<template>
  <v-app
      id="pitchboard"
      standalone>
    <v-container v-scroll="onScroll">
      <v-toolbar class="white elevation-0 navbar" :height="toolbarHeight" :class="{ 'elevation-3': offsetTop > 0 }" fixed app>
          <v-layout row align-center>
            <v-flex sm2>
              <div class="pt-2 pb-2 ml-3">
                <img src="../../assets/logo.svg">
              </div>
            </v-flex>
            <v-flex sm12 class="text-xs-center">
              <router-link :to="{ 'path': '/advertiser/dashboard' }" class="link">
                Brands
              </router-link>
              <router-link :to="{ 'path': '/advertiser/dashboard' }" class="link">
                Influencers
              </router-link>
              <router-link :to="{ 'path': '/advertiser/dashboard' }" class="link">
                About
              </router-link>
              <router-link :to="{ 'path': '/advertiser/dashboard' }" class="link">
                Contact
              </router-link>
            </v-flex>
          </v-layout>
      </v-toolbar>
      <v-content>
        <v-layout column class="mt-5 mb-5">
          <router-view></router-view>
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

    <figure class="footer-effect"></figure>

    <v-container fluid class="container--footer">
      <v-layout align-center justify-center>
        <img src="../../assets/logo-white.png" style="position: relative">
      </v-layout>
    </v-container>
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
    mounted() {
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
