<template>
  <div style="margin-top: 100px">
    <h5 class="subheading grey--text pl-3">Summary</h5>
    <v-card>
      <v-layout row>
        <v-flex md3 style="border-right: 1px solid #eeeeee">
          <v-card-text class="pa-4">
            <h4 class="display-1 primary--text mb-0">{{ campaign.cost | currency('$', 0) }}</h4>
            <h5 class="body-2 mb-5"><strong>TOTAL SPEND</strong></h5>
            <v-progress-linear :v-model="40" class="mb-1"></v-progress-linear>
            <v-layout class="grey--text text--darken-1">
              <v-flex sm8 class="text-sm-left">
                {{ campaign.cost | currency('$', 0) }}
              </v-flex>
              <v-flex sm8 class="text-sm-right">
                {{ campaign.budget | currency('$', 0) }}
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-flex>
        <v-flex md3>
          <v-card-text class="pa-4">
            <h4 class="display-1 primary--text mb-0">{{ campaign.open }}</h4>
            <h5 class="body-2 mb-0"><strong>OPEN PROPOSALS</strong></h5>
            <v-chip small class="black white--text"><strong>{{ campaign.open_cost | currency }}</strong></v-chip>
            <v-btn tag="a" :to="{ 'name': 'viewCampaignProposals' }" class="purple" block dark>VIEW PROPOSALS</v-btn>
          </v-card-text>
        </v-flex>
        <v-flex md3>
          <v-card-text class="pa-4">
            <h4 class="display-1 primary--text mb-0">{{ campaign.accepted }}</h4>
            <h5 class="body-2 mb-0"><strong>WORK IN PROGRESS</strong></h5>
            <v-chip small class="black white--text"><strong>{{ campaign.accepted_cost | currency }}</strong></v-chip>
            <v-btn tag="a" :to="{ 'name': 'viewCampaignAccepted' }" class="purple" block dark>VIEW IN PROGRESS</v-btn>
          </v-card-text>
        </v-flex>
        <v-flex md3 style="border-right: 1px solid #eeeeee">
          <v-card-text class="pa-4">
            <h4 class="display-1 primary--text mb-0">{{ campaign.published }}</h4>
            <h5 class="body-2 mb-0"><strong>PUBLISHED POSTS</strong></h5>
            <v-chip small class="black white--text"><strong>{{ campaign.published_cost | currency }}</strong></v-chip>
            <v-btn tag="a" :to="{ 'name': 'viewCampaignPublished' }" class="purple" block dark>VIEW PUBLISHED</v-btn>
          </v-card-text>
        </v-flex>
        <v-flex md4>
          <v-layout fill-height column align-center justify-center>
            <v-flex d-flex align-center style="width: 100%; max-height: 33.33%; min-height: 33.33%; border-bottom: 1px solid #eeeeee">
              <router-link :to="{ 'name': 'viewCampaignPublished' }" class="d-flex align-center pa-0 pl-3 grey--text text--darken-2">
                <span class="display-1 primary--text">1</span>
                <span class="subheading">DRAFTS NEED REVIEW</span>
              </router-link>
            </v-flex>
            <v-flex d-flex align-center style="width: 100%; max-height: 33.33%; min-height: 33.33%; border-bottom: 1px solid #eeeeee">
              <router-link :to="{ 'name': 'viewCampaignPublished' }" class="d-flex align-center pa-0 pl-3 grey--text text--darken-2">
                <span class="display-1 primary--text">3</span>
                <span class="subheading">POSTS NEED FEEDBACK</span>
              </router-link>
            </v-flex>
            <v-flex d-flex align-center style="width: 100%; max-height: 33.33%; min-height: 33.33%">
              <router-link :to="{ 'name': 'viewCampaignPublished' }" class="d-flex align-center pa-0 pl-3 grey--text text--darken-2">
                <span class="display-1 primary--text">5</span>
                <span class="subheading">NEW MESSAGES</span>
              </router-link>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>

    <h5 class="subheading grey--text pl-3 mt-5">Performance</h5>

    <v-layout>
      <v-flex sm3>
        <v-card flat class="white" style="cursor: pointer">
          <v-card-text>
            <h5 class="body-2 mb-0"><strong>TOTAL RECENT CLICKS</strong></h5>
            <h4 class="mb-0 mt-0">{{ campaign.clicks }}</h4>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm3 class="ml-1">
        <v-card flat dark class="primary" style="cursor: pointer">
          <v-card-text>
            <h5 class="body-2 mb-0"><strong>TOTAL RECENT VIEWS</strong></h5>
            <h4 class="mb-0 mt-0">{{ campaign.impressions }}</h4>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm3 class="ml-1">
        <v-card flat dark class="primary" style="cursor: pointer">
          <v-card-text>
            <h5 class="body-2 mb-0"><strong>AVG CPV</strong></h5>
            <h4 class="mb-0 mt-0">{{ campaign.clicks }}</h4>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card flat>
      <v-card-text>
        <campaign-chart :data="chart" :options="{ legend: { display: false }, scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        } }" :height="100"></campaign-chart>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import CampaignChart from './CampaignChart'

  export default {
    components: { CampaignChart },
    props: ['campaign'],
    data () {
      return {
        'chart': {
          'labels': ['1', '2', '3', '4', '5', '6'],
          'datasets': [
            {
              label: 'Clicks',
              backgroundColor: '#03a9f4',
              data: [158, 154, 156, 122, 134, 135]
            },
          ]
        }
      }
    },
    mounted() {
      console.log(this.campaignProp)
    },
    computed: {
      campaignProp() {
        return this.campaign
      }
    },
    methods: {
      test: function () {
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
