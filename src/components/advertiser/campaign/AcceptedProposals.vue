<template>
  <div style="margin-top: 100px">
    <v-layout class="mb-4" align-center>
      <v-flex sm8>
        <h5 class="subheading pl-3 mb-0">
          {{ proposals.length }} Accepted Proposals
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
                         :campaign="campaign"
                         :key="index"
                         @showProposal="currentProposal = proposal; proposalModal = true"
                         class="mb-4">
          </proposal-card>
        </v-layout>
      </v-container>
    </div>

    <proposal-modal
        :proposal="currentProposal"
        :campaign="campaign"
        :proposalModal="proposalModal"
        @modalToggled="toggleProposalModal"
        @proposalUpdated="updateProposal"
        v-if="currentProposal"
    >
    </proposal-modal>

  </div>
</template>

<script>
  import ProposalCard from '../proposals/ProposalCard'
  import ProposalModal from '../proposals/ProposalModal'
  import MessageModal from './MessageModal'

  export default {
    components: {
      ProposalCard, ProposalModal
    },
    props: ['campaign'],
    data () {
      return {
        'currentProposal': null,
        'proposalModal': false,
        'proposals': [],
        'proposalsResult': {},
      }
    },
    mounted() {
      this.$http.get(`campaign/${this.campaign.id}/proposals`, { params: { 'status': 'accepted' }}).then(result => {
        this.proposals = result.data.data
      })
    },
    computed: {
      campaignProp() {
        return this.campaign
      }
    },
    methods: {
      toggleProposalModal(state) {
        this.proposalModal = state
      },
      updateProposal(newProposal) {
        console.log('accepted proposals got proposal updated', newProposal)

        let proposalIndex = this.proposals.findIndex(p => {return p.id === newProposal.id})

        if (proposalIndex !== null) {
          console.log('splice', proposalIndex)
          this.proposals.splice(proposalIndex, 1, newProposal)
        }
      },
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
