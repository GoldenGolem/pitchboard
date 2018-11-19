<template>
  <div class="main-content">
    <h4 class="subheading mb-4">
      <v-icon small class="primary--text mr-3" style="font-size: 22px">email</v-icon> <strong>Messages</strong>
    </h4>

    <v-toolbar dense class="white pa-0 elevation-1 mb-5">
      <v-layout row justify-center align-center>
        <v-flex sm6>
          <v-tabs class="tabs--condensed white elevation-0">
            <v-tab @click="filter = null">
              <v-icon class="primary--text">inbox</v-icon>
              All
            </v-tab>
            <v-tab @click="filter = 'pending'">
              <v-icon class="red--text">list</v-icon>
              Proposal
            </v-tab>
            <v-tab @click="filter = 'accepted'">
              <v-icon class="green--text">done_all</v-icon>
              In Progress
            </v-tab>
            <v-tab @click="filter = 'published'">
              <v-icon class="purple--text">cloud_done</v-icon>
              Published
            </v-tab>
            <!--<v-tabs-slider></v-tabs-slider>-->
          </v-tabs>
        </v-flex>
        <v-flex sm8 class="d-flex justify-end">
          <v-switch
              label="Include Archived"
              hide-details
              color="primary"
              v-model="archived"
              class="small"
              style="margin-bottom: -3px"
          ></v-switch>
        </v-flex>
        <v-flex sm2 class="text-sm-right pr-2">

          <v-menu full-width>
            <v-btn block flat slot="activator">
              <span v-if="direction === 'sent'">Sent</span>
              <span v-else-if="direction === 'received'">Received</span>
              <span v-else>All</span>
              <v-icon right>arrow_drop_down</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="direction = null">
                <v-list-tile-title>All</v-list-tile-title>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile @click="direction = 'sent'">
                <v-list-tile-title>Sent</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="direction = 'received'">
                <v-list-tile-title>Received</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>

    </v-toolbar>


    <v-list two-line dense>
      <v-list-tile>
        <v-list-tile-avatar></v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title style="height: auto">
            <v-layout row align-center>
              <v-flex sm7 class="grey--text caption">
                Last Message
              </v-flex>
              <v-flex sm4 class="ml-2 grey--text caption">
                Campaign
              </v-flex>
              <v-flex sm5 class="ml-2 grey--text caption text-xs-right">
                <transition name="fade">
                  <v-pagination
                      :length="result.last_page"
                      v-model="page"
                      circle
                      v-if="result && result.last_page > 1"
                  ></v-pagination>
                </transition>
              </v-flex>
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>

        </v-list-tile-action>
      </v-list-tile>
      <v-divider></v-divider>
      <template v-for="conversation, index in conversations">
        <v-list-tile :class="{ 'unread grey lighten-4': !conversation.read }" tag="div" @click="">
          <v-list-tile-avatar @click="openProposal(conversation)">
            <v-avatar size="30px" class="mt-2 mb-2">
              <img :src="conversation.sender.avatar">
            </v-avatar>
          </v-list-tile-avatar>
          <!--<v-list-tile-content>-->
            <v-layout row align-center>
              <v-flex sm7 @click="openProposal(conversation)" class="message caption wrap-ellipsis">
                {{ conversation.message }}
              </v-flex>
              <v-flex sm8 class="ml-2 caption" @click="openProposal(conversation)">
                <v-list-tile-title class="caption" style="">
                  {{ conversation.conversation.proposal.campaign.brand }} &middot;
                  {{ conversation.conversation.proposal.campaign.title }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  <v-avatar size="16px">
                    <img :src="conversation.conversation.proposal.influencer.user.avatar">
                  </v-avatar>
                  <strong>{{ conversation.conversation.proposal.influencer.name }}</strong> for
                  <strong>{{ conversation.conversation.proposal.fee_gross | currency }}</strong>
                </v-list-tile-sub-title>
              </v-flex>
            </v-layout>
          <!--</v-list-tile-content>-->
          <v-list-tile-action class="text-xs-center">
            <v-menu>
              <v-btn icon flat slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list dense>
                <v-list-tile @click="openProposal(conversation)">
                  <v-list-tile-title>View Proposal</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="markUnread(conversation)" v-if="conversation.read">
                  <v-list-tile-title>Mark as Unread</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="markRead(conversation)" v-else>
                  <v-list-tile-title>Mark as Read</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index < conversations.length - 1"></v-divider>
      </template>
      <v-list-tile v-if="loading" style="height: 80px">
        <v-layout align-center justify-center fill-height>
          <span>Loading...</span>
        </v-layout>
      </v-list-tile>
      <v-list-tile v-if="!loading && conversations.length === 0" style="height: 50px">
        <v-list-tile-title class="text-sm-center subheading grey--text text--darken-2" >
          There are no messages.
        </v-list-tile-title>
      </v-list-tile>

    </v-list>

    <v-dialog v-model="loadingProposal" max-width="300px" content-class="elevation-0">
      <v-layout align-center justify-center column>
        <v-flex>
        <v-progress-circular indeterminate :size="50" color="white"></v-progress-circular>
        </v-flex>
        <v-flex>
          <span class="white--text">Loading Proposal...</span>
        </v-flex>
      </v-layout>
    </v-dialog>

    <proposal-modal
        :proposal="currentProposal"
        :campaign="currentProposal.campaign"
        :proposalModal="proposalModal"
        goTo="chat"
        @modalToggled="toggleProposalModal"
        v-if="currentProposal && currentProposal.status > 1"
    >
    </proposal-modal>

    <new-proposal-modal
        :proposal="currentProposal"
        :proposalModal="newProposalModal"
        @modalToggled="toggleNewProposalModal"
        @proposalAccepted="proposalAccepted"
        @proposalDismissed="proposalDismissed"
        goTo="chat"
        v-if="currentProposal && currentProposal.status === 1"
    >
    </new-proposal-modal>


  </div>
</template>

<script>
  import ProposalModal from './proposals/ProposalModal'
  import NewProposalModal from './proposals/NewProposalModal'
  // require styles

  export default {
    components: {
      ProposalModal, NewProposalModal
    },
    data () {
      return {
        'proposalModal': false,
        'newProposalModal': false,
        'currentProposal': null,
        'conversations': [],
        'result': null,
        'loading': false,
        'loadingProposal': false,
        'filter': null,
        'archived': false,
        'direction': null,
        'page': 1
      }
    },
    mounted() {
      this.fetchMessages()
    },
    watch: {
      'filter': function () {
        this.page = 1
        this.fetchMessages()
      },
      'page': function () {
        this.fetchMessages()
      },
      'direction': function () {
        this.page = 1
        this.fetchMessages()
      }
    },
    computed: {
      user() {
        return this.$store.state.user.data
      }
    },
    methods: {
      fetchMessages() {
        this.loading = true
        this.conversations = []
        this.$http.get('all-messages', { params: {
          'proposal_status': this.filter,
          'direction': this.direction,
          'archived': this.archived,
          'page': this.page
        }}).then(result => {
          this.loading = false
          this.conversations = result.data.messages
          this.result = result.data.result
        }).catch(error => {
          this.loading = false
        })
      },
      openProposal(conversation) {
        this.loadingProposal = true

        this.$http.get(`campaign/proposal/${conversation.conversation.proposal_id}`).then(result => {
          console.log('loaded proposal')
          this.currentProposal = result.data
          if (this.currentProposal.status === 1) {
            this.newProposalModal = true
          } else {
            this.proposalModal = true
          }
          this.loadingProposal = false
        }).catch(error => {
          this.loadingProposal = true
          this.$store.dispatch('alert', {
            'text': 'There was an error retrieving the proposal',
            'color': 'red'
          })
        })
//        this.currentProposal = conversation.conversation.proposal
//        this.proposalModal = true
      },
      toggleProposalModal(value) {
        this.proposalModal = value;
      },
      toggleNewProposalModal(value) {
        this.newProposalModal = value;
      },
      markRead(conversation) {
        this.$http.get(`conversation/${conversation.conversation_id}/read`).then(result => {
          conversation.read = true
        })
      },
      markUnread(conversation) {
        this.$http.get(`conversation/${conversation.conversation_id}/unread`).then(result => {
          conversation.read = false
        })
      },
      proposalAccepted(proposal) {
        this.newProposalModal = false

        this.currentProposal = null

        this.fetchMessages()
      },
      proposalDismissed(proposal) {
        this.newProposalModal = false

        this.currentProposal = null

        this.fetchMessages()
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

  .list li.unread .message {
    font-weight: 600;
  }

  .small.switch label {
    font-size: 14px;
  }

</style>