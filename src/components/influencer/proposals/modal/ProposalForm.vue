<template>
  <v-layout column justify-flex-end fill-height>
    <v-flex class="mb-5">
      <div class="subheading">Include Channels</div>
      <div class="grey--text">Please specify which channels you'll be posting on</div>

      <v-layout align-center justify-space-around class="mt-3">
        <v-flex md3>
          <network-select
              network="facebook"
              :selected="editProposal.networks.indexOf('facebook') > -1"
              :profile="profile.facebook_profile"
              v-if="campaign.networks.indexOf('facebook') > -1"
              @toggleNetworkSelect="toggleNetworkSelect">
          </network-select>
        </v-flex>
        <v-flex md3>
          <network-select
              network="instagram"
              :selected="editProposal.networks.indexOf('instagram') > -1"
              :profile="profile.instagram_profile"
              v-if="campaign.networks.indexOf('instagram') > -1"
              @toggleNetworkSelect="toggleNetworkSelect">
          </network-select>
        </v-flex>
        <v-flex md3>
          <network-select
              network="twitter"
              :selected="editProposal.networks.indexOf('twitter') > -1"
              :profile="profile.twitter_profile"
              v-if="campaign.networks.indexOf('twitter') > -1"
              @toggleNetworkSelect="toggleNetworkSelect">
          </network-select>
        </v-flex>
        <v-flex md3>
          <network-select
              network="youtube"
              :selected="editProposal.networks.indexOf('youtube') > -1"
              :profile="profile.youtube_profile"
              v-if="campaign.networks.indexOf('youtube') > -1"
              @toggleNetworkSelect="toggleNetworkSelect">
          </network-select>
        </v-flex>
        <v-flex md3>
          <network-select
              network="blog"
              :selected="editProposal.networks.indexOf('blog') > -1"
              :profile="profile.blog_profile"
              v-if="campaign.networks.indexOf('blog') > -1"
              @toggleNetworkSelect="toggleNetworkSelect">
          </network-select>
        </v-flex>
      </v-layout>

      <div class="subheading mt-4">Your Pitch</div>

      <quill-editor v-model="editProposal.pitch"
                    ref="myQuillEditor"
                    :options="{ modules: { toolbar: [ ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }, 'blockquote'], ['link'] ] } }"
                    class="white"
      ></quill-editor>

      <v-layout row class="mt-4">
        <v-flex sm13>
          <div class="subheading">Turnaround Time</div>
          <div>Please estimate how long it'll take to complete the work.</div>
        </v-flex>
        <v-flex sm3>
          <v-text-field
              suffix="days"
              v-model="editProposal.turnaround"
              hide-details
              class="pt-0 large"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <!--<v-divider class="mt-1 mb-3"></v-divider>-->

      <v-layout row class="mt-4">
        <v-flex sm13>
          <div class="subheading">Proposal Fee</div>
          <div>Total amount the brand will see on your proposal.</div>
        </v-flex>
        <v-flex sm3>
          <v-text-field
              prefix="$"
              v-model="editProposal.grossFee"
              hide-details
              class="pt-0 large"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <!--<v-divider class="mt-4 mb-3"></v-divider>-->

      <v-layout row class="mt-4" align-center>
        <v-flex sm13>
          <div class="subheading">You'll be paid</div>
          <div>-5% PitchBoard Service Fee <a href="#" class="primary--text">Help</a></div>
        </v-flex>
        <v-flex sm3>
          <div class="title primary--text">
            $ {{ netFee }}
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex style="flex: 0 1 auto">
      <v-btn large dark color="primary" @click="submit">
        <v-icon left>check</v-icon>
        <span v-if="editProposal.id">Edit Proposal</span>
        <span v-else>Submit Proposal</span>
      </v-btn>
      <v-btn flat color="grey" @click="close">
        <v-icon left>close</v-icon>
        Close
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  import NetworkSelect from '../helpers/NetworkSelect'

  export default {
    components: {
      quillEditor, NetworkSelect
    },
    props: [
      'proposal', 'campaign', 'profile'
    ],
    data() {
      return {
        editProposal: {
          id: null,
          pitch: null,
          grossFee: null,
          turnaround: 7,
          networks: []
        }
      }
    },
    computed: {
      netFee: {
        get: function() {
          if (!this.editProposal.grossFee) return null;

          let number = this.editProposal.grossFee * 0.95
          console.log('netfee', number)
          return number ? numeral(number).format('0,00.00') : null
        },
        set: function(newValue) {
          this.proposal.grossFee = newValue / 0.95
        }
      }
    },
    watch: {
      'proposal.id': function () {
        this.handleChange()
      },
      'campaign.id': function () {
        this.handleChange()
      }
    },
    mounted() {
      if (this.proposal.id) {
        this.editProposal.id = this.proposal.id
        this.editProposal.pitch = this.proposal.pitch
        this.editProposal.grossFee = this.proposal.fee_gross
        this.editProposal.turnaround = this.proposal.turnaround_days
        this.editProposal.networks = this.proposal.networks.map(n => {
          return n.network
        })
      } else {
        this.preselectNetworks()
      }
    },
    methods: {
      toggleNetworkSelect(network) {
        if (this.editProposal.networks.indexOf(network) > -1) {
          this.editProposal.networks.splice(this.editProposal.networks.indexOf(network), 1)
        } else {
          this.editProposal.networks.push(network)
        }
      },
      submit() {
        const data = this.editProposal

        if (this.editProposal.id) {
          this.$http.post(`/proposal/${this.proposal.id}`, data).then(result => {
            this.$emit('proposalUpdated', result.data)
            this.$emit('close')

            this.$store.dispatch('alert', {
              'text': 'Your proposal was successfully updated!',
              'color': 'green'
            })
          }).catch(error => {
            this.$store.dispatch('alert', {
              'text': 'Something went wrong while submitting your proposal.',
              'color': 'red'
            })
          })
        } else {
          const data = {...this.editProposal, 'campaign_id': this.campaign.id}

          this.$http.post('/proposal', data).then(result => {
            this.$emit('proposalSent', result.data)
            this.$emit('close')

            this.$store.dispatch('alert', {
              'text': 'Your proposal was submitted!',
              'color': 'green'
            })
          }).catch(error => {
            this.$store.dispatch('alert', {
              'text': 'Something went wrong while submitting your proposal.',
              'color': 'red'
            })
          })

        }

      },
      close() {
        this.$emit('close')
      },
      handleChange() {
        if (this.proposal.id) {
          this.editProposal.id = this.proposal.id
          this.editProposal.pitch = this.proposal.pitch
          this.editProposal.grossFee = this.proposal.fee_gross
          this.editProposal.turnaround = this.proposal.turnaround_days
          this.editProposal.networks = this.proposal.networks.map(n => {return n.network})
        } else {
          this.editProposal.id = null
          this.editProposal.pitch = null
          this.editProposal.grossFee = null
          this.editProposal.turnaround = 7
          this.editProposal.networks = []

          this.preselectNetworks()
        }
      },
      preselectNetworks() {
        if (this.profile.facebook_profile) this.editProposal.networks.push('facebook')
        if (this.profile.instagram_profile) this.editProposal.networks.push('instagram')
        if (this.profile.twitter_profile) this.editProposal.networks.push('twitter')
        if (this.profile.youtube_profile) this.editProposal.networks.push('youtube')
        if (this.profile.blog_profile) this.editProposal.networks.push('blog')
      }
    }
  }
</script>

<style>

</style>