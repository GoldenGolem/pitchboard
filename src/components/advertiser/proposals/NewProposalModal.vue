<template>
  <v-dialog v-model="proposalModalVisible" :max-width="modalWidth" scrollable transition="fade-transition">
    <v-btn flat dark large fab @click.native="proposalModalVisible = false" class="btn--close">
      <v-icon>close</v-icon>
    </v-btn>
    <v-card class="grey lighten-2 pb-modal pa-0" v-if="proposal">
      <transition name="fade" mode="out-in">
        <v-card-text class="pa-5" v-if="action === 'proposal'" key="proposal">
          <div class="text-sm-center display-1">
            <v-avatar size="100px" class="card-avatar elevation-1" v-if="action === 'proposal'">
              <img :src="proposal.influencer.user.avatar">
            </v-avatar>
          </div>

          <div class="text-sm-center display-1" style="margin-top: 30px">
            <strong>{{ proposal.influencer.name }}</strong>
          </div>

          <div class="text-sm-center subheading grey--text text--darken-2">
            4.7
            <v-icon class="icon--small">star</v-icon>
          </div>

          <div class="text-sm-center">
            <v-avatar v-for="network in proposal.networks"
                      :key="network.id"
                      :class="[ network.network ]"
                      class="mr-1 mt-1 mb-1 social-color--bg"
                      size="30px">
              <v-icon style="font-size: 16px;" color="white">fa-{{ network.network !== 'blog' ? network.network : 'rss'
                }}
              </v-icon>
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
                sent {{ proposal.created_at | moment("from") }}
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
                        <a :href="'https://facebook.com/' + proposal.influencer.facebook_profile.profile_id"
                           target="_blank">
                          {{ proposal.influencer.facebook_profile.name }}
                        </a>
                      </v-flex>
                      <v-flex sm4 class="text-sm-center">
                        <div class="title">{{ proposal.influencer.facebook_profile.likes | humanNumber }}</div>
                        <div class="caption text--uppercase grey--text">Likes</div>
                      </v-flex>
                    </v-layout>

                    <!--INSTAGRAM -->
                    <v-layout row align-center justify-center style="width: 100%"
                              v-if="network.network === 'instagram'">
                      <v-flex sm12 class="wrap-ellipsis">
                        <a :href="'https://instagram.com/' + proposal.influencer.instagram_profile.name"
                           target="_blank">
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

        </v-card-text>

        <v-card-text class="pa-5" v-if="action === 'accept'" key="accept">

          <v-card color="white" class="mb-3 pa-4 elevation-1">
            <v-layout row align-center justify-center>
              <v-flex sm2>
                <v-avatar size="60px">
                  <img :src="proposal.influencer.user.avatar">
                </v-avatar>
              </v-flex>
              <v-flex sm9>
                <h3 class="title mb-1">{{ proposal.influencer.name }}</h3>
                <div class="grey--text text--darken-1">
                  <!--<span class="i-flex">-->
                  <!--4.7 <v-icon class="icon&#45;&#45;x-small">star</v-icon>-->
                  <!--</span>-->
                  <v-chip small color="primary" text-color="white" class="ma-0">
                    <strong>{{ proposal.fee_gross | currency }}</strong>
                  </v-chip>
                  <!--&middot;-->
                  <strong>{{ totalReach | humanNumber }}</strong> Reach
                </div>
              </v-flex>
              <v-flex sm5 class="text-sm-right">
                <!--<br>-->
                <v-avatar v-for="network in proposal.networks"
                          :key="network.id"
                          :class="[ network.network ]"
                          class="mr-1 mt-1 mb-1 social-color--bg"
                          size="30px">
                  <v-icon style="font-size: 16px;" color="white">
                    fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
                  </v-icon>
                </v-avatar>
              </v-flex>
            </v-layout>
          </v-card>

          <p>By accepting this proposal, <strong>I accept that my payment will be held in escrow until 7 days after posts are published.</strong>
            During that period, conditions apply. <a href="#">Learn More</a></p>

          <v-layout row align-baseline>
            <v-flex sm12> Influencer fee </v-flex>
            <v-flex sm4 class="text-sm-right subheading"> {{ proposal.fee_gross | currency }} </v-flex>
          </v-layout>
          <v-layout row align-baseline>
            <v-flex sm12> Pitchboard fee </v-flex>
            <v-flex sm4 class="text-sm-right subheading"> {{ proposal.advertiser_pitchboard_fee * 100 }}% </v-flex>
          </v-layout>
          <v-layout row align-baseline style="border-top: 1px dashed #a7a7a7" class="mt-2 pt-2 mb-3">
            <v-flex sm12 class="primary--text"> Total Cost </v-flex>
            <v-flex sm4 class="text-sm-right subheading primary--text">
              <strong>{{ proposal.fee_gross * (1 + proposal.advertiser_pitchboard_fee) | currency }}</strong></v-flex>
          </v-layout>

          <p>Please pay securely via the following options:</p>
          <v-expansion-panel class="elevation-1">
            <v-expansion-panel-content hide-actions v-model="savedCardOpen" @click.native="paymentMethod = 'saved'"
                                       v-if="cards.length > 0">
              <v-layout row align-center slot="header">
                <v-icon class="base--size mr-3" :class="{ 'primary--text': paymentMethod === 'saved' }">
                  {{ paymentMethod == 'saved' ? 'radio_button_checked' : 'radio_button_unchecked' }}
                </v-icon>
                <!--<v-icon class="mr-1">credit_card</v-icon>--> <span class="subheading">Saved Credit Cards</span>
              </v-layout>
              <v-list>
                <template v-for="card in cards">
                  <v-list-tile @click="card_id = card.id" :class="{ 'primary': card_id === card.id }">
                    <v-list-tile-avatar>
                      <v-icon :color="card_id === card.id ? 'white' : 'grey'">
                        fa-cc-{{ card.brand.toLowerCase().split(" ").join("-") }}
                      </v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title
                          :class="{ 'grey--text text--darken-2': card_id !== card.id, 'white--text': card_id === card.id }">
                        **** **** **** {{ card.last4 }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action v-if="card_id === card.id">
                      <v-chip color="transparent" text-color="white">
                        <v-icon color="white" class="icon--small mr-2">check</v-icon>
                        Selected
                      </v-chip>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list>
            </v-expansion-panel-content>
            <v-expansion-panel-content hide-actions v-model="newCardOpen" @click.native="paymentMethod = 'new'">
              <v-layout row align-center slot="header">
                <v-icon class="base--size mr-3" :class="{ 'primary--text': paymentMethod === 'new' }">
                  {{ paymentMethod == 'new' ? 'radio_button_checked' : 'radio_button_unchecked' }}
                </v-icon>
                <span class="subheading">New Credit Card</span>
              </v-layout>
              <v-card class="pa-4">
                <v-switch
                    style="position: absolute; top: 0; width: 100px; right: 15px; top: -40px;"
                    label="Save" v-model="saveCard" color="primary" hide-details
                    v-if="paymentMethod === 'new'"></v-switch>
                <card class='stripe-card'
                      :class='{ complete }'
                      :options="stripeOptions"
                      stripe='pk_test_ATeHSvYyGWt9aGFDf3Ed5WeF'
                      @change='complete = $event.complete'
                />
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-checkbox
              :label="'I accept the Terms and understand the conditions'"
              class="mt-4"
              v-validate="'required:true'"
              data-vv-name="termsAccepted"
              color="primary"
              :error="errors.has('termsAccepted')"
              v-model="termsAccepted">
          </v-checkbox>

        </v-card-text>

        <v-card-text class="pa-5" v-if="action === 'dismiss'" key="dismiss">

          <v-card color="white" class="mb-3 pa-4 elevation-1">
            <v-layout row align-center justify-center>
              <v-flex sm2>
                <v-avatar size="60px">
                  <img :src="proposal.influencer.user.avatar">
                </v-avatar>
              </v-flex>
              <v-flex sm9>
                <h3 class="title mb-1">{{ proposal.influencer.name }}</h3>
                <div class="grey--text text--darken-1">
                  <!--<span class="i-flex">-->
                  <!--4.7 <v-icon class="icon&#45;&#45;x-small">star</v-icon>-->
                  <!--</span>-->
                  <v-chip small color="primary" text-color="white" class="ma-0">
                    <strong>{{ proposal.fee_gross | currency }}</strong>
                  </v-chip>
                  <!--&middot;-->
                  <strong>{{ totalReach | humanNumber }}</strong> Reach
                </div>
              </v-flex>
              <v-flex sm5 class="text-sm-right">
                <!--<br>-->
                <v-avatar v-for="network in proposal.networks"
                          :key="network.id"
                          :class="[ network.network ]"
                          class="mr-1 mt-1 mb-1 social-color--bg"
                          size="30px">
                  <v-icon style="font-size: 16px;" color="white">
                    fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
                  </v-icon>
                </v-avatar>
              </v-flex>
            </v-layout>
          </v-card>

          <v-layout row pa-2 mt-5 justify-center align-center>
            <v-flex mx-2 class="text-md-center">
              <v-icon x-large style="width: 40px;">fa-trash</v-icon>
            </v-flex>
            <v-flex mx-2>
              <div class="title mb-2">Are you sure you want to <strong>dismiss</strong> this proposal?</div>
              <div class="caption grey--text">This will remove this proposal from your list.</div>
            </v-flex>
          </v-layout>


        </v-card-text>

        <v-card-text class="pl-5 pr-5 pt-5 pb-0" v-if="action === 'chat'" key="chat">

          <v-card color="white" class="mb-0 pa-4">
            <v-layout row align-center justify-center>
              <v-flex sm2>
                <v-avatar size="60px">
                  <img :src="proposal.influencer.user.avatar">
                </v-avatar>
              </v-flex>
              <v-flex sm9>
                <h3 class="title mb-1">{{ proposal.influencer.name }}</h3>
                <div class="grey--text text--darken-1">
                  <!--<span class="i-flex">-->
                  <!--4.7 <v-icon class="icon&#45;&#45;x-small">star</v-icon>-->
                  <!--</span>-->
                  <v-chip small color="primary" text-color="white" class="ma-0">
                    <strong>{{ proposal.fee_gross | currency }}</strong>
                  </v-chip>
                  <!--&middot;-->
                  <strong>{{ totalReach | humanNumber }}</strong> Reach
                </div>
              </v-flex>
              <v-flex sm5 class="text-sm-right">
                <!--<br>-->
                <v-avatar v-for="network in proposal.networks"
                          :key="network.id"
                          :class="[ network.network ]"
                          class="mr-1 mt-1 mb-1 social-color--bg"
                          size="30px">
                  <v-icon style="font-size: 16px;" color="white">
                    fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
                  </v-icon>
                </v-avatar>
              </v-flex>
            </v-layout>
          </v-card>

          <div style="height: 400px; overflow: auto" class="pt-0 pl-4 pr-4 pb-2 mt-1 white">
            <div v-if="messages.length > 0">
              <div v-for="(message, index) in messages" :key="message.id">
                <chat-message :message="message"
                              :showName="!messages[index - 1] || messages[index - 1].sender_id !== message.sender_id"></chat-message>
              </div>
            </div>
            <v-layout fill-height justify-center align-center v-else>
              <v-flex class="subheading text-xs-center grey--text text--darken-2">
                Start your conversation by sending the first message.
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </transition>

      <v-card-actions class="pl-5 pr-5 pt-4 pb-4" v-if="action === 'proposal'">
        <v-btn color="primary" @click.native="action = 'accept'">
          <v-icon left>check</v-icon>
          Accept Proposal
        </v-btn>
        <v-btn flat color="grey" class="darken-2" @click.native="action = 'chat'">
          <v-icon left>message</v-icon>
          Send Message
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="red" small @click.native="action = 'dismiss'">
          <v-icon left>delete</v-icon>
          Dismiss
        </v-btn>
      </v-card-actions>
      <v-card-actions class="pl-5 pr-5 pt-4 pb-4" v-if="action === 'accept'">
        <v-btn color="primary" @click.native="pay" :loading="accepting">
          <v-icon left>check</v-icon>
          Accept Proposal & Pay Fee
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="grey" small @click.native="action = 'proposal'">
          <v-icon>close</v-icon>
          Cancel
        </v-btn>
      </v-card-actions>
      <v-card-actions class="pl-5 pr-5 pt-4 pb-4" v-if="action === 'dismiss'">
        <v-btn color="primary" @click.native="dismiss" :loading="dismissing">
          <v-icon left>delete</v-icon>
          Yes, dismiss
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="grey" small @click.native="action = 'proposal'">
          <v-icon>close</v-icon>
          Cancel
        </v-btn>
      </v-card-actions>
      <v-card-actions class="pl-5 pr-5 pt-1 pb-4" v-if="action === 'chat'">
        <div style="width: 100%" class="ma-0">
          <form @submit.stop.prevent="sendMessage" class="pa-0">
            <v-card-actions class="pa-0 elevation-1">
              <v-layout row class="white ma-0">
                <v-flex sm15>
                  <v-text-field
                      placeholder="Type your message..."
                      max="255"
                      hide-details
                      solo
                      class="pa-2 pb-3 pt-3 elevation-0"
                      v-model="message"
                  ></v-text-field>
                </v-flex>
                <v-flex sm1 justify-center align-center d-flex class="mr-3 ml-3">
                  <div>
                    <v-btn fab small class="purple white--text" @click="sendMessage">
                      <v-icon>send</v-icon>
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>

            </v-card-actions>
          </form>
        </div>
        <div>
          <v-btn flat color="grey" @click.native="action = 'proposal'">
            <v-icon>arrow_left</v-icon>
            Back
          </v-btn>
        </div>
      </v-card-actions>

    </v-card>

  </v-dialog>

</template>

<script>
  import {Card, CardNumber, CardExpiry, CardCvc, PostalCode, createToken} from 'vue-stripe-elements-plus'
  import ChatMessage from '../../helpers/ChatMessage'

  export default {
    components: {
      CardNumber, CardExpiry, CardCvc, PostalCode, Card, ChatMessage
    },
    props: [
      'proposal', 'proposalModal', 'goTo'
    ],
    data() {
      return {
        'action': 'proposal',
        'sidebar': false,
        'paymentMethod': 'new',
        'card_id': null,
        'saveCard': false,
        'complete': false,
        'stripeToken': null,
        'termsAccepted': false,
        'accepting': false,
        'dismissing': false,
        messages: [],
        message: null,
        'stripeOptions': {
          style: {
            base: {
              color: '#32325d',
              lineHeight: '18px',
              fontFamily: '"Nunito Sans", sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          },
        }
      }
    },
    watch: {
      'action': function (value) {
        if (value === 'accept') this.sidebar = true
        if (value === 'proposal') this.sidebar = false
      },
      'cards': function (value) {
        if (this.$store.state.advertiser.defaultCard) this.card_id = this.$store.state.advertiser.defaultCard

        if (this.cards.length > 0) this.paymentMethod = 'saved'
      },
      'proposal': function (oldProposal, newProposal) {
        if (this.proposal) {
          this.fetchMessages()
          this.authorizeChannel(oldProposal && oldProposal.id ? oldProposal.id : false, newProposal.id)
        }
      },
      'goTo': function () {
        this.action = this.goTo
      }
    },
    mounted() {
      if (this.$store.state.advertiser.defaultCard) this.card_id = this.$store.state.advertiser.defaultCard

      if (this.cards.length > 0) this.paymentMethod = 'saved'

      if (this.proposal) {
        this.fetchMessages()
        this.authorizeChannel(false, this.proposal.id)
      }

      if (this.goTo) this.action = this.goTo
    },
    computed: {
      proposalModalVisible: {
        get() {
          return this.proposalModal
        },
        set(value) {
          this.$emit('modalToggled', value)
        }
      },
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
      modalWidth() {
//        return "700px"

//        if (this.sidebar) return "1070px"

        return "700px"
      },
      topCountries() {
        return this.proposal.influencer.top_countries.map(c => {
          return c.country
        }).join(', ')
      },
      opportunityModalVisible: {
        get() {
          return this.opportunityModal
        },
        set(value) {
          this.$emit('modalToggled', value)
        }
      },
      newCardOpen: {
        get() {
          return this.paymentMethod === 'new'
        },
        set(value) {
        }
      },
      savedCardOpen: {
        get() {
          return this.paymentMethod === 'saved'
        },
        set(value) {
        }
      },
      cards() {
        return this.$store.state.advertiser.cards
      }
    },
    methods: {
      pay () {
        // createToken returns a Promise which resolves in a result object with
        // either a token or an error key.
        // See https://stripe.com/docs/api#tokens for the token object.
        // See https://stripe.com/docs/api#errors for the error object.
        // More general https://stripe.com/docs/stripe.js#stripe-create-token.

        this.$validator.validateAll().then(result => {
          if (result) {

            this.accepting = true

            if (this.paymentMethod === 'new') {
              createToken().then(data => {
                if (data.error) {
                  this.$store.dispatch('alert', {
                    'text': data.error.message,
                    'color': 'red'
                  })
                  return
                }

                this.stripeToken = data.token

                this.processPayment()

              }).catch(error => {
                console.error(error)
              })
            } else if (this.paymentMethod === 'saved' && this.card_id) {
              this.processPayment();
            }

          }
        })

      },
      processPayment() {
        let data = {
          'proposal_id': this.proposal.id
        }

        if (this.paymentMethod === 'saved') {
          data.card_id = this.card_id
        } else {
          data.token_id = this.stripeToken.id
          data.save_card = this.saveCard
        }

        this.$http.post(`campaign/${this.proposal.campaign_id}/accept-proposal`, data).then(result => {
          this.$store.dispatch('alert', {
            'text': "Proposal has been accepted and the funds have been put in escrow!",
            'color': 'green',
            'multiline': true
          })

          this.$emit('proposalAccepted', this.proposal)

          this.action = 'proposal'

          if (data.save_card) this.$http.get('me/credit-cards').then(result => {
            this.$store.dispatch('saveCards', {'cards': result.data.cards, 'default': result.data.default})
          })

          this.accepting = false

        }).catch(error => {
          this.$store.dispatch('alert', {
            'text': error.response.data.error.message,
            'color': 'red',
            'multiline': true
          })
          this.accepting = false
        })
      },
      dismiss() {
        this.dismissing = true

        this.$http.post(`campaign/${this.proposal.campaign_id}/dismiss-proposal`, {
          'proposal_id': this.proposal.id
        }).then(result => {
          this.$store.dispatch('alert', {
            'text': "Proposal has been dismissed",
            'color': 'orange'
          })

          this.$emit('proposalDismissed', this.proposal)

          this.action = 'proposal'

          this.dismissing = false
        }).catch(error => {
          this.$store.dispatch('alert', {
            'text': "There was an error. Please try again.",
            'color': 'red'
          })

          this.dismissing = false
        })
      },
      fetchMessages() {
        this.$http.get(`/messages/${this.proposal.id}`).then(result => {
          console.log(result.data)

          if (result.data.data) {
            this.messages = result.data.data;
          } else {
            this.messages = result.data;
          }
        })
      },
      authorizeChannel(oldId, newId) {
        if (oldId) this.$echo.leave(`proposal.${oldId}`)
        console.log('authorize channel')
        console.log('authorize channel ', `proposal.${this.proposal.id}`)
        this.$echo.private(`proposal.${this.proposal.id}`).listen('MessageSent', (payload) => {
          if (
            payload.message.sender_id !== this.$store.state.user.data.id &&
            this.proposal.id === payload.message.conversation.proposal_id
          ) this.messages.push(payload.message)
        })
      },
      sendMessage() {
        const data = {
          'proposal_id': this.proposal.id,
          'to': this.proposal.influencer.user_id,
          'message': this.message
        }

        this.$http.post('/message', data).then(result => {
          this.message = null
          this.messages.push(result.data)
        }).catch(error => {
          this.$store.dispatch('alert', {
            'text': 'Something went wrong while sending your message.',
            'color': 'red'
          })
        })
      }
    }
  }

</script>

<style scoped>

  .sidebar {
    height: 100%;
    position: absolute;
    background: white;
    z-index: 1;
    width: 370px;
    transition: all 0.3s ease-in-out;
  }

  .card-avatar {
    /*position: absolute;*/
    /*z-index: 101;*/
    /*transform: translate(-50%, -50%);*/
    /*left: 50%;*/
    /* top: 0; */
  }

  .sidebar.hidden {
    /*transform: translateX(-100%);*/
  }
</style>