<template>
  <v-flex sm4 :class="{ 'third': threeColumns }">
    <v-card
        class="proposal elevation-1"
        :class="{ 'elevation-0': campaign.submitted }"
        :hover="!campaign.submitted"
        @click.native.stop="triggerSendProposal(campaign)">
      <v-card-media :src="campaign.image_url" height="160px" class="pa-2">
        <v-layout class="text-sm-right">
          <v-flex sm16>
            <v-chip color="primary" text-color="white" class="elevation-1 hover-chip">
              Up to ${{ campaign.content_budget }}
            </v-chip>
          </v-flex>
        </v-layout>
      </v-card-media>
      <v-card-text class="pt-3">
        <div>
          <h3 class="proposal-title mb-3">
            {{ campaign.title }}
          </h3>
          <div class="proposal-overview">
            {{ campaign.overview }}
          </div>
        </div>
        <v-layout row align-center class="mt-2">
          <v-flex sm13>
            <div class="proposal-highlights grey--text text--darken-4">
              <span>by <v-avatar size="22px"><img :src="campaign.advertiser.user.avatar"></v-avatar> {{ campaign.advertiser.short_name }}</span>
            </div>
          </v-flex>
          <v-flex sm3>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>

  export default {
    components: {
    },
    props: [
      'campaign', 'threeColumns'
    ],
    data () {
      return {
      }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      triggerSendProposal(campaign) {
        this.$emit('triggerCampaign', campaign)
      },
    }
  }
</script>

<style scoped>
  .opportunity .opportunity-title {
    font-size: 18px !important;
    font-weight: 600;
  }
  .opportunity .opportunity-highlights, .opportunity .opportunity-highlights .icon {
    font-size: 14px;
    font-weight: 200;
  }
  .opportunity .opportunity-highlights span {
    margin-left: 3px;
    margin-right: 3px;
  }
  .opportunity .opportunity-highlights span:first-child {
    margin-left: 0;
  }
  .opportunity .opportunity-highlights span:last-child {
    margin-right: 0;
  }
  .proposal .proposal-title {
    font-size: 24px !important;
    font-weight: 600;
    line-height: 28px;
    height: 56px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 60px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical
  }
  .proposal .proposal-overview {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 65px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical
  }

  .proposal .proposal-highlights {
    font-size: 12px;
    font-weight: 200;
  }
  .proposal .proposal-highlights .icon {
    font-size: 14px;
  }
  .proposal .proposal-highlights span {
    margin-left: 3px;
    margin-right: 3px;
  }
  .proposal .proposal-highlights span:first-child {
    margin-left: 0;
  }
  .proposal .proposal-highlights span:last-child {
    margin-right: 0;
  }
  .card.hoverable:hover {
    cursor: pointer;
  }
  .campaign-image {
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat !important;
    background-position: center center !important;
    background-size: cover !important;
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -o-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
    transform: scale(1.2);
  }

  .campaign-image:after {
    position: absolute;
    z-index: 2;
    display: block;
    content: "";
    top: 0; right: 0; bottom: 0; left: 0;
    background: rgba(0,0,0,0.5);
  }

  .proposal.card .hover-chip {
    opacity: 0.8;
    transition: all 0.1s ease-in-out;
  }
  .proposal.card:hover .hover-chip {
    opacity: 0.8;
  }
  /*.proposal.card {*/
    /*border-radius: 10px;*/
  /*}*/
</style>