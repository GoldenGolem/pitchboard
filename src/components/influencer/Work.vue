<template>
  <div class="main-content">
    <h4 class="subheading mb-4">
      <v-icon small class="primary--text mr-3" style="font-size: 22px">assignment</v-icon> <strong>Your Work</strong>
    </h4>

    <v-tabs class="tabs--condensed white mb-3 elevation-1" fixed v-model="tab">
        <v-tab :href="'#draft'">
          <v-icon class="primary--text">edit</v-icon>
          Submit Draft
        </v-tab>
        <v-tab :href="'#ready'">
          <v-icon class="orange--text">done</v-icon>
          Ready To Publish
        </v-tab>
        <v-tab :href="'#sent'">
          <v-icon class="green--text">done_all</v-icon>
          Published Work
        </v-tab>
        <v-tabs-slider></v-tabs-slider>
    </v-tabs>
    <div v-if="loading">
      <v-layout align-center justify-center column>
        <v-progress-circular indeterminate :width="1" :size="80" color="purple"></v-progress-circular>
        <div class="text-xs-center subheading grey--text text--darken-2 mt-4">
          Loading...
        </div>
      </v-layout>
    </div>
    <v-card color="white" v-else-if="filter.status === 'accepted' && filter.approval === 'not_approved' && proposals.length === 0">
      <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
        Nothing to submit right now
      </div>
    </v-card>
    <v-card color="white" v-else-if="filter.status === 'accepted' && proposals.length === 0">
      <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
        Nothing to publish right now
      </div>
    </v-card>
    <v-card color="white" v-else-if="filter.status === 'published' && proposals.length === 0">
      <div class="text-xs-center subheading grey--text text--darken-2 pa-5">
        No published content right now
      </div>
    </v-card>

    <v-container grid-list-md style="padding: 0px" v-if="proposals.length > 0">
      <v-layout row wrap justify-content-space-between>
        <proposal-card
            v-for="proposal in proposals"
            :campaign="proposal.campaign"
            :profile="profile"
            :proposal="proposal"
            :key="proposal.id"
            class="mb-3"
            @click.native="triggerProposalDetails(proposal, proposal.campaign)">
        </proposal-card>
      </v-layout>
    </v-container>

    <proposal-modal
        :proposal="proposal"
        :campaign="campaign"
        :proposalModal="proposalModal"
        :profile="profile"
        @proposalUpdated="updateProposal"
        @proposalPublished="publishProposal"
        @openMessages="openMessages"
        @modalToggled="toggleProposalModal"
    ></proposal-modal>

  </div>
</template>

<script>
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  import ProposalCard from './proposals/ProposalCard'
  import ProposalModal from './proposals/ProposalModal'

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
      ProposalCard, ProposalModal
    },
    data () {
      return {
        search: null,
        filter: {
          'status': 'accepted',
          'approval': 'not_approved'
        },
        tab: 'draft',
        campaigns: [],
        campaignsResult: {
          total: 0,
          next_page_url: null,
          prev_page_url: null,
          from: null
        },
        campaign: null,
        campaignModal: false,
        proposal: defaultProposal(),
        proposalModal: false,
        proposals: [],
        proposalsResult: {
          total: 0,
          next_page_url: null,
          prev_page_url: null,
          from: null
        },
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

      console.log(this.$route.query)

      if (this.$route.query.p) {
        this.$http.get(`proposal/${this.$route.query.p}`).then(result => {
          let proposal = result.data

          if (!proposal.campaign.approval || proposal.approval_status === 2) {
            this.tab = 'ready'
          }

          this.campaign = proposal.campaign
          this.proposal = proposal
          this.proposalModal = true

        })
      }

      this.fetchProposals(this.filter)
    },
    watch: {
      'filter': {
        deep: true,
        handler: function () {
          this.proposals = []
          this.fetchProposals(this.filter)
        }
      },
      'tab': function (value) {
        if (value === 'draft') {
          this.filter.status = 'accepted'
          this.filter.approval = 'not_approved'
        } else if (value === 'ready') {
          this.filter.status = 'accepted'
          this.filter.approval = 'approved'
        } else if (value === 'sent') {
          this.filter.status = 'published'
        }
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
      fetchProposals(filter) {
        this.loading = true
        this.$http.get('proposals', { params: { status: filter.status, approval: filter.approval }}).then(result => {
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
      triggerProposalDetails(proposal, campaign) {
        this.proposal = proposal
        this.campaign = campaign
        this.proposalModal = true
      },
      proposalSent(proposal) {
        let campaignId = this.campaigns.findIndex(c => {return c.id === proposal.campaign_id})

        let newCampaign = {...this.campaigns[campaignId], submitted: true}

        if (campaignId !== null) {
          this.campaigns.splice(campaignId, 1, newCampaign)
        }

        this.campaignModal = false
        this.campaign = null
      },
      updateProposal(newProposal) {
        this.proposal = newProposal

        let proposalIndex = this.proposals.findIndex(p => {return p.id === newProposal.id})

        if (proposalIndex !== null) this.proposals.splice(proposalIndex, 1, newProposal)
      },
      publishProposal(newProposal) {
        this.proposal = newProposal

        let proposalIndex = this.proposals.findIndex(p => {return p.id === newProposal.id})
        console.log(proposalIndex, 'for publish')

        if (proposalIndex !== null) this.proposals.splice(proposalIndex, 1)
      },
      openMessages(proposal) {
        this.messageModal = true
      },
      toggleMessageModal(state) {
        this.messageModal = state
      },
      toggleProposalModal(state) {
        this.proposalModal = state
      },
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