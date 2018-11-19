<template>
  <v-app
      id="pitchboard"
      standalone style="overflow: hidden;">
  

    <v-sidebar v-if="sidebar" v-model="sidebar" height="100%" id="sidebar">
      <v-list>
        <router-link :to="{ 'path': '/influencer/dashboard' }" class="link">
            Dashboard
          </router-link>
          <router-link :to="{ 'path': '/influencer/opportunities' }" class="link">
            Opportunities
          </router-link>
          <router-link :to="{ 'path': '/influencer/work' }" class="link">
            Work
          </router-link>
          <router-link :to="{ 'path': '/influencer/messages' }" class="link">
            Messages
          </router-link>
          <router-link :to="{ 'path': '/influencer/account' }" class="link">
            Account
          </router-link>
      </v-list>
    </v-sidebar>

    <v-container v-scroll="onScroll">
      
      <v-toolbar class="white elevation-0 navbar" :height="toolbarHeight" :class="{ 'elevation-1': offsetTop > 0}" fixed app scroll-of-screen>
        <v-layout row align-center>
          <v-flex sm2 id="logo_img">
            <div class="pt-2 pb-2 ml-3">
              <img src="../../assets/logo.svg">
            </div>
          </v-flex>
          
          <v-toolbar-side-icon sm2 @click="navbars()" class="toolbar_icon" />
          
          <v-flex sm12 class="text-xs-center" id="menu_bar">
            <router-link :to="{ 'path': '/influencer/dashboard' }" class="link">
              Dashboard
            </router-link>
            <router-link :to="{ 'path': '/influencer/opportunities' }" class="link">
              Opportunities
            </router-link>
            <router-link :to="{ 'path': '/influencer/work' }" class="link">
              Work
            </router-link>
            <router-link :to="{ 'path': '/influencer/messages' }" class="link">
              Messages
            </router-link>
            <router-link :to="{ 'path': '/influencer/account' }" class="link">
              Account
            </router-link>
          </v-flex>

          <v-flex sm2 id="profile">
            <v-menu bottom offset-y full-width :nudge-top="-20">
              <v-flex d-flex slot="activator" align-center justify-end>
                <span>{{ user.influencer.name }}</span>
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
        <v-dialog v-model="loading.active" content-class="elevation-0" fullscreen>
          <v-layout column fill-height align-center justify-space-around>
            <v-flex>
              <v-progress-circular indeterminate size="80" v-bind:width="1" class="white--text">
              </v-progress-circular>
            </v-flex>
            <v-flex>
              <div class="headline white--text">{{ loading.text }}</div>
            </v-flex>
          </v-layout>
        </v-dialog>
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
      {{ snackbar.text }}
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
        'dialog': false,
        'sidebar': false,
      }
    },
    computed: {
      user() {
        return this.$store.state.user.data
      },
      toolbarHeight() {
        return this.offsetTop > 0 ? null : 90;
      },
      loading() {
        return this.$store.state.ui.loading
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
    watch: {
      'user.id': function () {
        console.log(this.user.id)
      }
    },
    methods: {
      onScroll(e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
      },
      navbars() {
        if(this.sidebar == true)
          this.sidebar = false;
        else
          this.sidebar = true;
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
  .toolbar_icon{
    display: none;
  }
  #profile{
    right: 0;
    position: absolute;
  }
  #sidebar{
    top: 0;
    margin-top: 50px;
    left: 0;
    position: absolute;
    z-index: 4;
    width: 300px;
    height: 5000px;
  }
  #sidebar .link{
    display: block;
    font-size: 18px;
    color: black;
    margin-top: 50px;
    margin-left: 30px;
    font-weight: 300;
  }
  
  #sidebar{
    display: none;
  }
  #sidebar .list{
    height: 100%;
  }

  @media(max-width: 992px){
    .toolbar_icon{
      margin-left: 30px;
      display: inline-block;
    }
    #logo_img{
      display: none;
    }
    #menu_bar{
      display: none;
    }
    #sidebar{
      display: block;
    }  
  }
</style>
