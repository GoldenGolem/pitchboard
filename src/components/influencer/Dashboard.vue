<template>
  <v-layout row justify-center>
    <v-flex sm12>
      <v-layout row align-center class="mb-3">
        <v-flex sm8>
          <h4 class="subheading">
            <v-icon small class="primary--text mr-3" style="font-size: 22px">dashboard</v-icon> <strong>Your Dashboard</strong>
          </h4>
          <!--<h4 class="subheading">-->
          <!--<v-icon small class="primary&#45;&#45;text mr-3" style="font-size: 22px">play_circle_outline</v-icon> <strong>Your Opportunities</strong>-->
          <!--<span class="grey&#45;&#45;text"> / {{ campaignsResult.total }} in total</span>-->
          <!--</h4>-->
        </v-flex>
      </v-layout>

      <v-card class="elevation-1">
        <v-layout row>
          <v-flex md4 style="border-right: 1px solid #eeeeee">
            <!--<router-link :to="{ 'name': 'influencerWork' }">-->
              <v-card-text class="pa-4">
                <h4 class="display-1 primary--text mb-0">{{ dash.wip.count }}</h4>
                <h5 class="body-2 mb-2"><strong>WORKS IN PROGRESS</strong></h5>
                <v-chip small class="black white--text"><strong class="mr-1">{{ dash.wip.escrow | currency('$', 0) }}</strong> in escrow</v-chip>
              </v-card-text>
            <!--</router-link>-->
          </v-flex>
          <v-flex md4 style="border-right: 1px solid #eeeeee">
            <v-card-text class="pa-4">
              <h4 class="display-1 primary--text mb-0">{{ dash.submitted }}</h4>
              <h5 class="body-2 mb-0"><strong>SUBMITTED PROPOSALS</strong></h5>
              <!--<v-chip small class="black white&#45;&#45;text"><strong>{{ campaign.open_cost | currency }}</strong></v-chip>-->
              <!--<v-btn tag="a" :to="{ 'name': 'viewCampaignProposals' }" class="purple" block dark>VIEW PROPOSALS</v-btn>-->
            </v-card-text>
          </v-flex>
          <v-flex md4 style="border-right: 1px solid #eeeeee">
            <v-card-text class="pa-4">
              <h4 class="display-1 primary--text mb-0">{{ dash.newOpportunites }}</h4>
              <h5 class="body-2 mb-0"><strong>NEW OPPORTUNITIES</strong></h5>
              <!--<v-chip small class="black white&#45;&#45;text"><strong>{{ campaign.accepted_cost | currency }}</strong></v-chip>-->
              <!--<v-btn tag="a" :to="{ 'name': 'viewCampaignAccepted' }" class="purple" block dark>VIEW IN PROGRESS</v-btn>-->
            </v-card-text>
          </v-flex>
          <v-flex md4>
            <v-card-text class="pa-4">
              <h4 class="display-1 primary--text mb-0">{{ dash.nextPayment.amount | currency('$', 0) }}</h4>
              <h5 class="body-2 mb-2"><strong>NEXT PAYMENT</strong></h5>
              <v-chip small class="black white--text" v-if="dash.nextPayment.amount"><strong></strong></v-chip>
              <!--<v-btn tag="a" :to="{ 'name': 'viewCampaignPublished' }" class="purple" block dark>VIEW PUBLISHED</v-btn>-->
            </v-card-text>
          </v-flex>
        </v-layout>
      </v-card>

      <v-layout row align-center class="mb-3 mt-5">
        <v-flex sm8>
          <h4 class="subheading">
            <v-icon small class="primary--text mr-3" style="font-size: 22px">assignment</v-icon> <strong>Work In Progress</strong>
          </h4>
          <!--<h4 class="subheading">-->
          <!--<v-icon small class="primary&#45;&#45;text mr-3" style="font-size: 22px">play_circle_outline</v-icon> <strong>Your Opportunities</strong>-->
          <!--<span class="grey&#45;&#45;text"> / {{ campaignsResult.total }} in total</span>-->
          <!--</h4>-->
        </v-flex>
        <v-flex sm8 class="text-sm-right">
          <v-btn flat color="grey" :to="{ 'name': 'influencerWork' }">
            All Work In Progress
            <v-icon right>arrow_forward</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>

      <div v-if="loadingProposals">
        <v-layout align-center justify-center column>
          <v-progress-circular indeterminate :width="1" :size="80" color="purple"></v-progress-circular>
          <div class="text-xs-center subheading grey--text text--darken-2 mt-4">
            Loading...
          </div>
        </v-layout>
      </div>
      <v-card color="white" v-else-if="proposals.length === 0">
        <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
          Nothing in progress right now
        </div>
      </v-card>
      <v-container grid-list-md style="padding: 0px" v-else>
        <v-layout row wrap justify-content-space-between>
          <proposal-card
              v-for="proposal in proposals"
              :campaign="proposal.campaign"
              :profile="profile"
              :proposal="proposal"
              :key="proposal.id"
              class="mb-3"
              :threeColumns="true"
              @click.native="workInProgress(proposal)">
          </proposal-card>
        </v-layout>
      </v-container>

      <v-layout row align-center justify-center class="mb-3 mt-5">
        <v-flex sm8>
          <h4 class="subheading">
            <v-icon small class="primary--text mr-3" style="font-size: 22px">play_circle_outline</v-icon> <strong>Your Opportunities</strong>
            <span class="grey--text"> / {{ campaignsResult.total }} in total</span>
          </h4>
        </v-flex>
        <v-flex sm8 class="text-sm-right">
          <v-btn flat color="grey" :to="{ 'name': 'influencerOpportunities' }">
            All Opportunities
            <v-icon right>arrow_forward</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>

      <div v-if="loadingCampaigns">
        <v-layout align-center justify-center column>
          <v-progress-circular indeterminate :width="1" :size="80" color="purple"></v-progress-circular>
          <div class="text-xs-center subheading grey--text text--darken-2 mt-4">
            Loading...
          </div>
        </v-layout>
      </div>
      <v-card color="white" v-else-if="campaigns.length === 0">
        <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
          No opportunities right now. Please check back later.
        </div>
      </v-card>
      <div v-else>
        <v-container grid-list-md style="padding: 0px">
          <v-layout row wrap>
            <opportunity-card v-for="campaign in campaigns" :campaign="campaign" :key="campaign.id" :threeColumns="true"
                              @triggerCampaign="opportunities(campaign)" class="mb-3"></opportunity-card>
          </v-layout>
        </v-container>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
  // require styles
  import ProfileBar from './proposals/ProfileBar'
  import OpportunityCard from './proposals/OpportunityCard'
  import ProposalCard from './proposals/ProposalCard'
  import ProposalModal from './proposals/ProposalModal'
  import OpportunityModal from './proposals/OpportunityModal'

  function defaultProposal() {
    return {
      id: null,
      pitch: null,
      grossFee: null,
      turnaround: 7,
      networks: []
    }
  }
  export default {
    components: {
      ProfileBar, OpportunityCard, ProposalCard, ProposalModal, OpportunityModal
    },
    data () {
      return {
        loadingCampaigns: true,
        loadingProposals: true,
        dash: {
          wip: {
            count: 0,
            escrow: 0
          },
          submitted: 0,
          newOpportunites: 0,
          nextPayment: {
            amount: 0,
            date: null
          }
        },
        search: null,
        filter: 'new',
        campaigns: [],
        campaign: null,
        opportunityModal: false,
        proposal: defaultProposal(),
        proposalModal: false,
        proposals: [],
        campaignsResult: {
          total: 0,
          next_page_url: null,
          prev_page_url: null,
          from: null
        },
        proposalsResult: {
          total: 0,
          next_page_url: null,
          prev_page_url: null,
          from: null
        },
        tab: null,
        profile: {},
        drawer: false,
        loading: false,
        messageModal: false
      }
    },
    mounted() {
      this.fetchStats()
      this.fetchOpportunities()
      this.fetchProposals()
    },
    watch: {
      'filter': function () {
//        this.proposals = []
//        this.campaigns = []
//        if (this.filter === 'sent') {
//          this.fetchProposals('pending')
//        } else if (this.filter === 'expired') {
//          this.fetchProposals('cancelled')
//        } else if (this.filter === 'new') {
          this.fetchOpportunities()
//        }
      },
    },
    computed: {
      user() {
        return this.$store.state.user.data
      },
    },
    methods: {
      fetchStats() {
        this.$http.get('influencer/stats').then(result => {
          this.dash.wip.escrow = result.data.wip.fee
          this.dash.wip.count = result.data.wip.count
          this.dash.submitted = result.data.submitted.count
          this.dash.newOpportunites = result.data.new_opportunities.count
          this.dash.nextPayment.amount = result.data.next_payment.amount
          this.dash.nextPayment.date = result.data.next_payment.date

        })
      },
      fetchProposals(status) {
        this.loadingProposals = true
        this.$http.get('proposals', { params: { status: 'accepted' }}).then(result => {
          this.loadingProposals = false
          this.proposals = result.data.data
          this.proposalsResult.from = result.data.from
          this.proposalsResult.next_page_url = result.data.next_page_url
          this.proposalsResult.prev_page_url = result.data.prev_page_url
          this.proposalsResult.total = result.data.total
        }).catch(error => {
          this.loadingProposals = false
        })
      },
      fetchOpportunities() {
        this.loadingCampaigns = true
        this.$http.get('opportunities', { params: {'filter': 'new' } }).then(result => {
          this.loadingCampaigns = false
          this.campaigns = result.data.data
          this.campaignsResult.from = result.data.from
          this.campaignsResult.next_page_url = result.data.next_page_url
          this.campaignsResult.prev_page_url = result.data.prev_page_url
          this.campaignsResult.total = result.data.total
        }).catch(error => {
          this.loadingCampaigns = false
        })
      },
      opportunities(campaign) {
        this.$router.push({ name: 'influencerOpportunities', query: { c: campaign.id } })
      },
      workInProgress(proposal) {
        this.$router.push({ name: 'influencerWork', query: { p: proposal.id } })
      },
      updateProposal(newProposal) {
        this.proposal = newProposal

        let proposalIndex = this.proposals.findIndex(p => {return p.id === newProposal.id})

        if (proposalIndex !== null) this.proposals.splice(proposalIndex, 1, newProposal)
      },
      openMessages(proposal) {
        this.messageModal = true
      },
      toggleMessageModal(state) {
        this.messageModal = state
      },
      toggleProposalModal(state) {
        console.log('toggleProposalModal', state)
        this.proposalModal = state
      },
      toggleOpportunityModal(state) {
        this.opportunityModal = state
      }
    }
  }
</script>

<style>
  .quill-editor .ql-container {
    height: 170px !important;
  }
</style>

<style>
  .dialog--relative {
    position: relative !important;
    overflow-x: hidden;
  }

  .remove-opp-enter-active, .remove-opp-leave-active {
    transition: all 0.5s;
  }
  .remove-opp-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-100%);
  }
</style>