<template>
  <div class="main-content">
    <div>
      <div class="">
        <v-layout row>
          <v-flex sm2>
            <v-avatar style="position: absolute; z-index: 3;" size="120px" class="elevation-1 white">
              <img :src="user.avatar" v-if="user" style="object-fit: cover">
            </v-avatar>
          </v-flex>
          <v-flex sm14>
            <v-layout column v-if="user">
              <h1 class="headline mb-1">{{ user.advertiser.name }}</h1>
              <div class="mb-3">
                <span class="grey--text" v-if="user">
                  Member since {{ user.created_at | moment("from") }}
                </span>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-container fluid class="pt-0 pb-0 white" style="position: absolute; left: 0">
          <v-container class="pt-0 pb-0">
            <v-layout row>
              <v-flex offset-sm2 sm14>
                <v-layout row>
                  <v-flex sm10>
                    <v-tabs class="tabs--condensed white">
                        <v-tab >
                          <v-icon class="orange--text">assignment</v-icon>
                          Overview
                        </v-tab>
                        <v-tab >
                          <v-icon class="red--text">money</v-icon>
                          Payments
                        </v-tab>
                        <v-tab >
                          <v-icon class="green--text">done_all</v-icon>
                          Feedback
                        </v-tab>
                        <v-tab >
                          <v-icon class="purple--text">cloud_done</v-icon>
                          Settings
                        </v-tab>
                        <v-tabs-slider :color="tabsSliderColor"></v-tabs-slider>
                    </v-tabs>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-container>
      </div>

      <transition name="fade" mode="out-in">
        <router-view v-if="campaign"></router-view>
      </transition>

    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        'campaign': null,
        'acceptModal': false,
        'tab': '1'
      }
    },
    computed: {
      tabsSliderColor() {
        switch (this.$route.name) {
          case 'viewCampaignPublished':
            return "purple"
          case 'viewCampaignOverview':
            return "orange"
          case 'viewCampaignProposals':
            return "red"
          case 'viewCampaignAccepted':
            return "green"
          case 'viewCampaignStats':
            return "primary"
        }

        return 'accent';
      },
      user() {
        return this.$store.state.user.data
      },
    },
    mounted() {
//      this.$http.get('campaign/' + this.$route.params.id).then(data => {
//        this.campaign = data.data
//      })
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .btn.global-back {
    margin-left: 0;
    background: transparent;
  }

  .btn.global-back .btn__content {
    padding-left: 0;
  }

</style>
