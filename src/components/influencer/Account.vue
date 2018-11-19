<template>
  <div>
    <div class="">
      <!--<v-layout row>-->
        <!--<v-flex sm3>-->
          <!--<v-avatar style="position: absolute; z-index: 3" :size="'180px'" class="elevation-1 white">-->
            <!--<img :src="influencer.user.avatar" v-if="influencer">-->
          <!--</v-avatar>-->
        <!--</v-flex>-->
        <!--<v-flex sm13>-->
          <!--<v-layout column>-->
            <!--<h1 class="headline mb-1"><strong>{{ influencer.name }}</strong></h1>-->
          <!--</v-layout>-->
        <!--</v-flex>-->
      <!--</v-layout>-->
      <!--<v-container fluid class="pt-0 pb-0 white" style="position: absolute; left: 0">-->
        <!--<v-container class="pt-0 pb-0">-->
          <!--<v-layout row>-->
            <!--<v-flex offset-sm3 sm13>-->
              <!--<v-layout row>-->
                <!--<v-flex sm10>-->
                  <!--<v-tabs class="tabs&#45;&#45;condensed">-->
                    <!--<v-tabs-bar class="white">-->
                      <!--<v-tabs-item :to="{ name: 'viewCampaignOverview' }" exact>-->
                        <!--<v-icon class="orange&#45;&#45;text">assignment</v-icon>-->
                        <!--Overview-->
                      <!--</v-tabs-item>-->
                      <!--<v-tabs-item :to="{ name: 'viewCampaignProposals' }" exact>-->
                        <!--<v-icon class="red&#45;&#45;text">list</v-icon>-->
                        <!--Proposals-->
                      <!--</v-tabs-item>-->
                      <!--<v-tabs-item :to="{ name: 'viewCampaignAccepted' }" exact>-->
                        <!--<v-icon class="green&#45;&#45;text">done_all</v-icon>-->
                        <!--Accepted-->
                      <!--</v-tabs-item>-->
                      <!--<v-tabs-item :to="{ name: 'viewCampaignPublished' }" exact>-->
                        <!--<v-icon class="purple&#45;&#45;text">cloud_done</v-icon>-->
                        <!--Published-->
                      <!--</v-tabs-item>-->
                      <!--<v-tabs-item :to="{ name: 'viewCampaignStats' }" exact>-->
                        <!--<v-icon class="primary&#45;&#45;text">trending_up</v-icon>-->
                        <!--Stats-->
                      <!--</v-tabs-item>-->
                      <!--<v-tabs-slider :color="tabsSliderColor"></v-tabs-slider>-->
                    <!--</v-tabs-bar>-->
                  <!--</v-tabs>-->
                <!--</v-flex>-->
              <!--</v-layout>-->
            <!--</v-flex>-->
          <!--</v-layout>-->
        <!--</v-container>-->
      <!--</v-container>-->
    </div>

    <v-layout row justify-center>
      <v-flex sm11>
        <v-card class="elevation-1">
          <iframe :src="paymentRailsSrc" v-if="paymentRailsSrc" style="width: 800px; min-height: 900px; border: none" frameborder="0"></iframe>
        </v-card>
      </v-flex>
    </v-layout>



    <router-view></router-view>

  </div>

</template>

<script>
  export default {
    data () {
      return {
        'influencer': null,
        'paymentRailsSrc': null
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
      }
    },
    mounted() {
      this.$http.get('/influencer/me').then(result => {
        this.influencer = result.data
      })

      this.$http.get('/influencer/payments').then(result => {
        this.paymentRailsSrc = result.data.paymentrails_src
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
