<template>
  <div class="grey--text text--darken-3" v-if="this.profile">
    <v-layout align-center class="mb-3">
      <v-flex sm4>
        <v-avatar size="50px">
          <img :src="user.avatar">
        </v-avatar>
      </v-flex>
      <v-flex sm12>
        <div class="title"><strong>My Profile</strong></div>
      </v-flex>
    </v-layout>
    <div class="subheading mb-2">
      Connected Channels &middot; <router-link to="{ name: 'influencerAccount' }">Manage</router-link>
    </div>
    <v-layout v-if="profile.facebook_profile" class="mb-2">
      <v-flex sm3 class="social_icons">
        <v-avatar size="40px" class="grey lighten-2">
          <v-icon class="network-icon primary--text">fa-facebook</v-icon>
        </v-avatar>
      </v-flex>
      <v-flex sm13>
        <div class="wrap-ellipsis"><strong>{{ profile.facebook_profile.name }}</strong></div>
        <div>{{ numeral(profile.facebook_profile.likes).format('0a') }} likes</div>
      </v-flex>
    </v-layout>
    <v-layout v-if="profile.instagram_profile" class="mb-2">
      <v-flex sm3 class="social_icons">
        <v-avatar size="40px" class="grey lighten-2">
          <v-icon class="network-icon primary--text">fa-instagram</v-icon>
        </v-avatar>
      </v-flex>
      <v-flex sm13>
        <div class="wrap-ellipsis"><strong>{{ profile.instagram_profile.name }}</strong></div>
        <div>{{ numeral(profile.facebook_profile.followers).format('0a') }} followers</div>
      </v-flex>
    </v-layout>
    <v-layout v-if="profile.twitter_profile" class="mb-2">
      <v-flex sm3 class="social_icons">
        <v-avatar size="40px" class="grey lighten-2">
          <v-icon class="network-icon primary--text">fa-twitter</v-icon>
        </v-avatar>
      </v-flex>
      <v-flex sm13>
        <div class="wrap-ellipsis"><strong>@{{ profile.twitter_profile.name }}</strong></div>
        <div>{{ numeral(profile.twitter_profile.followers).format('0a') }} followers</div>
      </v-flex>
    </v-layout>
    <v-layout v-if="profile.youtube_profile" class="mb-2">
      <v-flex sm3 class="social_icons">
        <v-avatar size="40px" class="grey lighten-2">
          <v-icon class="network-icon primary--text">fa-youtube</v-icon>
        </v-avatar>
      </v-flex>
      <v-flex sm13>
        <div class="wrap-ellipsis"><strong>@{{ profile.youtube_profile.name }}</strong></div>
        <div>{{ numeral(profile.youtube_profile.subscribers).format('0a') }} subscribers</div>
      </v-flex>
    </v-layout>
    <v-layout v-if="profile.blog_profile" class="mb-2">
      <v-flex sm3 class="social_icons">
        <v-avatar size="40px" class="grey lighten-2">
          <v-icon class="network-icon primary--text">fa-rss</v-icon>
        </v-avatar>
      </v-flex>
      <v-flex sm13>
        <div class="wrap-ellipsis"><strong>{{ profile.blog_profile.title }}</strong></div>
        <div>{{ numeral(profile.blog_profile.visitors_monthly).format('0a') }} visitors</div>
      </v-flex>
    </v-layout>

    <div class="subheading mb-2 mt-3">
      Audience Interests
    </div>

    <v-layout align-center v-for="category in profile.categories" :key="category.id" class="mb-2">
      <v-flex sm3 class="social_icons">
        <v-avatar  size="40px" class="grey lighten-2">
          <img :src="'/static/categories/' + category.icon + '.png'">
        </v-avatar>
      </v-flex>
      <v-flex sm13>
        <div class="wrap-ellipsis"><strong>{{ category.name }}</strong></div>
      </v-flex>
    </v-layout>

    <div class="subheading mb-2 mt-3">
      Audience Demographics
    </div>

    <p>
      <v-chip v-if="profile.demographics.age">
        Mostly aged {{ profile.demographics.age }}
      </v-chip>
      <v-chip v-if="profile.demographics.gender && profile.demographics.gender !== 'both'">
        Mostly {{ profile.demographics.age }}
      </v-chip>
      <v-chip v-if="profile.demographics.gender && profile.demographics.gender === 'both'">
        Both male & female
      </v-chip>
      <v-chip v-if="profile.demographics.countries">
        Mostly from
        <span v-for="(country, index) in profile.demographics.countries">
          &nbsp;{{ country.country }} ({{ country.percentage}}%)
          <span v-if="index < (profile.demographics.countries.length - 2)">,</span>
          <span v-if="index == (profile.demographics.countries.length - 2)"> and</span>
        </span>
      </v-chip>
    </p>

  </div>
</template>

<script>

  export default {
    data () {
      return {
        profile: null,
        numeral: numeral
      }
    },
    mounted() {
      this.$http.get('influencer/me').then(result => {
        this.profile = result.data
      })
    },
    computed: {
      serviceFee() {
        return this.proposal.grossFee * 0.05;
      },
      user() {
        return this.$store.state.user.data
      }
    },
  }
</script>
<style>
  .social_icons{
    margin-right: 20px;
  }
  @media(max-width: 992px){
  
  }
</style>