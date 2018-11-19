<template>

  <v-dialog v-model="opportunityModalVisible" maxWidth="1150px" transition="fade" content-class="full-height">
    <v-btn flat dark large fab @click.native="opportunityModalVisible = false" class="btn--close">
      <v-icon>close</v-icon>
    </v-btn>
    <v-card class="grey lighten-2 pb-modal" v-if="campaign">
      <v-layout justify-flex-end fill-height>
        <campaign-sidebar :campaign="campaign" :proposal="null" @sendProposal="currentTab = 'proposal'"></campaign-sidebar>
        <v-flex sm11 style="overflow: auto">
          <v-card-text class="scrollable pa-5" style="padding-left: 70px !important; padding-right: 70px !important; position: relative">
            <v-toolbar
                class="pa-0 elevation-0 mb-5"
                dense
            >
              <v-tabs v-model="currentTab" color="white" class="tabs--condensed white ma-0 elevation-1">
                <v-tab href="#campaign">
                  <v-icon class="orange--text">assignment</v-icon>
                  Campaign Details
                </v-tab>
                <v-tab href="#proposal">
                  <v-icon class="red--text">mail_outline</v-icon>
                  Send Proposal
                </v-tab>
                <v-tabs-slider></v-tabs-slider>
              </v-tabs>
            </v-toolbar>
            <v-tabs-items id="toolbar-scrollable" v-model="currentTab" style="overflow: visible">
              <!-- TAB -- CAMPAIGN -->
              <v-tab-item id="campaign" transition="fade" reverse-transition="fade">

                <campaign :campaign="campaign"></campaign>

              </v-tab-item>


              <!-- TAB -- PROPOSAL -->
              <v-tab-item
                  id="proposal"
                  transition="fade"
                  reverse-transition="fade"
              >

                <proposal-form
                    :proposal="proposal"
                    :campaign="campaign"
                    :profile="profile"
                    @close="currentTab = 'campaign'"
                    @proposalSent="proposalSent"
                ></proposal-form>

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

  export default {
    props: [
      'opportunityModal', 'proposal', 'campaign', 'profile'
    ],
    components: {
      ProposalForm, CampaignSidebar, Campaign
    },
    data () {
      return {
        filter: 'new',
        loading: false,
        currentTab: 'campaign'
      }
    },
    mounted() {
    },
    computed: {
      opportunityModalVisible: {
        get() {
          return this.opportunityModal
        },
        set(value) {
          this.$emit('modalToggled', value)
        }
      }
    },
    methods: {
      closeModal() {
        this.$emit('modalToggled', false)
      },
      proposalSent(proposal) {
        console.log('emitting proposal sent in opp modal')
        this.$emit('proposalSent', proposal)
      }
    }
  }
</script>

<style>



</style>