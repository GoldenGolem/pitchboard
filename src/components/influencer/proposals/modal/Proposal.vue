<template>
  <div>
    <v-layout row align-center justify-center class="mb-2">
      <v-flex sm9>
        <h4 class="subheading"><strong>YOUR PITCH</strong></h4>
      </v-flex>
      <v-flex sm7 class="text-xs-right">
        <span>{{ proposal.created_at | moment("from") }}</span>
        <v-chip color="primary" class="white--text ma-0">
          <strong>{{ proposal.fee_gross | currency }}</strong>
        </v-chip>
        <v-btn small round flat @click.native="$emit('editProposal')" v-if="proposalStatus === 'pending'">
          <v-icon left class="icon--small">edit</v-icon>
          Edit
        </v-btn>
      </v-flex>
    </v-layout>

    <v-card>
      <v-card-text v-html="proposal.pitch"></v-card-text>
    </v-card>

    <h4 class="subheading mt-5 mb-2"><strong>CHANNELS TO PUBLISH ON</strong></h4>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex sm1>
            <network-select
                network="facebook"
                :selected="networks.facebook != null"
                :profile="profile.facebook_profile"
                :selectable="false"
                :label="false"
            ></network-select>
          </v-flex>
          <v-flex sm1 class="ml-3">
            <network-select
                network="instagram"
                :selected="networks.instagram != null"
                :profile="profile.instagram_profile"
                :selectable="false"
                :label="false"
            ></network-select>
          </v-flex>
          <v-flex sm1 class="ml-3">
            <network-select
                network="twitter"
                :selected="networks.twitter != null"
                :profile="profile.twitter_profile"
                :selectable="false"
                :label="false"
            ></network-select>
          </v-flex>
          <v-flex sm1 class="ml-3">
            <network-select
                network="youtube"
                :selected="networks.youtube != null"
                :profile="profile.youtube_profile"
                :selectable="false"
                :label="false"
            ></network-select>
          </v-flex>
          <v-flex sm1 class="ml-3">
            <network-select
                network="blog"
                :selected="networks.blog != null"
                :profile="profile.blog_profile"
                :selectable="false"
                :label="false"
            ></network-select>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>


  </div>
</template>

<script>
  import NetworkSelect from '../helpers/NetworkSelect'

  export default {
    components: {
      NetworkSelect
    },
    props: [
      'proposal', 'profile'
    ],
    data () {
      return {
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
    },
    methods: {
      sendProposal() {
        this.$emit('sendProposal')
      }
    }
  }
</script>

<style>


</style>