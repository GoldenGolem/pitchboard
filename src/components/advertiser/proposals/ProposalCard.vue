<template>
  <v-flex sm4>
    <v-card
        class="proposal elevation-1 hoverable pt-2 pl-4 pr-4 pb-5" style="overflow: hidden; border-radius: 10px" @click.stop="$emit('showProposal')"
    >
      <div class="status-bar blue white--text text-sm-center pa-1" v-if="proposal.status === 2 && campaign.approval && proposal.approval_status === 0">
        <span class="label">Waiting for drafts</span>
      </div>
      <div class="status-bar orange white--text text-sm-center pa-1" v-if="proposal.status === 2 && campaign.approval && proposal.approval_status === 1">
        <span class="label">Approve drafts</span>
      </div>
      <div class="status-bar text-sm-center white--text blue pa-1"  v-if="proposal.status === 2 && (!campaign.approval || campaign.approval && proposal.approval_status === 2)">
        <span class="label">Waiting for Publication</span>
      </div>
      <v-layout justify-center align-center style="border-bottom: 1px solid #f3f3f3" class="pb-1" >
        <v-flex sm8 style="font-size: 12px" class="grey--text">
          <span v-if="proposal.status == 1">{{ proposal.created_at | moment("from") }}</span>
          <span v-if="proposal.status == 2">{{ proposal.decided_at | moment("from") }}</span>
        </v-flex>
        <v-flex sm8 class="text-sm-right">
          <v-chip color="primary" small text-color="white" class="ma-0">
            <strong>{{ proposal.fee_gross | currency }}</strong>
          </v-chip>
        </v-flex>
      </v-layout>
      <v-layout row align-center justify-center class="mt-2 pl-1 pr-1" @click.stop="$emit('showProposal')">
        <v-flex sm4>
          <v-avatar size="60px">
            <img :src="proposal.influencer.user.avatar">
          </v-avatar>
        </v-flex>
        <v-flex sm12 class="ml-3">
          <h3 class="proposal-title wrap-ellipsis">
            {{ proposal.influencer.name }}
          </h3>
          <div class="grey--text i-flex">
              4.7 <v-icon class="icon--x-small">star</v-icon>
              <a href="#profile" class="ml-2">Full Profile</a>
          </div>
        </v-flex>
      </v-layout>
      <div class="grey--text text--darken-2 proposal-pitch mt-3" v-html="proposal.pitch" @click.stop="$emit('showProposal')">
      </div>
      <v-layout row class="mt-3" justify-center align-center @click.stop="$emit('showProposal')">
        <v-flex sm7 style="border-right: 1px solid #eeeeee" class="pt-3 pb-3">
          <div class="primary--text display-1 mb-0">
            <strong>{{ totalReach | humanNumber }}</strong>
          </div>
          <div style="font-size: 12px; text-transform: uppercase" class="grey--text">
            Total Reach
          </div>
        </v-flex>
        <v-flex sm9 class="ml-2">
          <v-avatar v-for="network in proposal.networks"
                    :key="network.id"
                    :class="[ network.network ]"
                    class="mr-1 mt-1 mb-1 social-color--bg"
                    size="30px">
            <v-icon style="font-size: 16px;" color="white">fa-{{ network.network !== 'blog' ? network.network : 'rss' }}</v-icon>
          </v-avatar>
        </v-flex>
      </v-layout>
      <!--<div style="border-top: 1px solid #eeeeee">-->
        <!--<v-btn color="primary" large flat block>-->
          <!--<v-icon class="icon&#45;&#45;small" left>check</v-icon> Accept-->
        <!--</v-btn>-->
        <!--<v-btn color="red" small flat block style="font-weight: 300; font-size: 12px">-->
          <!--<v-icon class="icon&#45;&#45;small" left>close</v-icon> Dismiss-->
        <!--</v-btn>-->
      <!--</div>-->
    </v-card>
    <!--<v-card class="elevation-1 white">-->
    <!--<v-layout row>-->
    <!--<v-flex sm3 d-flex align-center justify-center class="b-r">-->
    <!--<img :src="proposal.influencer.user.avatar" style="flex-grow: 0">-->
        <!--</v-flex>-->
        <!--<v-flex sm7 class="b-r">-->
          <!--<v-layout column>-->
            <!--<v-flex style="border-bottom: 1px solid #eeeeee">-->
              <!--<v-card-text>-->
                <!--<v-layout class="mb-1">-->
                  <!--<v-flex sm10>-->
                    <!--<h4 class="title mb-0"><strong>{{ proposal.influencer.name }}</strong> <a href="javascript:;" class="body-1 ml-3">Full Profile ></a> </h4>-->
                  <!--</v-flex>-->
                  <!--<v-flex sm6 class="text-sm-right grey&#45;&#45;text">-->
                    <!--<span>{{ proposal.created_at | moment("from") }}</span>-->
                    <!--<v-chip small class="purple white&#45;&#45;text ma-0 ml-2"><strong>{{ proposal.fee_gross | currency }}</strong></v-chip>-->
                  <!--</v-flex>-->
                <!--</v-layout>-->
                <!--<p class="mb-0 grey&#45;&#45;text text&#45;&#45;darken-1 wrap-ellipsis">-->
                  <!--{{ proposal.influencer.bio }}-->
                <!--</p>-->
              <!--</v-card-text>-->
            <!--</v-flex>-->
            <!--<v-flex>-->
              <!--<v-card-text>-->
                <!--<p class="body-2 mb-2">-->
                  <!--Total Reach: <strong>{{ totalReach | humanNumber }}</strong>-->
                  <!--&middot;-->
                  <!--Includes Sharing On:-->
                <!--</p>-->
                <!--<v-layout row wrap>-->
                  <!--<v-flex sm3 d-flex align-start v-for="network, index in proposal.networks" :class="{ 'ml-4': index > 0 }" :key="index">-->
                    <!--<v-icon class="mr-1" v-if="network.network != 'blog'">fa-{{ network.network }}</v-icon>-->
                    <!--<v-icon class="mr-1" v-else>fa-rss</v-icon>-->
                    <!--<div>-->
                      <!--<div v-if="network.network === 'facebook'">Likes</div>-->
                      <!--<div v-if="network.network === 'instagram'">Followers</div>-->
                      <!--<div v-if="network.network === 'twitter'">Followers</div>-->
                      <!--<div v-if="network.network === 'youtube'">Subscribers</div>-->
                      <!--<div v-if="network.network === 'blog'">Visitors</div>-->
                      <!--<div class="title">-->
                        <!--<strong v-if="network.network === 'facebook'">{{ proposal.influencer.facebook_profile.likes | humanNumber(0) }}</strong>-->
                        <!--<strong v-if="network.network === 'instagram'">{{ proposal.influencer.instagram_profile.followers | humanNumber(0) }}</strong>-->
                        <!--<strong v-if="network.network === 'twitter'">{{ proposal.influencer.twitter_profile.followers | humanNumber(0) }}</strong>-->
                        <!--<strong v-if="network.network === 'youtube'">{{ proposal.influencer.youtube_profile.subscribers | humanNumber(0) }}</strong>-->
                        <!--<strong v-if="network.network === 'blog'">{{ proposal.influencer.blog_profile.visitors | humanNumber(0) }}</strong>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</v-flex>-->
                <!--</v-layout>-->
              <!--</v-card-text>-->
            <!--</v-flex>-->
          <!--</v-layout>-->
        <!--</v-flex>-->
        <!--<v-flex sm3 d-flex align-center justify-center class="text-sm-center">-->
          <!--<div>-->
            <!--<div>-->
              <!--<strong>AV. AGE</strong>-->
              <!--<div class="headline headline&#45;&#45;demographic">{{ proposal.influencer.top_age }}</div>-->
            <!--</div>-->
            <!--<div>-->
              <!--<strong>GENDER</strong>-->
              <!--<div class="headline headline&#45;&#45;demographic">{{ proposal.influencer.top_gender | capitalize }}</div>-->
            <!--</div>-->
            <!--<div>-->
              <!--<strong>LOCATION</strong>-->
              <!--<div class="headline headline&#45;&#45;demographic">{{ topCountries }}</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</v-flex>-->
        <!--<v-flex sm3 class="b-l">-->
          <!--<v-layout fill-height column align-center justify-center>-->
            <!--<v-flex d-flex align-center justify-center style="width: 100%; max-height: 33.33%; min-height: 33.33%;" class="btn&#45;&#45;layout b-b" @click.stop="$emit('accept', proposal)">-->
              <!--<v-flex sm3>-->
                <!--<v-icon class="primary&#45;&#45;text">done</v-icon>-->
              <!--</v-flex>-->
              <!--<v-flex sm6 class="subheading">-->
                <!--ACCEPT-->
              <!--</v-flex>-->
            <!--</v-flex>-->
            <!--<v-flex d-flex align-center justify-center style="width: 100%; max-height: 33.33%; min-height: 33.33%;" class="btn&#45;&#45;layout b-b" @click.stop="$emit('dismiss', proposal)">-->
              <!--<v-flex sm3>-->
                <!--<v-icon class="primary&#45;&#45;text">delete</v-icon>-->
              <!--</v-flex>-->
              <!--<v-flex sm6 class="subheading">-->
                <!--DISMISS-->
              <!--</v-flex>-->
            <!--</v-flex>-->
            <!--<v-flex d-flex align-center justify-center style="width: 100%; max-height: 33.33%; min-height: 33.33%;" class="btn&#45;&#45;layout b-b" @click.stop="$emit('message', proposal)">-->
              <!--<v-flex sm3>-->
                <!--<v-icon class="primary&#45;&#45;text">mail_outline</v-icon>-->
              <!--</v-flex>-->
              <!--<v-flex sm6 class="subheading">-->
                <!--MESSAGE-->
              <!--</v-flex>-->
            <!--</v-flex>-->
          <!--</v-layout>-->
        <!--</v-flex>-->
      <!--</v-layout>-->
    <!--</v-card>-->
  </v-flex>
</template>

<script>

  export default {
    components: {
    },
    props: ['proposal', 'campaign'],
    data () {
      return {
      }
    },
    mounted() {
    },
    computed: {
      totalReach() {
        let total = 0
        for (let network of this.proposal.networks) {
          if (network.network === 'facebook') total += this.proposal.influencer.facebook_profile.likes
          if (network.network === 'instagram') total += this.proposal.influencer.instagram_profile.followers
          if (network.network === 'twitter') total += this.proposal.influencer.twitter_profile.followers
          if (network.network === 'youtube') total += this.proposal.influencer.youtube_profile.subscribers
          if (network.network === 'blog') total += this.proposal.influencer.blog_profile.visitors_monthly
        }
        return total
      },
      topCountries() {
        return this.proposal.influencer.top_countries.map(c => {return c.country}).join(', ')
      },
      strippedPitch() {
//        let stripedHtml = this.proposal.pitch.replace(/<[^>]+>/g, '');
//        var decodedStripedHtml = he.decode(stripedHtml);
//
//        let tmp = document.createElement("DIV");
//        tmp.innerHTML = this.proposal.pitch;
//        return tmp.textContent || tmp.innerText || "";
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card.hoverable:hover {
    cursor: pointer;
  }
  .proposal .proposal-title {
    font-size: 20px !important;
    font-weight: 600;
  }
  .proposal .proposal-pitch {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 60px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .headline--demographic {
    font-size: 18px !important;
  }

  .card .status-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    /*transform: translateY(90%);*/
    /*transition: all 0.2s ease;*/
    /*will-change: transform;*/
    font-size: 12px;
    border-radius: 0px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    /*box-shadow: 0 7px 14px 0 rgba(50,50,93,.1), 0 3px 6px 0 rgba(0,0,0,.07) !important;*/
  }

  .card .status-bar .label {
    /*opacity: 0;*/
    /*transition: all 0.3s ease-in-out;*/
    /*will-change: opacity;*/
  }

  .card:hover .status-bar {
    /*transform: translateY(0%);*/
  }

  .card:hover .status-bar .label {
    /*opacity: 1;*/
  }
</style>
