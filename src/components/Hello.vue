<template>
  <div>
    <v-btn flat small class="global-back grey--text text--darken-2 mb-4">
      <v-icon left>chevron_left</v-icon>
      Back to all campaigns
    </v-btn>
    <div v-if="campaign">
      <v-layout row class="mb-4">
        <v-flex md2>
          <v-card class="elevation-1 campaign-profile" height="100%">
            <img src="http://cicero.topbloggers.com/img/upload/logo/839ab468289.png">
          </v-card>
        </v-flex>
        <v-flex md14 class="ml-4">
          <v-layout column>
            <h1 class="headline mb-0">Renault: Write about the new Renault Talisman</h1>
            <div class="mb-3">
              <v-btn small flat class="ml-0 orange--text">
                <v-icon fa left class="orange--text">list-alt</v-icon>
                View
              </v-btn>
              <v-btn small flat class="ml-0 orange--text">
                <v-icon fa left class="orange--text">gear</v-icon>
                Edit
              </v-btn>
              Started 10 months ago
            </div>
            <v-toolbar class="white elevation-1" absolute>
              <v-toolbar-items class="hidden-sm-and-down ml-0">
                <v-tabs-slider class="primary"></v-tabs-slider>
                <v-btn small flat>
                  <v-icon left small fa>list</v-icon>
                  Overview
                </v-btn>
                <v-btn small flat>
                  <v-icon left small fa>book</v-icon>
                  Open
                </v-btn>
                <v-btn small flat>
                  <v-icon left small fa>check</v-icon>
                  Accepted
                </v-btn>
                <v-btn small flat>
                  <v-icon left small fa>rocket</v-icon>
                  Published
                </v-btn>
                <v-btn small flat>
                  <v-icon left small fa>bar-chart-o</v-icon>
                  Stats
                </v-btn>
              </v-toolbar-items>
              <v-spacer></v-spacer>
              <v-menu>
                <v-btn round outline flat class="btn--condensed-icons green--text lighten-2--text" slot="activator">
                  <v-icon left class="green--text lighten-2--text">fiber_manual_record</v-icon>
                  Campaign Active
                  <v-icon right class="grey--text lighten-2--text">arrow_drop_down</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="item1">
                    <v-list-tile-action>
                      <v-icon class="green--text">fiber_manual_record</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Campaign Active</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile key="item1" @click.native="test">
                    <v-list-tile-action>
                      <v-icon class="orange--text">pause</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Proposals Paused</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>

            </v-toolbar>
          </v-layout>
        </v-flex>
      </v-layout>
      <h5 class="subheading">Summary</h5>
      <v-layout>
        <v-flex md16>
          <v-card>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
          </v-card>
        </v-flex>
      </v-layout>
      <h5 class="subheading">Summary</h5>
      <v-layout>
        <v-flex md16>
          <v-card>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
          </v-card>
        </v-flex>
      </v-layout>
      <h5 class="subheading">Summary</h5>
      <v-layout>
        <v-flex md16>
          <v-card>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
            asdasdasd<br>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div class="text-xs-center mt-5" v-else>
      <v-progress-circular indeterminate :size="100" :width="2" class="orange--text"></v-progress-circular>
    </div>
    <v-snackbar
        :timeout="snackbar.timeout"
        :success="snackbar.context === 'success'"
        :info="snackbar.context === 'info'"
        :warning="snackbar.context === 'warning'"
        :error="snackbar.context === 'error'"
        :primary="snackbar.context === 'primary'"
        :secondary="snackbar.context === 'secondary'"
        :multi-line="snackbar.mode === 'multi-line'"
        :vertical="snackbar.mode === 'vertical'"
        v-model="snackbar.active"
        top
    >
      {{ snackbar.text }}
      <v-btn flat class="orange--text text--lighten-3" @click.native="snackbar.active = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'

  let instance = axios.create({
    baseURL: 'http://cicero.topbloggers.com'
  });

  // Alter defaults after instance has been created
  instance.defaults.headers.common['Authorization'] = "Bearer nwdEPdNJvaN1obN5wjEsr-mzklJ4gdYQ";


export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      campaign: null,
      snackbar: {
        active: false,
        text: '',
        context: '',
        mode: '',
        timeout: 6000,
      },
    }
  },
  mounted() {
//    axios.defaults.headers.common['Authorization'] = ;

    instance.get('/advertiser/campaign/index').then(result => {
      console.log(result)

      this.campaign = result.data
    }).catch(error => {
      console.error(error)

      this.campaign = "null"
    })
  },
  methods: {
    test: function () {
      this.snackbar.text = 'Campaign Status Updated'
      this.snackbar.context = 'success'
      this.snackbar.active = true
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
