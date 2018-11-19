<template>
  <v-flex sm5 class="modal-sidebar">
    <div :style="{ 'background': 'url(\''+proposal.influencer.user.avatar+'\')'}" class="modal-sidebar-bg">
    </div>
    <div class="modal-sidebar-content">
      <v-layout column fill-height class="pa-4 pt-5 pb-4" style="overflow: auto">
        <v-flex>
          <v-layout row justify-center align-center>
            <v-flex sm3>
              <v-avatar size="60px"><img :src="proposal.influencer.user.avatar"></v-avatar>
            </v-flex>
            <v-flex sm13 class="ml-3 white--text">
              <h2 class="campaign-title">{{ proposal.influencer.name }}</h2>
              <div>
                <v-chip small class="ml-0 mb-0 mt-1" color="primary" text-color="white">
                  <span v-if="proposal.status > 1">Fee Paid &middot;</span>
                  <span v-else>Fee </span>
                  <strong class="ml-1">{{ proposal.fee_gross | currency }}</strong>
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
          <div class="mt-4 grey--text text--darken-1">Your Campaign</div>
          <div class="white--text">
            <strong>{{ campaign.brand }}</strong> &middot; {{ campaign.title }}
          </div>
          <div class="mt-4 grey--text text--darken-1">Pitch</div>
          <div class="white--text" v-html="proposal.pitch">
          </div>
          <div class="mt-4 grey--text text--darken-1" v-if="proposal.status > 2">Live Content</div>
          <div class="mt-4 grey--text text--darken-1" v-else>Channels</div>
          <div class="white--text">
            <v-avatar v-for="network in proposal.networks"
                      :key="network.id"
                      :class="[ network.network ]"
                      class="mr-1 mt-1 mb-1 social-color--bg"
                      size="30px">
              <v-icon style="font-size: 16px;" color="white">fa-{{ network.network !== 'blog' ? network.network : 'rss' }}</v-icon>
            </v-avatar>
          </div>
          <div class="mt-4 white--text">
            <div class="grey--text text--darken-1">Status</div>
            <div v-if="proposal.status >= 1">
              <v-icon class="icon--x-small" color="white">check</v-icon> Proposal received on {{ proposal.created_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 2">
              <v-icon class="icon--x-small" color="white">check</v-icon> Proposal accepted on {{ proposal.decided_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 2 && proposal.approval_status >= 1">
              <v-icon class="icon--x-small" color="white">check</v-icon> Drafts received on {{ proposal.drafts_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 2 && proposal.approval_status >= 2">
              <v-icon class="icon--x-small" color="white">check</v-icon> Drafts approved on {{ proposal.drafts_accepted_at | moment("MMM DD") }}
            </div>
            <div v-if="proposal.status >= 3">
              <v-icon class="icon--x-small" color="white">check</v-icon> Posts published on {{ proposal.published_at | moment("MMM DD") }}
            </div>
          </div>
        </v-flex>
        <v-flex style="flex: 0 1 auto" align-center class="mt-4">
          <v-layout justify-center>
            <v-btn color="white" class="primary--text" @click.native="$emit('goto', 'drafts')" v-if="proposal.status === 2 && proposal.approval_status === 1">
              Approve Drafts
            </v-btn>
            <v-btn dark disabled v-if="campaign.approval && proposal.status === 2 && proposal.approval_status === 0">
              Influencer Creating Drafts...
            </v-btn>
            <v-btn dark disabled v-else-if="proposal.approval_status === 2">
              Influencer Publishing Posts...
            </v-btn>
            <v-btn dark disabled v-if="!campaign.approval && proposal.status === 2">
              Influencer Publishing Posts...
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </v-flex>
</template>

<script>
  export default {
    components: {
    },
    props: [
      'campaign', 'proposal'
    ],
    data () {
      return {
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