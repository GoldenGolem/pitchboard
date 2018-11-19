<template>
  <div style="margin-top: 100px">
    <v-layout class="mb-4" align-center>
      <v-flex sm8>
        <h5 class="subheading pl-3 mb-0">
          {{ proposals.length }} Open Proposals
          <span class="body-1 grey--text ml-3">List of proposals for you to review</span>
        </h5>
      </v-flex>
      <v-flex sm8 class="text-sm-right">
        <a href="javascript:;" class="grey--text"><v-icon class="base--size">radio_button_unchecked</v-icon> Include Dismissed</a>
        <a href="javascript:;" class="grey--text ml-4"><v-icon class="base--size">file_download</v-icon> Export to CSV</a>
        <a href="javascript:;" class="grey--text ml-4"><v-icon class="base--size">send</v-icon> Message All</a>
      </v-flex>
    </v-layout>

    <v-card class="grey lighten-4 elevation-1" style="margin-bottom: 300px" v-if="!proposals || proposals.length === 0">
      <v-card-text>
        <v-layout align-center justify-center>
          <div class="subheading mt-3 mb-3" style="font-weight: 300">Currently there are no proposals.</div>
        </v-layout>
      </v-card-text>
    </v-card>

    <div v-else>
      <v-container grid-list-md class="pa-0">
        <v-layout row wrap>
          <proposal-card v-for="proposal, index in proposals"
                         :proposal="proposal"
                         :key="index"
                         @accept="acceptModal = true; currentProposal = proposal"
                         @dismiss="dismissModal = true; currentProposal = proposal"
                         @message="showMessageModal"
                         @showProposal="currentProposal = proposal; proposalModal = true"
                         class="mb-4">
          </proposal-card>
        </v-layout>
      </v-container>
    </div>

    <proposal-modal
      :proposal="currentProposal"
      :proposalModal="proposalModal"
      @modalToggled="toggleProposalModal"
      @proposalAccepted="proposalAccepted"
      @proposalDismissed="proposalDismissed"
      v-if="currentProposal"
    >
    </proposal-modal>

  </div>
</template>

<script>
  import ProposalCard from '../proposals/ProposalCard'
  import MessageModal from './MessageModal'
  import ProposalModal from '../proposals/NewProposalModal'
  import { Card, CardNumber, CardExpiry, CardCvc, PostalCode, createToken } from 'vue-stripe-elements-plus'

  export default {
    components: {
      ProposalModal, ProposalCard, MessageModal, CardNumber, CardExpiry, CardCvc, PostalCode, Card
    },
    props: ['campaign'],
    data () {
      return {
        'proposalModal': false,
        'acceptModal': false,
        'dismissModal': false,
        'dismissConfirmedModal': false,
        'messageModal': false,
        'currentProposal': null,
        'messageNavigation': false,
        'proposal': null,
        'proposals': [],
        'proposalsResult': {

        },
        'cards': [],
        'saveCard': false,
        'complete': false,
        'stripeToken': null,
        'termsAccepted': false,
        'accepting': false,
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
    mounted() {
      this.$http.get(`campaign/${this.campaign.id}/proposals`, { params: { 'status': 'pending' }}).then(result => {
        this.proposals = result.data.data
      })
    },
    computed: {
      campaignProp() {
        return this.campaign
      }
    },
    methods: {
      test: function () {
      },
      showMessageModal: function (proposal) {
        this.proposal = proposal
        this.messageModal = true
      },
      dismissProposal: function () {
          this.dismissModal = false;
          this.dismissConfirmedModal = true;
      },
      toggleMessageModal(state) {
        this.messageModal = state
      },
      toggleProposalModal(state) {
        this.proposalModal = state
      },
      proposalAccepted(proposal) {
        this.proposalModal = false

        let proposalIndex = this.proposals.findIndex(p => {return p.id === proposal.id})

        if (proposalIndex !== null) {
          this.proposals.splice(proposalIndex, 1)
        }

        this.currentProposal = null

      },
      proposalDismissed(proposal) {
        this.proposalModal = false

        let proposalIndex = this.proposals.findIndex(p => {return p.id === proposal.id})

        if (proposalIndex !== null) {
          this.proposals.splice(proposalIndex, 1)
        }

        this.currentProposal = null
      },
      pay () {
        // createToken returns a Promise which resolves in a result object with
        // either a token or an error key.
        // See https://stripe.com/docs/api#tokens for the token object.
        // See https://stripe.com/docs/api#errors for the error object.
        // More general https://stripe.com/docs/stripe.js#stripe-create-token.

        this.$validator.validateAll().then(result => {
          if (result) {

            createToken().then(data => {
              if (data.error) {
                this.$store.dispatch('alert', {
                  'text': data.error.message,
                  'color': 'red'
                })
                return
              }

              this.stripeToken = data.token
              this.accepting = true

              this.$http.post(`campaign/${this.campaign.id}/accept-proposal`, {
                'proposal_id': this.currentProposal.id,
                'token_id': this.stripeToken.id,
                'save_card': this.saveCard
              }).then(result => {
                this.$store.dispatch('alert', {
                  'text': "Proposal has been accepted and the funds have been put in escrow!",
                  'color': 'green'
                })

                let proposalIndex = this.proposals.findIndex(p => {return p.id === this.currentProposal.id})

                if (proposalIndex !== null) {
                  this.proposals.splice(proposalIndex, 1)
                }

                this.accepting = false
                this.acceptModal = false
                this.currentProposal = null

              }).catch(error => {
                this.$store.dispatch('alert', {
                  'text': error.response.data.error.message,
                  'color': 'red',
                  'multiline': true
                })
                this.accepting = false
              })
            }).catch(error => {
              console.error(error)
            })
          }
        })

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .base--size {
    font-size: 22px;
    vertical-align: bottom;
  }
  /*.stripe-card {*/
    /*width: 300px;*/
    /*border: 1px solid grey;*/
  /*}*/
  /*.stripe-card.complete {*/
    /*border-color: green;*/
  /*}*/

  /**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
  .StripeElement {
    background-color: white;
    height: 40px;
    padding: 10px 12px;
    border-radius: 0px;
    border: 1px solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.87);
    /*box-shadow: 0 1px 3px 0 #e6ebf1;*/
    /*-webkit-transition: box-shadow 150ms ease;*/
    /*transition: box-shadow 150ms ease;*/
  }

  .StripeElement--focus {
    /*box-shadow: 0 1px 3px 0 #cfd7df;*/
  }

  .StripeElement--invalid {
    border-bottom-color: #fa755a;
  }

  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
</style>
