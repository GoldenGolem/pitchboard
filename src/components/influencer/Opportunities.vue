<template>
  <div class="main-content">
    <!--<h4 class="subheading grey&#45;&#45;text mb-0">-->
      <!--YOUR OPPORTUNITIES-->
    <!--</h4>-->
    <v-layout row align-center class="mb-4">
      <v-flex sm8>
        <h4 class="subheading mb-0">
          <v-icon small class="primary--text mr-3" style="font-size: 22px">play_circle_outline</v-icon> <strong>Your Opportunities</strong>
          <span class="grey--text"> / {{ campaignsResult.total }} in total</span>
        </h4>
      </v-flex>
      <v-flex sm3 class="mr-3 text-xs-right">
        <!--View by:-->
        <!--<v-menu offset-y>-->
          <!--<v-btn small slot="activator" class="ml-3 primary white&#45;&#45;text">Latest <v-icon class="title" right>fa-caret-down</v-icon></v-btn>-->
          <!--<v-list>-->
            <!--<v-list-tile @click=""> <v-list-tile-title>Total Clicks</v-list-tile-title> </v-list-tile>-->
            <!--<v-list-tile @click=""> <v-list-tile-title>Total Engagement</v-list-tile-title> </v-list-tile>-->
            <!--<v-list-tile @click=""> <v-list-tile-title>Total Shares</v-list-tile-title> </v-list-tile>-->
          <!--</v-list>-->
        <!--</v-menu>-->
      </v-flex>
      <!--<v-flex sm5>-->
        <!--<v-text-field placeholder="Search opportunities..." prefix="" append-icon="search" v-model="search">-->
<!---->
        <!--</v-text-field>-->
      <!--</v-flex>-->
    </v-layout>

    <v-container row>
      <v-flex md12 class="pr-3">
        <v-tabs class="tabs--condensed white mb-3 elevation-1">
            <v-tab :href="'#new'" @click="filter = 'new'">
              <v-icon class="primary--text">assignment</v-icon>
              New Opportunities
            </v-tab>
            <v-tab :href="'#sent'" @click="filter = 'sent'">
              <v-icon class="green--text">done_all</v-icon>
              Proposal Sent
            </v-tab>
            <v-tab :href="'#expired'" @click="filter = 'expired'">
              <v-icon class="red--text">close</v-icon>
              Expired Proposals
            </v-tab>
            <v-tabs-slider :color="filter == 'new' ? 'primary' : (filter == 'sent' ? 'green' : 'red')"></v-tabs-slider>
        </v-tabs>

        <v-layout row class="mb-1" v-if="filter === 'new'">
          <v-flex offset-sm12 sm4 class="text-sm-right">
            <v-menu full-width>
              <v-btn flat slot="activator">
                <span v-if="filter_budget">More than ${{ filter_budget }}</span>
                <span v-else>Budget Filter</span>
                <v-icon right>arrow_drop_down</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click="filter_budget = null">
                  <v-list-tile-title>All Ranges</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="filter_budget = 250">
                  <v-list-tile-title>More than $250</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="filter_budget = 500">
                  <v-list-tile-title>More than $500</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="filter_budget = 1000">
                  <v-list-tile-title>More than $1000</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="filter_budget = 2500">
                  <v-list-tile-title>More than $2500</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
        </v-layout>

        <div v-if="loading">
          <v-layout align-center justify-center column>
            <v-progress-circular indeterminate :width="1" :size="80" color="purple"></v-progress-circular>
            <div class="text-xs-center subheading grey--text text--darken-2 mt-4">
              Loading...
            </div>
          </v-layout>
        </div>
        <v-card color="white" v-else-if="filter === 'new' && campaigns.length === 0">
          <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
            No opportunities right now. Please check back later.
          </div>
        </v-card>
        <v-card color="white" v-else-if="filter === 'sent' && proposals.length === 0">
          <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
            There are sent proposals right now
          </div>
        </v-card>
        <v-card color="white" v-else-if="filter === 'expired' && proposals.length === 0">
          <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
            There are no expired proposals right now
          </div>
        </v-card>
        <div v-if="filter === 'new'">
          <!--<transition-group name="remove-opp" tag="p">-->
          <v-container grid-list-lg style="padding: 0px">
            <v-layout row wrap>
              <opportunity-card v-for="campaign in campaigns" :campaign="campaign" :key="campaign.id" :threeColumns="true"
                                @triggerCampaign="triggerSendProposal"></opportunity-card>
            </v-layout>
          </v-container>
          <!--</transition-group>-->
        </div>
        <div v-else>
          <v-container grid-list-lg style="padding: 0px">
            <v-layout row wrap>
              <proposal-card v-for="proposal in proposals"
                             :campaign="proposal.campaign"
                             :proposal="proposal"
                             :threeColumns="true"
                             :key="proposal.id"
                             @click.native="triggerProposalDetails(proposal, proposal.campaign)"
              ></proposal-card>
            </v-layout>
          </v-container>
        </div>
      </v-flex>
      <v-flex md4 class="pl-5" id="profile">
        <profile-bar></profile-bar>
      </v-flex>
    </v-container>

    <opportunity-modal
        :campaign="campaign"
        :proposal="proposal"
        :opportunityModal="opportunityModal"
        :profile="profile"
        @modalToggled="toggleOpportunityModal"
        @proposalSent="proposalSent"
    ></opportunity-modal>

    <proposal-modal
        :proposal="proposal"
        :campaign="campaign"
        :proposalModal="proposalModal"
        :profile="profile"
        @proposalUpdated="updateProposal"
        @openMessages="openMessages"
        @modalToggled="toggleProposalModal"
    ></proposal-modal>

  </div>
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
        search: null,
        filter: 'new',
        filter_budget: null,
        campaigns: [],
        campaignsResult: {
          total: 0,
          next_page_url: null,
          prev_page_url: null,
          from: null
        },
        campaign: null,
        opportunityModal: false,
        proposal: defaultProposal(),
        proposalModal: false,
        proposals: [],
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
      this.$http.get('influencer/me').then(result => {
        this.profile = result.data
      })

      this.fetchOpportunities()
    },
    watch: {
      'filter': function () {
        this.proposals = []
        this.campaigns = []
        if (this.filter === 'sent') {
          this.fetchProposals('pending')
        } else if (this.filter === 'expired') {
          this.fetchProposals('cancelled')
        } else if (this.filter === 'new') {
          this.fetchOpportunities()
        }
      },
      'filter_budget': function () {
        this.fetchOpportunities()
      }
    },
    computed: {
      user() {
        return this.$store.state.user.data
      },
      advertiserRating() {
        return 3.87
      }
    },
    methods: {
      fetchProposals(status) {
        this.loading = true
        this.$http.get('proposals', { params: { status: status }}).then(result => {
          this.loading = false
          this.proposals = result.data.data
          this.proposalsResult.from = result.data.from
          this.proposalsResult.next_page_url = result.data.next_page_url
          this.proposalsResult.prev_page_url = result.data.prev_page_url
          this.proposalsResult.total = result.data.total
        }).catch(error => {
          this.loading = false
        })
      },
      fetchOpportunities() {
        this.loading = true
        this.$http.get('opportunities', { params: {'filter': 'new', 'budget': this.filter_budget } }).then(result => {
          this.loading = false
          this.campaigns = result.data.data
          this.campaignsResult.from = result.data.from
          this.campaignsResult.next_page_url = result.data.next_page_url
          this.campaignsResult.prev_page_url = result.data.prev_page_url
          this.campaignsResult.total = result.data.total

          if (this.$route.query.c) {
            let campaign = this.campaigns.find(c => {
              return c.id == this.$route.query.c
            })

            if (campaign) this.triggerSendProposal(campaign)
          }
        }).catch(error => {
          this.loading = false
        })
      },
      triggerSendProposal(campaign) {
        this.campaign = campaign
        this.opportunityModal = true
      },
      triggerProposalDetails(proposal, campaign) {
        this.proposal = proposal
        this.campaign = campaign
        this.proposalModal = true
      },
      proposalSent(proposal) {
        console.log('received proposal sent in opportunities', proposal)

        let campaignId = this.campaigns.findIndex(c => {return c.id === proposal.campaign_id})

        if (campaignId !== null) {
          this.campaigns.splice(campaignId, 1)
        }

        this.opportunityModal = false
        this.campaign = null
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
  @media(max-width: 992px){
    #profile{
      margin-top: 30px;
    }
  }
</style>