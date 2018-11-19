<template>
  <v-flex sm4 :class="{ 'third': threeColumns }">
    <v-card
        class="proposal elevation-1"
        :hover="true">
      <v-card-media :src="campaign.image_url" height="160px">
        <v-layout row class="pa-2">
          <v-flex sm10 v-if="campaign.approval && [0, 1].indexOf(proposal.approval_status) > -1">
            <v-avatar v-for="network in proposal.networks"
                      :key="network.id"
                      :class="[{'grey lighten-3': !network.approve_content, 'social-color--bg': network.approve_content}, network.network]"
                      class="mr-1 mb-1 mt-1 hover-chip"
                      size="26px">
              <v-icon style="font-size: 16px;" :color="network.approve_content ? 'white' : 'grey'">fa-{{ network.network !== 'blog' ? network.network : 'rss' }}</v-icon>
            </v-avatar>
          </v-flex>
          <v-flex sm10 v-else>
            <v-avatar v-for="network in proposal.networks"
                      :key="network.id"
                      :class="[{'grey lighten-3': !network.status, 'social-color--bg': network.status}, network.network]"
                      class="mr-1 mb-1 mt-1 hover-chip"
                      size="26px">
              <v-icon style="font-size: 16px;" :color="network.status ? 'white' : 'grey'">fa-{{ network.network !== 'blog' ? network.network : 'rss' }}</v-icon>
            </v-avatar>
          </v-flex>
          <v-flex sm6 class="text-sm-right">
            <v-chip color="primary" small text-color="white" class="elevation-1 hover-chip">
              <strong>{{ proposal.fee_gross | currency('$', 0) }}</strong>
            </v-chip>
          </v-flex>
        </v-layout>
        <div class="status-bar text-sm-center pa-1 white--text"
             :class="{ 'orange': proposal.approval_status === 0, 'green': proposal.approval_status === 1 }"
             v-if="status === 'accepted' && campaign.approval">
          <span v-if="proposal.approval_status === 0" class="label">
            <v-icon class="icon--x-small mr-1" color="white">edit</v-icon> Draft Required
          </span>
          <span v-if="proposal.approval_status === 1" class="label">
            <v-icon class="icon--x-small mr-1" color="white">check</v-icon> Draft Submitted
          </span>
        </div>
        <div class="status-bar label text-sm-center pa-1 white--text"
             v-if="status === 'published'">
          <span class="label">
            <v-icon class="icon--x-small mr-1" color="white">check</v-icon> Draft Submitted
          </span>
        </div>
      </v-card-media>
      <!--<v-card-title class="pt-3 pb-2">-->
      <!--</v-card-title>-->
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
              <span>by <v-avatar size="22px"><img :src="campaign.advertiser.user.avatar"></v-avatar> {{ campaign.advertiser.name }}</span>
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
    props: [
      'campaign', 'proposal', 'profile', 'threeColumns'
    ],
    data () {
      return {
      }
    },
    mounted() {
    },
    computed: {
      status() {
        if (this.proposal.status === 1) return 'pending'
        if (this.proposal.status === 2) return 'accepted'
        if (this.proposal.status === -1) return 'declined'
        if (this.proposal.status === 0) return 'cancelled'
        if (this.proposal.status === 3) return 'published'
      },
      networks() {
        return {
          'facebook': this.proposal.networks.find(n => {return n.network === 'facebook'}),
          'instagram': this.proposal.networks.find(n => {return n.network === 'instagram'}),
          'twitter': this.proposal.networks.find(n => {return n.network === 'twitter'}),
          'youtube': this.proposal.networks.find(n => {return n.network === 'youtube'}),
          'blog': this.proposal.networks.find(n => {return n.network === 'blog'})
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
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

  .card .status-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateY(80%);
    transition: all 0.2s ease;
    will-change: transform;
    font-size: 12px;
    /*box-shadow: 0 7px 14px 0 rgba(50,50,93,.1), 0 3px 6px 0 rgba(0,0,0,.07) !important;*/
  }

  .card .status-bar .label {
    opacity: 0;
    transition: all 0.3s ease-in-out;
    will-change: opacity;
  }

  .card:hover .status-bar {
    transform: translateY(0%);
  }

  .card:hover .status-bar .label {
    opacity: 1;
  }
  /*.proposal.card {*/
  /*border-radius: 10px;*/
  /*}*/
</style>