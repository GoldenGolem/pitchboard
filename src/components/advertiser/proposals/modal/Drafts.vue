<template>
  <div v-if="proposal">
    <div class="text-sm-center grey--text text--darken-1 title pa-4" v-if="proposal.approval_status === 0">
      Drafts are currently being created by the influencer.
    </div>

    <div v-else>

      <div>
        <v-tabs dense v-model="currentNetworkId" color="transparent">
          <v-tab v-for="network in proposal.networks" :href="'#' + network.network" :key="network.id">
            <v-icon class="social-color--text mr-2" :class="[ network.network ]">
              fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
            </v-icon>
            <span style="max-width: 120px" class="wrap-ellipsis">
              {{ proposal.influencer[network.network + '_profile'].name || proposal.influencer[network.network + '_profile'].title }}
            </span>
          </v-tab>
          <v-tabs-slider></v-tabs-slider>
        </v-tabs>
      </div>

      <v-card>
        <v-card-text class="pa-4" v-html="currentNetwork.approve_content">
        </v-card-text>
        <div class="pa-3"
             style="border-top: 1px dashed #dddddd; background-color: #eeeeee"
             v-if="['facebook', 'twitter', 'instagram', 'blog'].indexOf(currentNetworkId) > -1">
          <v-container grid-list-sm class="pa-0" v-if="currentNetworkId && networkFiles[currentNetworkId].length > 0">
            <v-layout row wrap>
              <v-flex sm4 v-for="(file, i) in networkFiles[currentNetworkId]" :key="file.id">
                <file-card
                    :id="file.id"
                    :upload="false"
                    :uploading="false"
                    :thumbnail="['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) > -1 ? file.path : false"
                    :previewImage="file.path"
                    :url="file.url"
                    :size="file.size"
                    :name="file.original_file"
                    @download="() => {}"
                    @previewImage="previewImage"
                    >
                </file-card>
              </v-flex>
            </v-layout>
          </v-container>
          <span v-else>
            No files submitted with this content
          </span>
        </div>
        <div class="pa-3"
             style="border-top: 1px dashed #dddddd; background-color: #eeeeee"
             v-if="currentNetworkId === 'youtube'">
          Video Content: <a :href="currentNetwork.approve_details.video_url" target="_blank">{{ currentNetwork.approve_details.video_url }}</a>
        </div>
      </v-card>

      <div class="text-sm-right mt-4">
        <v-btn flat color="grey" @click.native="$emit('sendMessage')" v-if="proposal.approval_status === 1">
          <v-icon left>message</v-icon>
          Ask for changes
        </v-btn>
        <v-menu
            :close-on-content-click="false"
            max-width="300px"
            top
            left
            v-if="proposal.approval_status === 1"
        >
          <v-btn color="primary"  slot="activator">
            <v-icon left>check</v-icon>
            Approve All Drafts
          </v-btn>
          <v-card>
            <v-card-title class="subheading">
              Are you sure you want to approve all drafts?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.native="approveDrafts">Approve</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn flat disabled color="grey" @click.native="$emit('sendMessage')" v-if="proposal.approval_status === 2">
          <v-icon left>check</v-icon>
          Drafts Approved
        </v-btn>
      </div>

      <v-dialog v-model="viewImage" transition="fade" max-width="1200px" content-class="elevation-0 text-sm-center">
        <v-btn flat dark large fab @click.native="viewImage = false" class="btn--close">
          <v-icon>close</v-icon>
        </v-btn>
        <img :src="image" class="elevation-1" :style="{ 'max-height': windowHeight - 30 + 'px' }"
             style="max-width: 1180px; object-fit: contain; border: 1px solid #b4b4b4">
      </v-dialog>

    </div>
  </div>
</template>

<script>
  import FileCard from '../../../helpers/FileCard'

  export default {
    components: {
      FileCard
    },
    props: [
      'proposal', 'campaign'
    ],
    data () {
      return {
        currentNetworkId: null,
        viewImage: false,
        image: null,
        windowHeight: 0
      }
    },
    mounted() {
      this.currentNetworkId = this.proposal.networks[0].network
      this.onResize()
    },
    watch: {
      'proposal.id': function () {
        this.currentNetworkId = this.proposal.networks[0].network
      }
    },
    computed: {
      currentNetwork() {
        if (!this.currentNetworkId) {
          return {
            'status': null
          }
        }

        return this.proposal.networks.find(n => {
          return n.network === this.currentNetworkId
        })
      },
      networkFiles() {
        return {
          'facebook': this.proposal.files.filter(f => {
            return f.network === 'facebook'
          }),
          'instagram': this.proposal.files.filter(f => {
            return f.network === 'instagram'
          }),
          'twitter': this.proposal.files.filter(f => {
            return f.network === 'twitter'
          }),
          'blog': this.proposal.files.filter(f => {
            return f.network === 'blog'
          })
        }
      }
    },
    methods: {
      approveDrafts() {
        this.$http.post(`campaign/${this.proposal.campaign_id}/approve-drafts`, {
          'proposal_id': this.proposal.id
        }).then(result => {
          this.$store.dispatch('alert', {
            'text': 'Drafts were successfully approved! The influencer is now ready to publish the posts.',
            'color': 'green',
            'multiline': true
          })

          let newProposal = {...this.proposal}
          newProposal.approval_status = 2
          newProposal.drafts_accepted_at = moment().format()

          this.$emit('proposalUpdated', newProposal)
        }).catch(error => {
          this.$store.dispatch('alert', {
            'text': 'There was an error approving drafts! Please try again.',
            'color': 'red'
          })
        })
      },
      previewImage(url) {
        this.image = url
        this.viewImage = true
      },
      onResize () {
        this.windowHeight = window.innerHeight
      }
    }
  }
</script>

<style>


</style>