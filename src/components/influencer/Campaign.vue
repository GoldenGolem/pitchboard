<template>
  <div class="main-content">
    <v-btn flat small class="global-back grey--text mb-5" tag="a" :to="{ 'path': '/advertiser' }" exact>
      <v-icon left>chevron_left</v-icon>
      Back to all campaigns
    </v-btn>
    <div>
      <div class="">
        <v-layout row>
          <v-flex sm3>
            <v-avatar style="position: absolute; z-index: 3" :size="'180px'" class="elevation-1 white">
              <img :src="campaign.logo_url" v-if="campaign">
            </v-avatar>
          </v-flex>
          <v-flex sm13>
            <v-layout column>
              <h1 class="headline mb-1"><strong>{{ campaign.brand }}</strong> &middot; {{ campaign.title }}</h1>
              <div class="mb-3">
                <router-link :to="{ 'path': '/advertiser' }" class="ml-0 purple--text">
                  <v-icon left class="purple--text body-1">fa-list-alt</v-icon>
                  View
                </router-link>
                <router-link :to="{ 'path': '/advertiser' }" class="ml-4 purple--text" tag="a">
                  <v-icon left class="purple--text body-1">fa-gear</v-icon>
                  Edit
                </router-link>
                <span class="ml-4 grey--text" v-if="campaign">
                  Started {{ campaign.created_at | moment("from") }}
                </span>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-container fluid class="pt-0 pb-0 white" style="position: absolute; left: 0">
          <v-container class="pt-0 pb-0">
            <v-layout row>
              <v-flex offset-sm3 sm13>
                <v-layout row>
                  <v-flex sm10>
                    <v-tabs class="tabs--condensed">
                      <v-tabs-bar class="white">
                        <v-tabs-item :to="{ name: 'viewCampaignOverview' }" exact>
                          <v-icon class="orange--text">assignment</v-icon>
                          Overview
                        </v-tabs-item>
                        <v-tabs-item :to="{ name: 'viewCampaignProposals' }" exact>
                          <v-icon class="red--text">list</v-icon>
                          Proposals
                        </v-tabs-item>
                        <v-tabs-item :to="{ name: 'viewCampaignAccepted' }" exact>
                          <v-icon class="green--text">done_all</v-icon>
                          Accepted
                        </v-tabs-item>
                        <v-tabs-item :to="{ name: 'viewCampaignPublished' }" exact>
                          <v-icon class="purple--text">cloud_done</v-icon>
                          Published
                        </v-tabs-item>
                        <v-tabs-item :to="{ name: 'viewCampaignStats' }" exact>
                          <v-icon class="primary--text">trending_up</v-icon>
                          Stats
                        </v-tabs-item>
                        <v-tabs-slider
                            :class="{
                              'purple': $route.name === 'viewCampaignPublished',
                              'orange': $route.name === 'viewCampaignOverview',
                              'red': $route.name === 'viewCampaignProposals',
                              'green': $route.name === 'viewCampaignAccepted',
                              'primary': $route.name === 'viewCampaignStats'
                            }"
                        ></v-tabs-slider>
                      </v-tabs-bar>
                    </v-tabs>
                  </v-flex>
                  <v-flex class="d-flex" sm6 align-center>
                    <v-menu offset-y style="width: 50px">
                      <span slot="activator" class="grey--text">Sort By <v-icon class="title" right>fa-caret-down</v-icon></span>
                      <v-list>
                        <v-list-tile @click=""> <v-list-tile-title>Total Clicks</v-list-tile-title> </v-list-tile>
                        <v-list-tile @click=""> <v-list-tile-title>Total Engagement</v-list-tile-title> </v-list-tile>
                        <v-list-tile @click=""> <v-list-tile-title>Total Shares</v-list-tile-title> </v-list-tile>
                      </v-list>
                    </v-menu>
                    <div class="fill-height d-flex align-center justify-end pl-4" style="border-left: 1px solid #eeeeee;">
                      <span class="grey-text">Campaign Status:</span>
                      <toggle-button
                          :value="campaign.status === 10"
                          :color="{checked: '#03a9f4', unchecked: '#e6e6e6'}"
                          :labels="{checked: 'LIVE', unchecked: 'OFF'}"
                          :width="70"
                          :height="30"
                          :sync="true"
                      />
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-container>
      </div>

      <transition name="fade-transition">
        <router-view :campaign="campaign"></router-view>
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
    mounted() {
      this.$http.get('campaign/' + this.$route.params.id).then(data => {
        this.campaign = data.data
      })
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
