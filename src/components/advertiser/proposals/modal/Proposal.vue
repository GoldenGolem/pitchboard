<template>
  <div>
    <div class="text-sm-center display-1">
      <v-avatar size="100px" class="card-avatar elevation-1">
        <img :src="proposal.influencer.user.avatar">
      </v-avatar>
    </div>

    <div class="text-sm-center display-1" style="margin-top: 30px">
      <strong>{{ proposal.influencer.name }}</strong>
    </div>

    <div class="text-sm-center subheading grey--text text--darken-2">
      4.7 <v-icon class="icon--small">star</v-icon>
    </div>

    <div class="text-sm-center">
      <v-avatar v-for="network in proposal.networks"
                :key="network.id"
                :class="[ network.network ]"
                class="mr-1 mt-1 mb-1 social-color--bg"
                size="30px">
        <v-icon style="font-size: 16px;" color="white">fa-{{ network.network !== 'blog' ? network.network : 'rss' }}</v-icon>
      </v-avatar>
    </div>

    <div class="mt-3 mb-2 grey--text text--darken-2 text-sm-center">
      {{ proposal.influencer.bio }}
    </div>

    <v-layout row justify-center align-end class="mt-4">
      <v-flex sm4 class="text-xs-center">
        <div class="primary--text headline"><strong>{{ totalReach | humanNumber }}</strong></div>
        <div style="text-transform: uppercase" class="grey--text">Total Reach</div>
      </v-flex>
      <v-flex sm4 class="text-xs-center">
        <div class="title" style="font-weight: 300">{{ proposal.influencer.top_age }}</div>
        <div style="text-transform: uppercase" class="grey--text">Av. Age</div>
      </v-flex>
      <v-flex sm4 class="text-xs-center">
        <div class="title" style="font-weight: 300">{{ proposal.influencer.top_gender | capitalize }}</div>
        <div style="text-transform: uppercase" class="grey--text">Av. Gender</div>
      </v-flex>
      <v-flex sm4 class="text-xs-center">
        <div class="title" style="font-weight: 300">{{ topCountries }}</div>
        <div style="text-transform: uppercase" class="grey--text">Location</div>
      </v-flex>
    </v-layout>


    <v-layout row class="mt-5 mb-2" justify-center align-center>
      <v-flex sm8>
        <h4 class="title"><strong>PITCH</strong></h4>
      </v-flex>
      <v-flex sm8 class="text-sm-right">
              <span class="grey--text text--darken-1">
                received {{ proposal.created_at | moment("from") }}
              </span>
        <v-chip color="primary" text-color="white">
          Fee <strong class="ml-2">{{ proposal.fee_gross | currency }}</strong>
        </v-chip>
      </v-flex>
    </v-layout>

    <v-card white class="elevation-1">
      <v-card-text v-html="proposal.pitch"></v-card-text>
    </v-card>

    <h4 class="title mt-5 mb-2"><strong>CHANNELS</strong></h4>
    <v-card white class="elevation-1">
      <v-list two-line>
        <template v-for="(network, index) in proposal.networks">
          <v-list-tile class="publish-tile">
            <v-list-tile-avatar>
              <v-icon :class="[ network.network ]" class="social-color--text">
                fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <!--FACEBOOK -->
              <v-layout row align-center justify-center style="width: 100%" v-if="network.network === 'facebook'">
                <v-flex sm12 class="wrap-ellipsis">
                  <a :href="'https://facebook.com/' + proposal.influencer.facebook_profile.profile_id" target="_blank">
                    {{ proposal.influencer.facebook_profile.name }}
                  </a>
                </v-flex>
                <v-flex sm4 class="text-sm-center">
                  <div class="title">{{ proposal.influencer.facebook_profile.likes | humanNumber }}</div>
                  <div class="caption text--uppercase grey--text">Likes</div>
                </v-flex>
              </v-layout>

              <!--INSTAGRAM -->
              <v-layout row align-center justify-center style="width: 100%" v-if="network.network === 'instagram'">
                <v-flex sm12 class="wrap-ellipsis">
                  <a :href="'https://instagram.com/' + proposal.influencer.instagram_profile.name" target="_blank">
                    {{ proposal.influencer.instagram_profile.name }}
                  </a>
                </v-flex>
                <v-flex sm4 class="text-sm-center">
                  <div class="title">{{ proposal.influencer.instagram_profile.followers | humanNumber }}</div>
                  <div class="caption text--uppercase grey--text">Followers</div>
                </v-flex>
              </v-layout>

              <!--TWITTER-->
              <v-layout row align-center justify-center style="width: 100%" v-if="network.network === 'twitter'">
                <v-flex sm12 class="wrap-ellipsis">
                  <a :href="'https://twitter.com/' + proposal.influencer.twitter_profile.name" target="_blank">
                    @{{ proposal.influencer.twitter_profile.name }}
                  </a>
                </v-flex>
                <v-flex sm4 class="text-sm-center">
                  <div class="title">{{ proposal.influencer.twitter_profile.followers | humanNumber }}</div>
                  <div class="caption text--uppercase grey--text">Followers</div>
                </v-flex>
              </v-layout>

              <!--YOUTUBE-->
              <v-layout row align-center justify-center style="width: 100%" v-if="network.network === 'youtube'">
                <v-flex sm12 class="wrap-ellipsis">
                  <a :href="'https://youtube.com/' + proposal.influencer.youtube_profile.name" target="_blank">
                    {{ proposal.influencer.youtube_profile.name }}
                  </a>
                </v-flex>
                <v-flex sm4 class="text-sm-center">
                  <div class="title">{{ proposal.influencer.youtube_profile.subscribers | humanNumber }}</div>
                  <div class="caption text--uppercase grey--text">Subscribers</div>
                </v-flex>
              </v-layout>

              <!--BLOG-->
              <v-layout row align-center justify-center style="width: 100%" v-if="network.network === 'blog'">
                <v-flex sm12 class="wrap-ellipsis">
                  <a :href="proposal.influencer.blog_profile.url" target="_blank">
                    {{ proposal.influencer.blog_profile.title }}
                  </a>
                </v-flex>
                <v-flex sm4 class="text-sm-center">
                  <div class="title">{{ proposal.influencer.blog_profile.visitors_monthly | humanNumber }}</div>
                  <div class="caption text--uppercase grey--text">Monthly Visitors</div>
                </v-flex>
              </v-layout>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index < proposal.networks.length - 1"></v-divider>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: [
      'proposal'
    ],
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
    },
    methods: {
    }
  }
</script>

<style>


</style>