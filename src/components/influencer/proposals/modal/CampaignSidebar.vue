<template>
  <v-flex sm5 class="modal-sidebar">
    <div :style="{ 'background': 'url(\''+campaign.image_url+'\')'}" class="modal-sidebar-bg">
    </div>
    <div class="modal-sidebar-content">
      <v-layout column fill-height class="pa-4 pt-5 pb-5" style="overflow: auto">
        <v-flex>
          <v-layout row>
            <!--<v-flex sm3>-->
              <!--<v-avatar size="60px"><img :src="campaign.logo_url"></v-avatar>-->
            <!--</v-flex>-->
            <v-flex sm16 class=" white--text">
              <h2 class="campaign-title" @click="$emit('goTo', 'campaign')" style="cursor: pointer">
                {{ campaign.title }}
              </h2>
              <div class="white--text mt-1" style="font-size: 12px">
                <v-avatar size="18px" class="mr-1">
                  <img :src="campaign.advertiser.user.avatar">
                </v-avatar>
                {{ campaign.advertiser.name || campaign.advertiser.short_name }}
                &middot;
                Started {{ campaign.created_at | moment("from") }}
              </div>
            </v-flex>
          </v-layout>
          <div class="mt-4 white--text">
            {{ campaign.overview }}
          </div>
          <div class="mt-4 white--text">
            <div class="grey--text text--darken-1">Content Approval</div>
            <div v-if="campaign.approval">
              <v-icon class="icon--small" color="white">check</v-icon> Required
            </div>
            <div v-else>
              <v-icon class="icon--small" color="white">close</v-icon> Not Required
            </div>
          </div>
          <div class="mt-4 white--text" v-if="proposal && proposal.status === 2">
            <v-layout row align-center justify-center>
              <v-flex sm16 class="grey--text text--darken-1">
                Your Proposal
              </v-flex>
              <!--<v-flex sm11 class="text-sm-right">-->
                <!--<strong>{{ proposal.fee_gross | currency }}</strong>-->
                <!--<v-chip small class="primary white&#45;&#45;text">-->
                  <!--Funds Reserved-->
                <!--</v-chip>-->
              <!--</v-flex>-->
            </v-layout>
            <div>
              <strong>{{ proposal.fee_gross | currency }}</strong>
              <v-chip small class="primary white--text">
                Funds In Escrow
              </v-chip>
            </div>
          </div>
          <div class="mt-4 white--text" v-if="proposal && proposal.status === 3">
            <div class="grey--text text--darken-1">Payment</div>
            <div>
              <strong class="mr-1">{{ proposal.fee_net | currency }}</strong>
              <v-chip small class="primary white--text">
                Payment Due &middot; <strong class="ml-1">{{ proposal.published_at | moment("add", "7 days", "MMM DD") }}</strong>
              </v-chip>
            </div>
          </div>
          <div class="mt-4 white--text" v-if="proposal">
            <div class="grey--text text--darken-1">Status</div>
            <div v-if="proposal.status >= 1">
              <v-icon class="icon--x-small" color="white">check</v-icon> Proposal sent on {{ proposal.created_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 2">
              <v-icon class="icon--x-small" color="white">check</v-icon> Proposal accepted on {{ proposal.decided_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 2 && proposal.approval_status >= 1">
              <v-icon class="icon--x-small" color="white">check</v-icon> Drafts submitted on {{ proposal.drafts_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 2 && proposal.approval_status >= 2">
              <v-icon class="icon--x-small" color="white">check</v-icon> Drafts accepted on {{ proposal.drafts_accepted_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 3">
              <v-icon class="icon--x-small" color="white">check</v-icon> Content published on {{ proposal.published_at | moment("MMM DD") }}
            </div>
          </div>
          <div class="mt-5 mb-2 grey--text text--darken-1">Advertiser</div>
          <v-layout class="white--text">
            <v-flex sm3>
              <v-avatar size="45px" class="mr-1">
                <img :src="campaign.advertiser.user.avatar">
              </v-avatar>
            </v-flex>
            <v-flex sm13>
              <div class="subheading">{{ campaign.advertiser.name || campaign.advertiser.short_name }}</div>
              <div>
                <star-rating
                    v-model="advertiserRating"
                    :star-size="14"
                    :padding="3"
                    inline
                    read-only
                    active-color="#03a9f4"
                    text-class="rating"
                    :increment="0.1"
                ></star-rating>
              </div>
              <div v-if="campaign.advertiser.country" class="caption">
                <v-icon color="white" class="icon--small">place</v-icon>
                <span v-if="campaign.advertiser.city">{{ campaign.advertiser.city }}, </span>
                <span v-if="campaign.advertiser.country">{{ campaign.advertiser.country }}</span>
                <span v-if="campaign.advertiser.timezone">&middot; {{ moment().tz(campaign.advertiser.timezone).format('h:mma') }}</span>
              </div>
            </v-flex>
          </v-layout>
          <v-layout class="mt-4 white--text" row wrap style="font-size: 12px">
            <v-flex sm8 class="mb-2">
              <v-layout>
                <v-flex sm2>
                  <v-icon color="white" class="icon--small">poll</v-icon>
                </v-flex>
                <v-flex sm14 class="pl-2 pr-4">
                  <div><strong>0 campaigns</strong></div>
                  <div>0 published posts</div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex sm8 class="mb-2">
              <v-layout>
                <v-flex sm2>
                  <v-icon color="white" class="icon--small">attach_money</v-icon>
                </v-flex>
                <v-flex sm14 class="pl-2 pr-4">
                  <div><strong>0 spent</strong></div>
                  <div>$0 per proposal</div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

        </v-flex>
        <v-flex style="flex: 0 1 auto" align-center v-if="!proposal || proposal.status === 1">
          <v-layout justify-center>
            <v-btn color="white" class="primary--text" @click="sendProposal" v-if="!proposal">
              <v-icon left>mail_outline</v-icon> Send Proposal
            </v-btn>
            <v-btn color="white" class="primary--text" @click="editProposal" v-if="proposal && proposal.status === 1">
              <v-icon left>edit</v-icon> Edit Proposal
            </v-btn>
          </v-layout>
        </v-flex>
        <!--<div v-if="proposal.status === 2" class="proposal-label">-->
          <!--<span class="primary&#45;&#45;text">Proposal Accepted</span><br>-->
        <!--</div>-->
      </v-layout>
    </div>
  </v-flex>
</template>

<script>
  import StarRating from 'vue-star-rating'
  import moment from 'moment-timezone'

  export default {
    components: {
      StarRating
    },
    props: [
      'campaign', 'proposal'
    ],
    data () {
      return {
        'moment': moment
      }
    },
    mounted() {
    },
    computed: {
      advertiserRating() {
        return 4
      }
    },
    methods: {
      sendProposal() {
        this.$emit('sendProposal')
      },
      editProposal() {
        this.$emit('editProposal')
      },
    }
  }
</script>

<style scoped>
  .proposal-label {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ffffff;
  }
</style>

<style>
  .vue-star-rating-rating-text {
    margin-top: 0 !important;
    margin-left: 5px !important;
    font-size: 14px;
  }
</style>