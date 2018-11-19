<template>
  <div>
    <div>

      <!-- READY TO PUBLISH -->
      <div v-if="(proposal.status === 2 && (!campaign.approval || proposal.approval_status === 2)) || proposal.status === 3" class="mb-2">
        <div class="subheading mb-2">
          <strong v-if="proposal.status === 2">READY TO PUBLISH</strong>
          <strong v-else-if="proposal.status === 3">POSTS PUBLISHED</strong>
        </div>
        <div class="subheading grey--text text--darken-1" v-if="proposal.status === 2">
          Publish the content on each channel below and confirm each one.
        </div>
        <v-card class="mt-2">
          <v-list two-line>
            <template v-for="(network, index) in proposal.networks">
              <v-list-tile class="publish-tile">
                <v-list-tile-avatar>
                  <v-icon :class="[
                    {'grey--text': network.status !== 1},
                    {'social-color--text': network.status === 1},
                    network.network
                    ]"
                  >
                    fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
                  </v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ profile[network.network + '_profile'].name || profile[network.network + '_profile'].title }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title v-if="network.status === 1">
                    <a :href="network.post_link" target="_blank" v-if="network.network !== 'youtube'">
                      External link to post
                      <v-icon class="icon--x-small" color="primary">fa fa-external-link</v-icon>
                    </a>
                    <a :href="network.post_link" target="_blank" v-else>
                      External link to video
                      <v-icon class="icon--x-small" color="primary">fa fa-external-link</v-icon>
                    </a>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action v-if="proposal.status === 2">
                  <v-btn color="primary" small v-if="network.status === 0" @click.native="markAsPublished(network)">Mark as Published</v-btn>
                  <span v-else-if="network.status === 1">
                    <span class="primary--text published-label"><v-icon class="icon--small primary--text">check</v-icon> Published</span>
                    <v-btn class="dismiss-button" flat color="red" @click.native="dismissPublishedPost(network)">
                      <v-icon>close</v-icon> Dismiss
                    </v-btn>
                  </span>
                </v-list-tile-action>
                <v-list-tile-action v-else-if="proposal.status === 3">
                  <span class="primary--text"><v-icon class="icon--small primary--text">check</v-icon> Published</span>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="proposal.status === 2 || (proposal.status === 3 && index + 1 < proposal.networks.length)"></v-divider>
            </template>
            <v-list-tile v-if="proposal.status === 2">
              <v-list-tile-content class="grey--text" style="font-size: 12px;">
                Once all pieces of content are published, mark the job as completed.
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn color="primary" :disabled="!canSubmitPublished" @click.native="submitAllPublished" :loading="submitAllPublishedLoading">
                  <v-icon left>check</v-icon> Job Completed
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </div>

      <!-- SUBMIT DRAFTS / VIEW APPROVED CONTENT -->
      <div v-if="campaign.approval && [1, 2].indexOf(proposal.status) > -1" :class="{ 'mt-5': proposal.status === 2 }">
        <div class="subheading mb-2">
          <transition name="fade-transition">
            <!--<strong v-if="proposal.status === 3">POSTS PUBLISHED</strong>-->
            <strong v-if="proposal.approval_status === 0">SUBMIT POSTS FOR APPROVAL</strong>
            <strong v-else-if="proposal.approval_status === 1">WAITING FOR APPROVAL</strong>
            <strong v-else-if="proposal.approval_status === 2">APPROVED CONTENT</strong>
          </transition>
        </div>

        <div v-if="proposal.status === 2">
          <div class="subheading grey--text text--darken-1" v-if="proposal.approval_status === 0">
            Once you create a post for each channel, submit all posts for approval to the brand.
          </div>
          <div class="subheading grey--text text--darken-1" v-if="proposal.approval_status === 1">
            Please wait while the brand reviews your posts
          </div>
        </div>
        <v-tabs condensed color="transparent" :grow="false" v-model="currentNetworkId" v-if="campaign.approval">
          <v-tab v-for="network in proposal.networks" :href="'#' + network.network" :key="network.id">
            <v-icon :class="[
              {'grey--text': !networkFilled(network)},
              {'social-color--text': networkFilled(network)},
              network.network
              ]"
              class="mr-2"
            >
              fa-{{ network.network !== 'blog' ? network.network : 'rss' }}
            </v-icon>
            <span class="grey--text" v-if="!networkFilled(network)">Pending</span>
            <span class="social-color--text" :class="[ network.network ]" v-else-if="proposal.approval_status === 1">Submitted</span>
            <!--<span class="social-color&#45;&#45;text" :class="[ network.network ]" v-else-if="proposal.approval_status === 2">Ready</span>-->
            <span class="social-color--text" :class="[ network.network ]" v-else>Ready</span>
          </v-tab>
          <v-tabs-slider></v-tabs-slider>
        </v-tabs>
        <v-card v-if="campaign.approval">
          <v-card-text class="pa-0">
            <quill-editor v-model="content[currentNetworkId].approve_content"
                          ref="editor"
                          :options="editorOptions"
                          :disabled="proposal.approval_status > 0 && !editMode"
                          class="white no-border"
                          v-if="currentNetworkId && networks[currentNetworkId]"
            ></quill-editor>
            <dropzone :upload="proposal.approval_status === 0"
                      :proposal="proposal"
                      :network="currentNetworkId"
                      :uploadedFiles="networkFiles[currentNetworkId]"
                      @fileUploaded="addFile"
                      @fileRemoved="removeFile"
                      v-if="['facebook', 'twitter', 'instagram', 'blog'].indexOf(currentNetworkId) > -1"
            ></dropzone>
            <v-text-field
                solo
                hide-details
                placeholder="Add the URL to your private video"
                v-if="currentNetworkId === 'youtube'"
                class="elevation-0"
                v-model="content.youtube.approve_details.video_url"
                :readonly="proposal.approval_status > 0 && !editMode"
                style="border-top: 1px solid #d8d8d8; border-bottom: 1px solid #d8d8d8"
            >
            </v-text-field>
          </v-card-text>
          <v-card-actions class="pa-2" v-if="proposal.status === 2 && proposal.approval_status === 0">
            <v-btn small flat color="primary" :disabled="!canSubmitApprove" @click="submitApproval"><v-icon left>check</v-icon> Submit All</v-btn>
            <v-spacer></v-spacer>
            <v-btn small flat @click="saveDraft" :loading="saving"><v-icon left v-if="saved">check</v-icon> <span v-if="!saved">Save as Draft</span><span v-else>Saved!</span> </v-btn>
            <v-btn small flat @click="nextApprovalPost">Next</v-btn>
          </v-card-actions>
          <v-card-actions class="pa-2" v-if="proposal.status === 2 && proposal.approval_status === 1">
            <v-chip color="primary" outline v-if="!editMode">
              <v-avatar>
                <v-icon color="primary">check</v-icon>
              </v-avatar> Submitted to the brand
            </v-chip>
            <v-btn small flat color="primary" :disabled="!canSubmitApprove" @click="submitApproval" v-if="editMode"><v-icon left>check</v-icon> Submit All</v-btn>
            <v-spacer></v-spacer>
            <v-btn small flat @click="editMode = true" v-if="!editMode">Edit</v-btn>
            <v-btn small flat @click="editMode = false; fillEditDrafts()" v-if="editMode">Cancel editing</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <v-dialog v-model="publishPostsModal" width="500px" content-class="white" persistent>
      <!--FACEBOOK, INSTAGRAM AND TWITTER -->
      <v-card color="white" v-if="['facebook', 'instagram', 'twitter'].indexOf(currentNetworkId) > -1">
        <div class="headline text-xs-center mt-4 mb-1">Select the relevant content</div>
        <div class="pa-3" v-if="publishPosts.length === 0">
          <v-card  color="red">
            <v-card-text class="white--text" flat>
              There is no published content! Please publish the content on the channel and then head back here to mark it as published.
            </v-card-text>
          </v-card>
        </div>
        <v-list two-line raised class="">
          <template v-for="post, index in publishPosts">
            <v-list-tile v-bind:key="index" v-if="['facebook', 'twitter'].indexOf(currentNetworkId) > -1" @click="selectPost(post)">
              <v-list-tile-content>
                <v-list-tile-title v-if="post.post">{{ post.post }}</v-list-tile-title>
                <v-list-tile-title v-else class="grey--text">Empty post</v-list-tile-title>
                <v-list-tile-sub-title>
                  <a :href="post.link" target="_blank">Link</a> &middot;
                  {{ moment(post.created_at).format('ll') }} &middot;
                  <span v-if="currentNetworkId === 'facebook'">
                    {{ post.stats.likes }} likes &middot;
                    {{ post.stats.shares }} shares &middot;
                    {{ post.stats.comments }} comments
                  </span>
                  <span v-if="currentNetworkId === 'twitter'">
                    {{ post.stats.retweets }} retweets &middot;
                    {{ post.stats.favorites }} favorites
                  </span>
                </v-list-tile-sub-title>

              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="green" v-if="selectedPost && selectedPost.id === post.id">check</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile v-bind:key="index" v-if="currentNetworkId === 'instagram'" @click="selectPost(post)">
              <v-list-tile-avatar>
                <img :src="post.image" v-if="post.image">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-if="post.post">{{ post.post }}</v-list-tile-title>
                <v-list-tile-title v-else class="grey--text">Empty post</v-list-tile-title>
                <v-list-tile-sub-title>
                  <a :href="post.link" target="_blank">Link</a> &middot;
                  {{ moment(post.created_at).format('ll') }} &middot;
                  {{ post.stats.likes }} likes &middot;
                  {{ post.stats.comments }} comments</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="green" v-if="selectedPost && selectedPost.id === post.id">check</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index !== (publishPosts.length - 1)"></v-divider>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" flat @click.native="publishPostsModal = false; selectedPost = null">Cancel</v-btn>
            <v-btn color="primary" @click.native="submitPublishedPost" :disabled="!selectedPost" :loading="submitPublishedLoading">Submit as published</v-btn>
          </v-card-actions>
        </v-list>
      </v-card>
      <!--YOUTUBE-->
      <v-card color="white" v-else-if="currentNetworkId === 'youtube'">
        <div class="headline text-xs-center mt-4 mb-1">Select the relevant video</div>
        <div class="pa-3" v-if="publishPosts.length === 0">
          <v-card color="red">
            <v-card-text class="white--text" flat>
              There are no published videos! Please publish a public video and head back here.
            </v-card-text>
          </v-card>
        </div>
        <v-list two-line raised class="">
          <template v-for="post, index in publishPosts">
            <v-list-tile v-bind:key="index" @click="selectPost(post)">
              <v-list-tile-avatar tile>
                <img :src="post.thumbnail" v-if="post.thumbnail">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-if="post.title">{{ post.title }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  <a :href="post.link" target="_blank">Link</a> &middot;
                  {{ moment(post.created_at).format('ll') }} &middot;
                  {{ post.description }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="green" v-if="selectedPost && selectedPost.id === post.id">check</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index !== (publishPosts.length - 1)"></v-divider>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" flat @click.native="publishPostsModal = false; selectedPost = null">Cancel</v-btn>
            <v-btn color="primary" @click.native="submitPublishedPost" :disabled="!selectedPost" :loading="submitPublishedLoading">Submit as published</v-btn>
          </v-card-actions>
        </v-list>
      </v-card>
      <!--BLOG -->
      <v-card color="white" v-else-if="currentNetworkId === 'blog'">
        <form @submit.prevent="submitBlogLink">
          <div class="headline text-xs-center mt-4 mb-1">Enter the URL of your published post</div>
          <v-text-field
              solo
              placeholder="e.g. http://pitchboard.co/my-post"
              class="elevation-1 mt-3"
              :class="{ 'solo-error': errors.has('blog--post_link') }"
              v-validate="'required|url'"
              data-vv-name="blog--post_link"
              data-vv-as="Post URL"
              :error="errors.has('blog--post_link')"
              v-model="content.blog.post_link"
          ></v-text-field>
          <div class="error--text pl-2 pt-2 pr-2" v-if="errors.has('blog--post_link')">{{ errors.first('blog--post_link') }}</div>
          <v-card-actions class="mt-2">
            <v-spacer></v-spacer>
            <v-btn color="grey" flat @click.native="publishPostsModal = false; selectedPost = null">Cancel</v-btn>
            <v-btn color="primary" type="submit" :loading="submitPublishedLoading">Mark as published</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'
  import Dropzone from '../helpers/Dropzone'

  export default {
    components: {
      quillEditor,
      Dropzone
    },
    props: [
      'campaign', 'proposal', 'profile'
    ],
    data() {
      return {
        content: {
          facebook: {
            approve_content: null
          },
          instagram: {
            approve_content: null
          },
          twitter: {
            approve_content: null
          },
          youtube: {
            approve_content: null,
            approve_details: {
              video_url: null
            }
          },
          blog: {
            approve_content: null,
            post_link: null
          },
        },
        allFiles: [],
        editMode: false,
        currentNetworkId: null,
        approveContent: null,
        saving: false,
        saved: false,
        submitting: false,
        markPublishedLoading: false,
        publishPostsModal: false,
        publishPosts: [],
        selectedPost: null,
        submitPublishedLoading: false,
        submitAllPublishedLoading: false,
        moment: moment
      }
    },
    computed: {
      networks() {
        if (!this.proposal.networks) return []

        return {
          'facebook': this.proposal.networks.find(n => {
            return n.network === 'facebook'
          }),
          'instagram': this.proposal.networks.find(n => {
            return n.network === 'instagram'
          }),
          'twitter': this.proposal.networks.find(n => {
            return n.network === 'twitter'
          }),
          'youtube': this.proposal.networks.find(n => {
            return n.network === 'youtube'
          }),
          'blog': this.proposal.networks.find(n => {
            return n.network === 'blog'
          })
        }
      },
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
      hint() {
        if (this.currentNetworkId === 'facebook') return "Add the Facebook post"
        if (this.currentNetworkId === 'instagram') return "Add the Instagram post"
        if (this.currentNetworkId === 'twitter') return "Add the Twitter status"
        if (this.currentNetworkId === 'youtube') return "Add the Youtube description and video"
        if (this.currentNetworkId === 'blog') return "Add the blog post"

        return null
      },
      editorOptions() {
        return {
          modules: {
            toolbar: true,
            keyboard: {
              bindings: {
                bold: {
                  handler: function () { }
                },
                italic: {
                  handler: function () { }
                },
                underline: {
                  handler: function () { }
                },
                'indent': {
                  handler: function () { }
                }
              }
            }
          },
          placeholder: this.hint
        }
      },
      canSubmitApprove() {
        for (let network of this.proposal.networks) {
          if (!this.networkFilled(network)) return false
        }

        return true
      },
      canSubmitPublished() {
        if (this.proposal.status !== 2) return false

        for (let network of this.proposal.networks) {
          if (network.status !== 1) return false
        }

        return true
      },
      networkFiles() {
        return {
          'facebook': this.allFiles.filter(f => {
            return f.network === 'facebook'
          }),
          'instagram': this.allFiles.filter(f => {
            return f.network === 'instagram'
          }),
          'twitter': this.allFiles.filter(f => {
            return f.network === 'twitter'
          }),
          'blog': this.allFiles.filter(f => {
            return f.network === 'blog'
          })
        }
      }
    },
    watch: {
      'proposal.id': function () {
        this.currentNetworkId = this.proposal.networks[0].network
        this.fillEditDrafts()
        this.allFiles = this.proposal.files
      },
      hint: function () {
        if (!this.$refs.editor) return

        this.$refs.editor.quill.root.setAttribute('data-placeholder', this.hint);
      },
      currentNetworkId: function () {
//        if (this.currentNetworkId === 'youtube') {
//          if (!this.networks.youtube.approve_details) {
//            this.networks.youtube.approve_details = {
//              'video_url': null
//            }
//          }
//        }

        setTimeout(() => {
          if (!this.$refs.editor) return

          if (this.currentNetworkId === 'blog') {
            this.$refs.editor.quill.container.parentElement.getElementsByClassName("ql-toolbar")[0].classList.remove('hidden')
            this.$refs.editor.quill.container.classList.add('big')
          } else {
            this.$refs.editor.quill.container.parentElement.getElementsByClassName("ql-toolbar")[0].classList.add('hidden')
            this.$refs.editor.quill.container.classList.remove('big')
          }
        })
      }
    },
    mounted() {
      this.currentNetworkId = this.proposal.networks[0].network
      this.allFiles = this.proposal.files
      this.fillEditDrafts()
    },
    methods: {
      fillEditDrafts() {
        for (let network of this.proposal.networks) {
          this.content[network.network].approve_content = network.approve_content

          if (network.network === 'youtube') {
            this.content.youtube.approve_details = {
              video_url: null
            }

            if (network.approve_details) this.content[network.network].approve_details = network.approve_details
          }
        }
      },
      nextApprovalPost() {
        let index = this.proposal.networks.findIndex(n => {return n.network === this.currentNetworkId})

        if (this.proposal.networks[index + 1]) {
          this.currentNetworkId = this.proposal.networks[index + 1].network
        }
      },
      saveDraft() {
        let promises = []

        this.saving = true

        let newProposal = {...this.proposal}

        for (let network of newProposal.networks) {
          promises.push(this.$http.post(`proposal/${this.proposal.id}/network/${network.id}/save`, {
            'approve_content': this.content[network.network].approve_content,
            'approve_details': this.content[network.network].approve_details
          }))
          network.approve_content = this.content[network.network].approve_content
          network.approve_details = this.content[network.network].approve_details
        }

        this.$emit('proposalUpdated', newProposal)

        return Promise.all(promises).then(() => {
          this.saving = false
          this.saved = true
          setTimeout(() => {
            this.saved = false
          }, 5000)

          return Promise.resolve()
        }).catch(error => {
          this.saving = false
          return Promise.reject()
        })
      },
      submitApproval() {
        this.saveDraft().then(() => {
          this.$http.get(`proposal/${this.proposal.id}/ask-approve`).then(result => {
            this.$store.dispatch('alert', {
              'text': 'Drafts were submitted to the brand',
              'color': 'green'
            })

            this.editMode = false
            this.$emit('proposalUpdated', result.data)
          })
        })
      },
      markAsPublished(network) {
        this.currentNetworkId = network.network

        if (this.currentNetworkId === 'blog') {
          this.publishPostsModal = true
          return
        }

        this.markPublishedLoading = true

        this.$http.post(`social/recent-posts`, {
          'proposal_network_id': network.id
        }).then(result => {
          this.publishPosts = result.data
          this.markPublishedLoading = false
          this.publishPostsModal = true
        }).catch(error => {
          this.markPublishedLoading = false
        })
      },
      selectPost(post) {
        this.selectedPost = post
      },
      submitPublishedPost() {
        this.submitPublishedLoading = true

        this.$http.post(`proposal/${this.proposal.id}/network/${this.currentNetwork.id}/published`, {
          'post': this.selectedPost
        }).then(result => {
          let index = this.proposal.networks.findIndex(n => {return n.id === result.data.network.id})

          this.proposal.networks.splice(index, 1, result.data.network)
          this.submitPublishedLoading = false
          this.publishPostsModal = false

          if (result.data.proposal.status !== 2) {
            this.$store.dispatch('alert', {
              'text': 'Great work, you\'ve published all of the content! The brand has been notified and your payment will be queued for processing.',
              'color': 'green'
            })

            this.$emit('proposalPublished', result.data.proposal)
          }
        }).catch(error => {
          this.submitPublishedLoading = false
          this.publishPostsModal = false
        })
      },
      dismissPublishedPost(network) {
        this.$http.post(`proposal/${this.proposal.id}/network/${network.id}/dismiss-published`).then(result => {
          let index = this.proposal.networks.findIndex(n => {return n.id === result.data.network.id})

          this.proposal.networks.splice(index, 1, result.data.network)
        })
      },
      submitBlogLink() {
        this.$validator.validate('blog--post_link').then((result) => {
          console.log('validation result', result)

          if (!result) return

          this.$http.post(`proposal/${this.proposal.id}/network/${this.currentNetwork.id}/published`, {
            'post_link': this.content.blog.post_link
          }).then(result => {
            let index = this.proposal.networks.findIndex(n => {return n.id === result.data.network.id})

            this.proposal.networks.splice(index, 1, result.data.network)
            this.submitPublishedLoading = false
            this.publishPostsModal = false
            this.content.blog.post_link = null

            if (result.data.proposal.status !== 2) {
              this.$emit('proposalPublished', result.data.proposal)
            }
          }).catch(error => {
            this.submitPublishedLoading = false
            this.publishPostsModal = false
          })
        })
      },
      submitAllPublished() {
        this.submitAllPublishedLoading = true

        this.$http.post(`proposal/${this.proposal.id}/published`).then(result => {
          this.submitAllPublishedLoading = false

          if (result.data.proposal.status !== 2) {
            this.$store.dispatch('alert', {
              'text': 'Congratulations, you\'ve published all posts! Brand was notified.',
              'color': 'green',
              'multiline': true
            })

            this.$emit('proposalPublished', result.data.proposal)
          }
        }).catch(error => {
          this.submitAllPublishedLoading = false
        })
      },
      networkFilled(network) {
        if (this.proposal.approval_status === 2) return true

        if (['facebook', 'twitter', 'blog'].indexOf(network.network) > -1) return this.content[network.network].approve_content
        if (network.network === 'instagram') return this.content[network.network].approve_content || this.networkFiles[network.network].length
        if (network.network === 'youtube') return this.content.youtube.approve_content && this.content.youtube.approve_details.video_url
      },
      addFile(file) {
        this.allFiles.push(file)
      },
      removeFile(fileName) {
//        this.campaign.files.splice(this.campaign.files.findIndex(f => {return f.name === fileName}), 1)
      }
    }
  }
</script>

<style>

  .quill-editor.no-border .ql-container.ql-snow {
    border: none !important;
  }

  .quill-editor.no-border .ql-toolbar.ql-snow {
    border: none !important;
    border-bottom: 1px solid #d8d8d8 !important;
  }

  .quill-editor .ql-container.big {
    height: 300px !important;
  }

  .quill-editor .ql-toolbar.hidden {
    display: none !important;
  }

  .solo-error {
    border-bottom: 1px solid #FF5252 !important;
  }

  .publish-tile .dismiss-button {
    display: none;
  }
  .publish-tile:hover .published-label {
    display: none;
  }
  .publish-tile:hover .dismiss-button {
    display: inline-block;
  }

</style>