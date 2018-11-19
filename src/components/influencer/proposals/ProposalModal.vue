<template>

  <v-dialog v-model="proposalModalVisible" maxWidth="1190px" transition="fade" content-class="full-height">
    <v-btn flat dark large fab @click.native="proposalModalVisible = false" class="btn--close">
      <v-icon>close</v-icon>
    </v-btn>
    <v-card class="grey lighten-2 pb-modal" v-if="campaign">
      <v-layout justify-flex-end fill-height>
        <campaign-sidebar
            :campaign="campaign"
            :proposal="proposal"
            @sendProposal="currentTab = 'proposal'"
            @editProposal="currentTab = 'proposal'; proposalForm = true"
            @goTo="(to) => {this.currentTab = to}"
        ></campaign-sidebar>
        <v-flex sm11 style="overflow: auto">


            <v-card-text class="scrollable pa-5" style="padding-left: 70px !important; padding-right: 70px !important; position: relative">
              <v-toolbar
                  class="pa-0 elevation-0 mb-5"
                  dense
              >
                <v-tabs class="tabs--condensed white ma-0 elevation-1" v-model="currentTab">
                  <v-tab href="#campaign">
                    <v-icon class="orange--text">assignment</v-icon>
                    Campaign
                  </v-tab>
                  <v-tab href="#proposal">
                    <v-icon class="red--text">mail_outline</v-icon>
                    Your Proposal
                  </v-tab>
                  <v-tab href="#work" :disabled="!showWorkTab" :class="{'grey--text': !showWorkTab}" v-if="showWorkTab">
                    <v-icon :class="{'green--text': showWorkTab}">done_all</v-icon>
                    <span v-if="proposal.status < 3">Work</span>
                    <span v-else>Published</span>
                  </v-tab>
                  <v-tab href="#chat" :disabled="!showChatTab" :class="{'grey--text': !showChatTab}" v-if="proposal.id">
                    <v-icon :class="{'purple--text': showChatTab}">message</v-icon>
                    <span v-if="proposalStatus === 'accepted'">Collaborate</span>
                    <span v-else>Chat</span>
                  </v-tab>
                  <v-tab href="#payment" :disabled="!showPaymentTab" :class="{'grey--text': !showPaymentTab}" v-if="proposal.id">
                    <v-icon :class="{'primary--text': showPaymentTab}">attach_money</v-icon>
                    Payment
                  </v-tab>
                  <v-tab href="#stats" :disabled="!showStatsTab" :class="{'grey--text': !showStatsTab}" v-if="proposal.id">
                    <v-icon :class="{'purple--text': showStatsTab}">cloud_done</v-icon>
                    Stats
                  </v-tab>
                  <v-tabs-slider></v-tabs-slider>
                </v-tabs>
              </v-toolbar>
              <v-tabs-items id="toolbar-scrollable" v-model="currentTab" style="overflow: visible">
                <v-tab-item
                    id="campaign"
                    class="pb-2"
                    transition="fade"
                    reverse-transition="fade"
                >

                  <campaign :campaign="campaign" v-if="campaign"></campaign>

                </v-tab-item>

                <!-- TAB -- PROPOSAL -->
                <v-tab-item
                    id="proposal"
                    class="pb-2"
                    transition="fade"
                    reverse-transition="fade"
                >

                  <proposal-form
                      :proposal="proposal"
                      :campaign="campaign"
                      :profile="profile"
                      @close="proposalForm = false"
                      @proposalUpdated="updateProposal"
                      v-if="proposalForm"
                  ></proposal-form>

                  <proposal
                    :proposal="proposal"
                    :profile="profile"
                    @editProposal="proposalForm = true"
                    v-else
                  ></proposal>

                </v-tab-item>
                <v-tab-item
                    id="work"
                    class="pb-2"
                    transition="fade"
                    reverse-transition="fade"
                >

                  <work :proposal="proposal" :campaign="campaign" :profile="profile"
                        v-if="proposal.id && campaign.id"
                        @proposalUpdated="updateProposal" @proposalPublished="proposalPublished"></work>

                </v-tab-item>

                <v-tab-item
                    id="chat"
                    v-if="showChatTab"
                    class="pb-2"
                    transition="fade"
                    reverse-transition="fade"
                >

                  <chat :proposal="proposal" :campaign="campaign" v-if="proposal"></chat>

                </v-tab-item>

                <v-tab-item
                    id="payment"
                    transition="fade"
                    reverse-transition="fade"
                    class="pb-2"
                >

                  <payment :proposal="proposal"></payment>

                </v-tab-item>
              </v-tabs-items>



            </v-card-text>


        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>

</template>

<script>
  import ProposalForm from './modal/ProposalForm'
  import CampaignSidebar from './modal/CampaignSidebar'
  import Campaign from './modal/Campaign'
  import Proposal from './modal/Proposal'
  import Work from './modal/Work'
  import Chat from './modal/Chat'
  import Payment from './modal/Payment'

  export default {
    props: [
      'proposalModal', 'proposal', 'campaign', 'profile'
    ],
    components: {
      CampaignSidebar, Campaign, Proposal, Work, ProposalForm, Chat, Payment
    },
    data () {
      return {
        proposalForm: false,
        currentTab: 'campaign'
      }
    },
    mounted() {
    },
    computed: {
      networks() {
        if (!this.proposal.networks) return []

        return {
          'facebook': this.proposal.networks.find(n => {return n.network === 'facebook'}),
          'instagram': this.proposal.networks.find(n => {return n.network === 'instagram'}),
          'twitter': this.proposal.networks.find(n => {return n.network === 'twitter'}),
          'youtube': this.proposal.networks.find(n => {return n.network === 'youtube'}),
          'blog': this.proposal.networks.find(n => {return n.network === 'blog'})
        }
      },
      proposalStatus() {
        if (!this.proposal) return false
        if (this.proposal.status === 1) return 'pending'
        if (this.proposal.status === 2) return 'accepted'
        if (this.proposal.status === -1) return 'declined'
        if (this.proposal.status === 0) return 'cancelled'
        if (this.proposal.status === 3) return 'published'
      },
      showWorkTab() {
        return this.proposalStatus === 'accepted' || this.proposalStatus === 'published'
      },
      showPaymentTab() {
        return this.proposalStatus === 'published'
      },
      showStatsTab() {
        return this.proposalStatus === 'published'
      },
      showChatTab() {
        return true
      },
      proposalModalVisible: {
        get() {
          return this.proposalModal
        },
        set(value) {
          this.$emit('modalToggled', value)
        }
      }
    },
    watch: {
      'proposal.id': function (newVal, oldVal) {
        if (!this.proposal.id) this.currentTab = 'campaign'
        if (this.proposalStatus === 'pending') this.currentTab = 'proposal'
        if (this.proposalStatus === 'accepted') this.currentTab = 'work'
        if (this.proposalStatus === 'published') this.currentTab = 'payment'
      }
    },
    methods: {
      closeModal() {
        this.$emit('modalToggled', false)
      },
      updateProposal(newProposal) {
        this.$emit('proposalUpdated', newProposal)
      },
      proposalPublished(newProposal) {
        this.$emit('proposalPublished', newProposal)
      },
      openMessages() {
        this.$emit('openMessages', this.proposal)
      }
    }
  }
</script>

<style>



</style>