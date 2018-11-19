<template>
  <v-flex sm4>
    <v-card class="elevation-1 white">
      <v-layout row>
        <v-flex sm3 d-flex align-center justify-center class="b-r">
          <img :src="proposal.influencer.user.avatar" style="flex-grow: 0">
        </v-flex>
        <v-flex sm7 class="b-r">
          <v-layout column>
            <v-flex style="border-bottom: 1px solid #eeeeee">
              <v-card-text>
                <v-layout class="mb-1">
                  <v-flex sm10>
                    <h4 class="title mb-0"><strong>{{ proposal.influencer.name }}</strong> <a href="javascript:;" class="body-1 ml-3">Full Profile ></a> </h4>
                  </v-flex>
                  <v-flex sm6 class="text-sm-right grey--text">
                    <span>{{ proposal.created_at | moment("from") }}</span>
                    <v-chip small class="purple white--text ma-0 ml-2"><strong>{{ proposal.fee_gross | currency }}</strong></v-chip>
                  </v-flex>
                </v-layout>
                <p class="mb-0 grey--text text--darken-1 wrap-ellipsis">
                  {{ proposal.influencer.bio }}
                </p>
              </v-card-text>
            </v-flex>
            <v-flex>
              <v-card-text>
                <p class="body-2 mb-2">
                  Total Reach: <strong>{{ totalReach | humanNumber }}</strong>
                  &middot;
                  Includes Sharing On:
                </p>
                <v-layout row wrap>
                  <v-flex sm3 d-flex align-start v-for="network, index in proposal.networks" :class="{ 'ml-4': index > 0 }" :key="index">
                    <v-icon class="mr-1" v-if="network.network != 'blog'">fa-{{ network.network }}</v-icon>
                    <v-icon class="mr-1" v-else>fa-rss</v-icon>
                    <div>
                      <div v-if="network.network === 'facebook'">Likes</div>
                      <div v-if="network.network === 'instagram'">Followers</div>
                      <div v-if="network.network === 'twitter'">Followers</div>
                      <div v-if="network.network === 'youtube'">Subscribers</div>
                      <div v-if="network.network === 'blog'">Visitors</div>
                      <div class="title">
                        <strong v-if="network.network === 'facebook'">{{ proposal.influencer.facebook_profile.likes | humanNumber(0) }}</strong>
                        <strong v-if="network.network === 'instagram'">{{ proposal.influencer.instagram_profile.followers | humanNumber(0) }}</strong>
                        <strong v-if="network.network === 'twitter'">{{ proposal.influencer.twitter_profile.followers | humanNumber(0) }}</strong>
                        <strong v-if="network.network === 'youtube'">{{ proposal.influencer.youtube_profile.subscribers | humanNumber(0) }}</strong>
                        <strong v-if="network.network === 'blog'">{{ proposal.influencer.blog_profile.visitors | humanNumber(0) }}</strong>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm3 d-flex align-center justify-center class="text-sm-center">
          <div>
            <div>
              <strong>AV. AGE</strong>
              <div class="headline headline--demographic">{{ proposal.influencer.top_age }}</div>
            </div>
            <div>
              <strong>GENDER</strong>
              <div class="headline headline--demographic">{{ proposal.influencer.top_gender | capitalize }}</div>
            </div>
            <div>
              <strong>LOCATION</strong>
              <div class="headline headline--demographic">{{ topCountries }}</div>
            </div>
          </div>
        </v-flex>
        <v-flex sm3 class="b-l">
          <v-layout fill-height column align-center justify-center>
            <v-flex d-flex align-center justify-center style="width: 100%; max-height: 33.33%; min-height: 33.33%;" class="btn--layout b-b" @click.stop="$emit('accept', proposal)">
              <v-flex sm3>
                <v-icon class="primary--text">done</v-icon>
              </v-flex>
              <v-flex sm6 class="subheading">
                ACCEPT
              </v-flex>
            </v-flex>
            <v-flex d-flex align-center justify-center style="width: 100%; max-height: 33.33%; min-height: 33.33%;" class="btn--layout b-b" @click.stop="$emit('dismiss', proposal)">
              <v-flex sm3>
                <v-icon class="primary--text">delete</v-icon>
              </v-flex>
              <v-flex sm6 class="subheading">
                DISMISS
              </v-flex>
            </v-flex>
            <v-flex d-flex align-center justify-center style="width: 100%; max-height: 33.33%; min-height: 33.33%;" class="btn--layout b-b" @click.stop="$emit('message', proposal)">
              <v-flex sm3>
                <v-icon class="primary--text">mail_outline</v-icon>
              </v-flex>
              <v-flex sm6 class="subheading">
                MESSAGE
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    props: ['proposal'],
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
          if (network.network === 'blog') total += this.proposal.influencer.blog_profile.visitors
        }
        return total
      },
      topCountries() {
        return this.proposal.influencer.top_countries.map(c => {return c.country}).join(', ')
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .headline--demographic {
    font-size: 18px !important;
  }
</style>
