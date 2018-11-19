<template>
  <div>
    <v-layout row justify-center>
      <v-flex md8>

        <div class="text-xs-center mb-4">
          <h4 class="display-1 text-center mb-0">Account Successfully Created</h4>
        </div><!-- /.sign-up-header -->

        <v-card raised style="z-index: 2" class="mb-3 pa-4 connect-networks">
          <v-card-title>
            <div class="headline">Hey {{ influencer.name.split(' ')[0] }}, let's connect your networks</div>
            <div class="subheading">To help us find relevant opportunities for you, please connect your social accounts. Nothing will be posted to them and access can be revoked anytime.</div>
          </v-card-title>
          <v-card-text>

            <div class="network" v-for="network in networks" :key="network.type">
              <v-layout row justify-center align-center >
                <v-flex sm2 class="text-sm-center">
                  <v-icon class="network-icon primary--text">fa-{{network.icon}}</v-icon>
                </v-flex>
                <v-flex sm10>
                  <div class="network-title">
                    {{network.name}}
                  </div>
                </v-flex>
                <v-flex sm4>
                  <v-btn class="primary" tag="a" @click="authenticate(network.type, { scope: network.scope })" v-if="!network.connected" :loading="network.connecting">
                    Connect
                  </v-btn>
                  <div class="subheading" v-else>
                    Connected <v-icon>check</v-icon>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout row justify-center align-center class="pl-3 pr-3 mt-2" v-if="network.connection" @mouseover="network.showRemove = true" @mouseout="network.showRemove = false">
                <v-flex sm3>
                  <v-avatar size="60px" class="grey lighten-3" v-if="network.type != 'blog'">
                    <img :src="network.connection.profile_photo">
                  </v-avatar>
                </v-flex>
                <v-flex sm13>
                  <v-layout column class="grey--text text--darken-2">
                    <v-flex style="position: relative">
                      <div class="subheading wrap-ellipsis" v-if="network.type !== 'blog'">
                        <span v-if="network.type === 'twitter'">@</span>{{ network.connection.name }}
                      </div>
                      <div class="subheading wrap-ellipsis" v-if="network.type === 'blog'">
                        {{ network.connection.title }}
                      </div>
                      <v-btn flat icon color="red" style="position: absolute; right: 0; top: -6px" v-if="network.showRemove" @click="removeNetwork(network.connection.id, network.type)">
                        <v-icon>clear</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex class="wrap-ellipsis" v-if="network.type === 'facebook'">
                      {{ network.connection.likes }} likes &middot; {{ network.connection.about }}
                    </v-flex>
                    <v-flex class="wrap-ellipsis" v-if="network.type === 'instagram'">
                      {{ network.connection.followers }} followers
                      <span v-if="network.connection.full_name">&middot; {{ network.connection.full_name }}</span>
                      <span v-if="network.connection.bio">&middot; {{ network.connection.bio }}</span>
                    </v-flex>
                    <v-flex class="wrap-ellipsis" v-if="network.type === 'twitter'">
                      {{ network.connection.followers }} followers
                      <span v-if="network.connection.full_name">&middot; {{ network.connection.full_name }}</span>
                      <span v-if="network.connection.description">&middot; {{ network.connection.description }}</span>
                    </v-flex>
                    <v-flex class="wrap-ellipsis" v-if="network.type === 'youtube'">
                      {{ numeral(network.connection.subscribers).format('0a') }} subscribers
                      &middot;
                      <span v-if="network.connection.description">&middot; {{ network.connection.description }}</span>
                    </v-flex>
                    <v-flex class="wrap-ellipsis" v-if="network.type === 'blog'">
                      {{ numeral(network.connection.visitors_30days).format('0.0a') }} visitors last month
                      &middot;
                      <span v-if="network.connection.full_name">&middot; {{ network.connection.full_name }}</span>
                      <span v-if="network.connection.bio">&middot; {{ network.connection.bio }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>

            <div class="text-xs-center">
              <v-btn large class="mt-5 purple darken-1 white--text" :disabled="connectedNetworksCount === 0" @click="submit">Complete Profile</v-btn>
            </div>

          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>

    <v-dialog v-model="selectSocialProfile" width="500px" content-class="white" persistent>
      <v-card color="white">
        <div class="headline text-xs-center mt-4 mb-1" v-if="socialProfiles.type == 'blog'">Select the relevant GA profile</div>
        <div class="grey--text text--darken-2 text-xs-center mb-2" v-if="socialProfiles.type == 'blog'">Find your blog URL and associated Analytics profile</div>
        <div class="headline text-xs-center mt-4 mb-1" v-if="socialProfiles.type == 'youtube'">Select the relevant Youtube channel</div>
        <div class="headline text-xs-center mb-2 mt-4" v-if="socialProfiles.type == 'facebook'">Select the relevant social profile</div>
        <v-list two-line raised class="">
          <template v-for="profile,index in socialProfiles.profiles">
            <v-list-tile avatar v-bind:key="profile.id" @click="connectFacebook(profile)" v-if="socialProfiles.type == 'facebook'">
              <v-list-tile-avatar>
                <img :src="profile.picture.url">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ profile.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ profile.category }} &middot; {{ profile.engagement.count_string }} likes &middot; {{ profile.about }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-bind:key="profile.id" @click="connectBlog(profile)" v-if="socialProfiles.type == 'blog'">
              <v-list-tile-content>
                <v-list-tile-title><a :href="profile.full_url" target="_blank">{{ profile.blog.title }}</a> &middot; {{ profile.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ profile.web_property_id }} &middot; <strong>{{ numeral(profile.visitors_30days).format('0.0a') }} visitors</strong> last 30 days</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-bind:key="profile.id" @click="connectYoutube(profile)" v-if="socialProfiles.type == 'youtube'">
              <v-list-tile-avatar>
                <img :src="profile.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ profile.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ numeral(profile.subscribers).format('0a') }} subscribers &middot; {{ profile.description }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider v-if="index !== (socialProfiles.profiles.length - 1)"></v-divider>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" flat @click.native="closeSelectSocialProfile">Cancel</v-btn>
          </v-card-actions>
        </v-list>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import axios from 'axios'
  import * as config from './../../../../config/site.js'

  let http = axios.create({
    baseURL: config.apiUrl
  })

  export default {
    data() {
      return {
        selectSocialProfile: false,
        socialProfiles: {
          type: null,
          profiles: []
        },
        networks: [
          {
            type: 'facebook',
            icon: 'facebook',
            name: 'Facebook',
            scope: ['pages_show_list', 'read_insights'],
            connected: false,
            connection: null,
            showRemove: false,
            connecting: false
          },
          {
            type: 'instagram',
            icon: 'instagram',
            name: 'Instagram',
            scope: ['basic'],
            connected: false,
            connection: null,
            showRemove: false,
            connecting: false
          },
          {
            type: 'twitter',
            icon: 'twitter',
            name: 'Twitter',
            connected: false,
            connection: null,
            showRemove: false,
            connecting: false
          },
          {
            type: 'youtube',
            icon: 'youtube',
            name: 'Youtube',
            connected: false,
            connection: null,
            showRemove: false,
            connecting: false
          },
          {
            type: 'blog',
            icon: 'rss',
            name: 'Blog (Google Analytics)',
            scope: ['basic'],
            connected: false,
            connection: null,
            showRemove: false,
            connecting: false
          },
        ],
        'numeral': numeral
      }
    },
    computed: {
      influencer() {
        return this.$store.state.user.data.influencer
      },
      connectedNetworksCount() {
        return this.networks.filter(n => {return n.connected}).length
      }
    },
    beforeRouteEnter (to, from, next) {
      http.get('/influencer/me').then(result => {
        next(vm => {
          let influencer = result.data
          let network = null
          if (influencer.blog_profile) {
            network = vm.networks.find(n => {return n.type === 'blog'})
            if (network) {
              network.connected = true
              network.connection = influencer.blog_profile
            }
          }
          if (influencer.youtube_profile) {
            network = vm.networks.find(n => {return n.type === 'youtube'})
            if (network) {
              network.connected = true
              network.connection = influencer.youtube_profile
            }
          }
          if (influencer.facebook_profile) {
            network = vm.networks.find(n => {return n.type === 'facebook'})
            if (network) {
              network.connected = true
              network.connection = influencer.facebook_profile
            }
          }
          if (influencer.twitter_profile) {
            network = vm.networks.find(n => {return n.type === 'twitter'})
            if (network) {
              network.connected = true
              network.connection = influencer.twitter_profile
            }
          }
          if (influencer.instagram_profile) {
            network = vm.networks.find(n => {return n.type === 'instagram'})
            if (network) {
              network.connected = true
              network.connection = influencer.instagram_profile
            }
          }
        })
      })
    },
    mounted() {
//      console.log(this.$auth.authenticate)
    },
    methods: {
      authenticate(provider, options) {

        if (provider === 'facebook') {
          this.$auth.options.providers.facebook.scope = options.scope
          this.$auth.options.providers.facebook.url = '/connect/callback/facebook'

          const network = this.networks.find(n => {return n.type === 'facebook'})
          network.connecting = true

          this.$auth.authenticate(
            provider
          ).then(response => {
            this.socialProfiles.type = "facebook"
            this.socialProfiles.profiles = response.data.socialProfiles
            this.selectSocialProfile = true
            network.connecting = false
          }).catch(response => {
            network.connecting = false
          })
        } else if (provider === 'instagram') {
          this.$auth.options.providers.instagram.url = '/connect/callback/instagram'

          const network = this.networks.find(n => {return n.type === 'instagram'})
          network.connecting = true

          this.$auth.authenticate(
            provider
          ).then(response => {
            this.instagramConnected(response.data.profile)
            network.connecting = false
          }).catch(response => {
            network.connecting = false
          })
        } else if (provider === 'twitter') {
          this.$auth.options.providers.twitter.url = '/connect/callback/twitter'

          const network = this.networks.find(n => {return n.type === 'twitter'})
          network.connecting = true

          this.$auth.authenticate(
            "twitter"
          ).then(response => {
            this.twitterConnected(response.data.profile)
            network.connecting = false
          }).catch(response => {
            network.connecting = false
          })
        } else if (provider === 'youtube') {
          this.$auth.options.providers.google.scope = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/yt-analytics.readonly',
            'profile',
            'email'
          ]
          this.$auth.options.providers.google.url = '/connect/callback/youtube'
          this.$auth.options.providers.google.optionalUrlParams = ['display', 'access_type']
          this.$auth.options.providers.google.accessType = 'offline'
//          if (process.env.NODE_ENV === 'development') {
            this.$auth.options.providers.google.optionalUrlParams.push('prompt')
            this.$auth.options.providers.google.prompt = 'consent'
//          }

          const network = this.networks.find(n => {return n.type === 'youtube'})
          network.connecting = true

          this.$auth.authenticate(
            'google'
          ).then(response => {
            if (response.data.profiles.length === 0) {
              this.$store.dispatch('alert', {text: "There are no Youtube channels associated with the selected Google Account", color: "red"})
              network.connecting = false
              return
            }

            this.socialProfiles.type = "youtube"
            this.socialProfiles.profiles = response.data.profiles
            this.selectSocialProfile = true
          }).catch(response => {
            network.connecting = false
            this.$store.dispatch('alert', {text: "There are no Youtube channels associated with the selected Google Account", color: "red"})
          })
        } else if (provider === 'blog') {
          this.$auth.options.providers.google.scope = ['https://www.googleapis.com/auth/analytics.readonly', 'profile', 'email']
          this.$auth.options.providers.google.url = '/connect/callback/blog'
          this.$auth.options.providers.google.optionalUrlParams = ['display', 'access_type']
          this.$auth.options.providers.google.accessType = 'offline'
//          if (process.env.NODE_ENV === 'development') {
            this.$auth.options.providers.google.optionalUrlParams.push('prompt')
            this.$auth.options.providers.google.prompt = 'consent'
//          }

          const network = this.networks.find(n => {return n.type === 'blog'})
          network.connecting = true

          this.$auth.authenticate(
            'google'
          ).then(response => {
            if (response.data.profiles.length === 0) {
              this.$store.dispatch('alert', {text: "There are no Google Analytics profiles", color: "red"})
              network.connecting = false
              return
            }

            this.socialProfiles.type = "blog"
            this.socialProfiles.profiles = response.data.profiles
            this.selectSocialProfile = true
          }).catch(response => {
            network.connecting = false
            this.$store.dispatch('alert', {text: "There are no Google Analytics profiles", color: "red"})
          })
        }
      },
      connectFacebook(profile) {
        this.$http.post('/connect/facebook', { profile: profile }).then(response => {
          const network = this.networks.find(n => {return n.type === 'facebook'})

          network.connected = true
          network.connection = response.data.profile
          this.clearSocialProfiles()
        }).catch(error => {
          console.error(error)
          this.clearSocialProfiles()
        })
      },
      instagramConnected(profile) {
        const network = this.networks.find(n => {return n.type === 'instagram'})
        network.connected = true
        network.connection = profile
      },
      twitterConnected(profile) {
        const network = this.networks.find(n => {return n.type === 'twitter'})
        network.connected = true
        network.connection = profile
      },
      connectYoutube(profile) {
        this.$http.post('/connect/youtube', { profile: profile }).then(response => {
          const network = this.networks.find(n => {return n.type === 'youtube'})

          network.connected = true
          network.connection = response.data.profile
          network.connecting = false
          this.clearSocialProfiles()
        }).catch(error => {
          console.error(error)
          network.connecting = false
          this.clearSocialProfiles()
        })
      },
      connectBlog(profile) {
        this.$http.post('/connect/blog', { profile: profile }).then(response => {
          const network = this.networks.find(n => {return n.type === 'blog'})

          network.connected = true
          network.connection = response.data.profile
          network.connecting = false
          this.clearSocialProfiles()
        }).catch(error => {
          console.error(error)
          network.connecting = false
          this.clearSocialProfiles()
        })
      },
      clearSocialProfiles() {
        this.selectSocialProfile = false
        setTimeout(() => {
          this.socialProfiles = {
            type: null,
            profiles: []
          }
        }, 1000)
      },
      closeSelectSocialProfile() {
        const network = this.networks.find(n => {return n.type === this.socialProfiles.type})
        network.connecting = false
        this.clearSocialProfiles()
      },
      removeNetwork(id, type) {
        this.$http.post('/connect/remove', {
          'id': id,
          'network': type
        }).then((result) => {
          const network = this.networks.find(n => {return n.type === type})

          network.connection = null
          network.connected = false
        }).catch(error => {})
      },
      submit() {
        this.$router.push('complete-profile')
      },
      resetAuthHeaders() {
        this.$auth.$http.defaults.headers.common['Authorization'] = defaults.headers.common['Authorization']
      }
    }
  }
</script>

<style>
  .connect-networks .card__title .headline {
    font-size: 26px !important;
    font-weight: 600;
  }

  .connect-networks .card__title .subheading {
    font-size: 18px !important;
    font-weight: 300;
  }

  .network {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eeeeee;
  }
  .network:last-child {
    border-bottom: none;
  }
  .network .network-title {
    font-size: 18px !important;
  }
  .network .network-icon {
    font-size: 38px !important;
  }
</style>