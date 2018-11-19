<template>

  <v-dialog v-model="proposalModalVisible" maxWidth="1190px" transition="" content-class="full-height">
    <v-btn flat dark large fab @click.native="proposalModalVisible = false" class="btn--close">
      <v-icon>close</v-icon>
    </v-btn>
    <v-card class="grey lighten-2 pb-modal">
      <v-layout justify-flex-end fill-height>
        <proposal-sidebar
            :proposal="proposal"
            :campaign="campaign"
            @goto="switchTab"
        ></proposal-sidebar>
        <v-flex sm11 style="overflow: auto">

            <v-card-text class="scrollable pa-5" style="padding-left: 70px !important; padding-right: 70px !important; position: relative">
              <v-toolbar
                  class="pa-0 elevation-0 mb-5"
                  dense
              >
                <v-tabs color="white" class="ma-0 elevation-1 tabs--condensed" v-model="currentTab">
                  <v-tab href="#proposal" v-if="proposal.id">
                    <v-icon class="blue--text">assignment</v-icon>
                    Proposal
                  </v-tab>
                  <v-tab href="#drafts" v-if="proposal.id && campaign.approval">
                    <v-icon class="teal--text">content_paste</v-icon>
                    <span v-if="proposal.status > 2">Published</span>
                    <span v-else>Drafts</span>
                  </v-tab>
                  <v-tab href="#chat" v-if="proposal.id">
                    <v-icon class="purple--text">chat</v-icon>
                    Collaborate
                  </v-tab>
                  <v-tab href="#stats" v-if="proposal.id">
                    <v-icon class="orange--text">attach_money</v-icon>
                    Payment
                  </v-tab>
                  <v-tab href="#stats" v-if="proposal.id" :disabled="proposal.status !== 3" :class="{ 'grey--text': proposal.status !== 3 }" >
                    <v-icon :class="{ 'primary--text': proposal.status === 3 }">cloud_done</v-icon>
                    Stats
                  </v-tab>
                  <v-tabs-slider></v-tabs-slider>
                </v-tabs>
              </v-toolbar>
              <v-tabs-items id="toolbar-scrollable" style="overflow: visible" v-model="currentTab">
                <!-- TAB -- PROPOSAL -->
                <v-tab-item
                    id="proposal"
                    transition="fade"
                    reverse-transition="fade"
                    class="pb-2"
                >

                  <proposal :proposal="proposal"></proposal>

                </v-tab-item>

                <v-tab-item
                    id="drafts"
                    transition="fade"
                    reverse-transition="fade"
                    class="pb-2"
                    v-if="campaign.approval"
                >

                  <drafts :proposal="proposal"
                          @sendMessage="currentTab = 'chat'"
                          @proposalUpdated="(proposal) => {$emit('proposalUpdated', proposal)}"
                  ></drafts>

                </v-tab-item>

                <v-tab-item
                    id="chat"
                    transition="fade"
                    reverse-transition="fade"
                    class="pb-2"
                >

                  <chat :proposal="proposal"></chat>

                </v-tab-item>

              </v-tabs-items>

            </v-card-text>


        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>

</template>

<script>
//  import ProposalForm from './modal/ProposalForm'
//  import CampaignSidebar from './modal/CampaignSidebar'
//  import Campaign from './modal/Campaign'
  import Proposal from './modal/Proposal'
//  import Work from './modal/Work'
  import Chat from './modal/Chat'
  import Drafts from './modal/Drafts'
  import ProposalSidebar from './modal/Sidebar'

  export default {
    props: [
      'proposalModal', 'proposal', 'campaign', 'goTo'
    ],
    components: {
      ProposalSidebar, Proposal, Chat, Drafts
//      CampaignSidebar, Campaign, Proposal, Work, ProposalForm, Chat
    },
    data () {
      return {
        currentTab: 'proposal'
      }
    },
    mounted() {
      this.handleInitTab()
    },
    computed: {
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
        this.handleInitTab()
      },
      'goTo': function () {
        this.currentTab = this.goTo
      }
    },
    methods: {
      handleInitTab() {
        if (this.goTo) {
          this.currentTab = this.goTo
        } else {
          if (!this.proposal.id) this.currentTab = 'campaign'
          if (this.proposal.status === 1) this.currentTab = 'proposal'
          if (this.proposal.status === 2) {
            if (this.campaign.approval && this.proposal.approval_status === 1) this.currentTab = 'drafts'
            else this.currentTab = 'chat'
          }
          if (this.proposal.status === 3) this.currentTab = 'stats'
        }
      },
      switchTab(tab) {
        this.currentTab = tab
      }
    }
  }
</script>

<style>



</style>