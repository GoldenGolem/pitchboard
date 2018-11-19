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
            <div style="position: absolute; z-index: 3; width: 210px; height: 120px" class="elevation-1 white">
              <img :src="campaign.image_url" v-if="campaign" style="object-fit: cover; width: 210px; height: 120px">
            </div>
          </v-flex>
          <v-flex sm13 class="ml-3">
            <v-layout column v-if="campaign">
              <h1 class="headline mb-1"><strong>{{ campaign.brand }}</strong> &middot; {{ campaign.title }}</h1>
              <div class="mb-3">
                <a @click.prevent="campaignModal = true" class="ml-0 primary--text">
                  <v-icon left color="primary" class="body-1">fa-list-alt</v-icon>
                  View
                </a>
                <router-link :to="{ 'name': 'editCampaign', 'id': $route.params.id }" class="ml-4 primary--text" tag="a">
                  <v-icon left color="primary" class="body-1">fa-gear</v-icon>
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
              <v-flex offset-sm3 sm13 class="pl-3">
                <v-layout row>
                  <v-flex sm12>
                    <v-tabs class="tabs--condensed white">
                        <v-tab :to="{ name: 'viewCampaignOverview', params: { id: $route.params.id } }">
                          <v-icon class="orange--text">assignment</v-icon>
                          Overview
                        </v-tab>
                        <v-tab :to="{ name: 'viewCampaignProposals', params: { id: $route.params.id } }">
                          <v-icon class="red--text">list</v-icon>
                          Proposals
                        </v-tab>
                        <v-tab :to="{ name: 'viewCampaignAccepted', params: { id: $route.params.id } }">
                          <v-icon class="green--text">done_all</v-icon>
                          In Progress
                        </v-tab>
                        <v-tab :to="{ name: 'viewCampaignPublished', params: { id: $route.params.id } }">
                          <v-icon class="purple--text">cloud_done</v-icon>
                          Published
                        </v-tab>
                        <v-tab :to="{ name: 'viewCampaignStats', params: { id: $route.params.id } }">
                          <v-icon class="primary--text">trending_up</v-icon>
                          Stats
                        </v-tab>
                        <v-tabs-slider :color="tabsSliderColor"></v-tabs-slider>
                    </v-tabs>
                  </v-flex>
                  <v-flex sm4>
                    <!--<v-menu offset-y style="width: 50px">-->
                      <!--<span slot="activator" class="grey&#45;&#45;text">Sort By <v-icon class="title" right>fa-caret-down</v-icon></span>-->
                      <!--<v-list>-->
                        <!--<v-list-tile @click=""> <v-list-tile-title>Total Clicks</v-list-tile-title> </v-list-tile>-->
                        <!--<v-list-tile @click=""> <v-list-tile-title>Total Engagement</v-list-tile-title> </v-list-tile>-->
                        <!--<v-list-tile @click=""> <v-list-tile-title>Total Shares</v-list-tile-title> </v-list-tile>-->
                      <!--</v-list>-->
                    <!--</v-menu>-->
                    <div class="fill-height d-flex align-center justify-end pl-4" style="border-left: 1px solid #eeeeee;" v-if="campaign">
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

      <transition name="fade" mode="out-in">
        <router-view :campaign="campaign" v-if="campaign" @campaignUpdated="campaignUpdated"></router-view>
      </transition>

    </div>

    <view-campaign-modal
        :campaign="campaign"
        :campaignModal="campaignModal"
        @modalToggled="toggleCampaignModal"
    ></view-campaign-modal>

  </div>
</template>

<script>
  import ViewCampaignModal from './campaign/ViewCampaignModal'

  export default {
    components: {
      ViewCampaignModal
    },
    data () {
      return {
        'campaign': null,
        'campaignModal': false,
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
      campaignLogoSize() {
        if (this.$route.name === 'viewCampaignOverview') return "180px"

        return "100px"
      }
    },
    mounted() {
      this.fetchCampaign()
    },
    methods: {
      fetchCampaign() {
        this.$http.get('campaign/' + this.$route.params.id).then(data => {
          this.campaign = data.data
        })
      },
      campaignUpdated(campaign) {
        this.campaign = campaign
      },
      toggleCampaignModal(value) {
        this.campaignModal = value
      }
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
