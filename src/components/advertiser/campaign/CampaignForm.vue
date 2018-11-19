<template>
  <div>
    <div>
      <v-layout row justify-center>
        <v-flex md12>
          <v-stepper v-model="step" class="flat">
            <v-stepper-header>
              <v-stepper-step step="1"
                              :complete="finishedSteps.indexOf('1') > -1 && errors.all('step1').length === 0"
                              :editable="finishedSteps.indexOf('1') > -1"
                              :rules="[ () => {return errors.all('step1').length === 0} ]">
                Overview
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2"
                              :complete="finishedSteps.indexOf('2') > -1 && errors.all('step2').length === 0"
                              :editable="finishedSteps.indexOf('1') > -1"
                              :rules="[ () => {return errors.all('step2').length === 0} ]">
                Settings
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3"
                              :complete="finishedSteps.indexOf('3') > -1 && errors.all('step3').length === 0"
                              :editable="finishedSteps.indexOf('2') > -1"
                              :rules="[ () => {return errors.all('step3').length === 0} ]">
                Targeting
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>

          <v-tabs-items v-model="step" style="overflow: visible">
            <!--STEP 1-->
            <v-tab-item id="1" transition="fade" reverse-transition="fade">
              <v-card class="mb-3 elevation-1">
                <v-card-title primaryTitle class="subheading pa-4">
                  <span class="mr-2"><strong>Overview</strong></span>
                  <span>&middot;</span>
                  <span class="ml-2 grey--text">Get started here. Your campaign brief will be sent to relevant influencers.</span>
                </v-card-title>
                <v-card-text class="pl-5 pr-5 pb-5">
                  <v-layout align-center justify-center row>
                    <v-flex sm12>
                      <croppa
                          v-model="croppa"
                          name="image"
                          accept="image/png,image/jpeg"
                          initial-position="center"
                          :prevent-white-space="true"
                          placeholder="Please select the campaign image"
                          placeholder-color="#b5b5b5"
                          :width="580"
                          :height="330"
                          :quality="1.5"
                          :show-loading="false"
                          :show-remove-button="false"
                          :disabled="campaign.image_uploaded"
                          :placeholder-font-size="14"
                          :initial-image="campaign.image_url"
                          :class="{ 'error': errors.has('image', 'step1') }"
                          @new-image-drawn="onNewImage"
                          @zoom="onZoom">
                        <div style="position: absolute; left: 5px; bottom: 5px;">
                          <v-btn small color="primary"
                                 :loading="savingImage"
                                 v-if="croppa.imageSet && !campaign.image_uploaded" @click.native="uploadImage">
                            <v-icon left class="icon--small">check</v-icon> Done
                          </v-btn>
                          <v-btn icon small color="primary" v-else-if="campaign.image_uploaded" @click.native="campaign.image_uploaded = false">
                            <v-icon small>edit</v-icon>
                          </v-btn>
                          <v-btn icon small @click.native="() => {croppa.remove(); campaign.image_url = null; campaign.image_uploaded = false}" v-if="croppa.imageSet">
                            <v-icon color="red">close</v-icon>
                          </v-btn>
                        </div>
                        <div
                            style="position: absolute; width: 250px; height: 32px; right: 5px; bottom: 5px; background: #fff; border-radius: 5px"
                            class="elevation-1"
                            v-if="croppa.imageSet && !campaign.image_uploaded"
                        >
                          <vue-slider
                              v-model="croppa.scaleRatio"
                              style="margin-top: 5px"
                              :interval="0.1"
                              :min="zoomMin"
                              :max="zoomMax"
                              :formatter="(v) => {return v.toFixed(2) + 'x'}">
                          </vue-slider>
                        </div>
                        <img crossorigin="anonymous" :src="campaign.image_url"
                             slot="initial">
                      </croppa>
                      <div class="caption error--text" v-if="errors.has('image', 'step1')">
                          {{ errors.first('image', 'step1') }}
                      </div>
                      <v-text-field
                          light
                          v-model="campaign.main_url"
                          name="main_url"
                          label="Enter your main URL"
                          hint="This is the link to the individual product, page or brand you want influencers to promote. We convert this into a tracking link to track clicks from each influencer you hire. Leave blank if no link is required."
                          data-vv-as="Main URL"
                          data-vv-scope="step1"
                          v-validate="'required|url'"
                          class="mt-4"
                          :disabled="!!campaign.id"
                          :error-messages="errors.collect('main_url')"
                      ></v-text-field>
                      <v-text-field
                          v-model="campaign.brand"
                          label="Brand or Company Name"
                          v-validate="'required'"
                          data-vv-name="brand"
                          data-vv-scope="step1"
                          :error-messages="errors.collect('brand')"
                      ></v-text-field>
                      <v-text-field
                          v-model="campaign.title"
                          label="Campaign Title"
                          hint="Titles should be short and informative. Do not include your brand name."
                          v-validate="'required'"
                          data-vv-name="title"
                          data-vv-scope="step1"
                          :error-messages="errors.collect('title')"
                      ></v-text-field>
                      <v-text-field
                          v-model="campaign.overview"
                          label="Campaign Summary"
                          hint="Use this space to summarise what you are looking for and what makes you awesome."
                          v-validate="'required'"
                          data-vv-name="summary"
                          data-vv-scope="step1"
                          :counter="200"
                          :error-messages="errors.collect('summary')"
                          multi-line
                      ></v-text-field>

                      <p class="subheading mb-0 mt-4"
                         :class="{ 'error--text': $validator.errors.has('brief', 'step1') }">Detailed Brief</p>
                      <div class="error--text caption" v-if="errors.has('brief', 'step1')">
                        Please enter the detailed brief
                      </div>
                      <quill-editor v-model="campaign.description"
                                    ref="briefEditor"
                                    :class="{ 'error--text': errors.has('brief', 'step1') }"
                                    v-validate="'required'"
                                    data-vv-name="brief"
                                    data-vv-scope="step1"
                                    :options="{ modules: { toolbar: [ ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }, 'blockquote'], ['link'] ] } }"
                      ></quill-editor>
                      <dropzone
                          :upload="true"
                          class="mb-5"
                          :initialFiles="campaign.initialFiles"
                          @fileUploaded="addFile"
                          @fileRemoved="removeFile"
                      ></dropzone>

                      <v-layout row class="mt-5">
                        <v-flex sm8>
                          <v-btn class="darken-1 mr-2 grey--text text--darken-2" :loading="saveDraftLoading"
                                 @click.native.stop="reviewCampaign(false)" v-if="campaign.id">
                            <v-icon left>save</v-icon>
                            Save
                          </v-btn>
                          <v-btn class="purple darken-1 white--text" :loading="startCampaignLoading"
                                 @click.native.stop="reviewCampaign(true)" v-if="campaign.id && campaign.status === 0">
                            <v-icon left>fa-play-circle-o</v-icon>
                            Save & Start
                          </v-btn>
                        </v-flex>
                        <v-flex sm8 class="text-sm-right">
                          <v-btn @click.native="finishStep(1)">
                            Continue to settings
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!--STEP 2-->
            <v-tab-item id="2" transition="fade" reverse-transition="fade">
              <v-card raised class="mb-3">
                <v-card-title primaryTitle class="subheading pa-4">
                  <span class="mr-2"><strong>Settings</strong></span>
                  <span>&middot;</span>
                  <span class="ml-2 grey--text">Configure the tracking and approvals for your campaign</span>
                </v-card-title>
                <v-card-text class="pl-5 pr-5 pb-5">
                  <v-layout align-center justify-center row>
                    <v-flex sm12>
                      <p class="subheading mb-0">
                        Would you like to append Google Analytics tracking parameters to your URL?</p>
                      <v-radio-group v-model="campaign.link_type" row class="flex sm5 mt-0 pt-2"
                                     hide-details :error="errors.has('tracking_links', 'step2')"
                                     data-vv-name="tracking_links" data-vv-scope="step2">
                        <v-radio label="Yes" :value="1"></v-radio>
                        <v-radio label="No" :value="0"></v-radio>
                      </v-radio-group>

                      <transition name="fade-transition">
                        <v-layout class="mt-5 mb-2" v-if="campaign.link_type === 1"
                                  justify-space-between>
                          <v-flex sm5>
                            <v-text-field
                                v-model="campaign.ga_source"
                                label="GA Source"
                                placeholder="pitchboard"
                                hide-details
                            ></v-text-field>
                          </v-flex>
                          <v-flex sm5>
                            <v-text-field
                                v-model="campaign.ga_medium"
                                label="GA Medium"
                                placeholder="influencers"
                                hide-details
                            ></v-text-field>
                          </v-flex>
                          <v-flex sm5>
                            <v-text-field
                                label="GA Campaign Name"
                                value="[site name]"
                                hint="Automatically appended with the site name"
                                disabled
                                hide-details
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </transition>

                      <p class="subheading mb-0 mt-5">Would you like to approve content before its published?</p>
                      <v-radio-group v-model="campaign.approval" row class="flex sm5 mt-0 pt-2" hide-details>
                        <v-radio label="Yes" :value="true" hint="Approve"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>

                      <v-layout row wrap class="mt-5 mb-2">
                        <v-flex sm14 align-center>
                          <p class="subheading mb-0">Key Requirements</p>
                          <p class="mb-0 grey--text">Use this to list any specific conditions for your campaign</p>
                        </v-flex>
                        <v-flex sm2>
                          <v-btn block small flat @click.native="campaign.conditions.push('')">
                            <v-icon>add</v-icon>
                            Add
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <div v-for="condition,index in campaign.conditions">
                        <v-text-field
                            v-model="campaign.conditions[index]"
                            class="pt-0 mb-2"
                            :placeholder="index === 0 ? 'e.g. A clickable URL must be included in all posts (where possible)' : ''"
                            :append-icon="index !== 0 ? 'clear' : ''"
                            :append-icon-cb="() => (campaign.conditions.splice(index, 1))"
                            hide-details
                        ></v-text-field>
                      </div>

                      <p class="subheading mb-0 mt-5">Total Campaign Budget</p>
                      <p class="mb-1 grey--text">Please specify your <strong>total</strong>
                        campaign budget (not per influencer)</p>
                      <v-text-field
                          v-model="campaign.budget"
                          prefix="$"
                          v-validate="'required|numeric'"
                          data-vv-scope="step2"
                          hint="This info is to help keep track of your budget and is not shared with influencers."
                          data-vv-name="budget"
                          class="pt-0"
                          :error-messages="errors.collect('budget')"
                      ></v-text-field>

                      <p class="subheading mb-0 mt-5">Per Influencer Budget</p>
                      <p class="mb-1 grey--text">The price range you are looking to pay for each influencer collaboration</p>
                      <v-select
                          :items="contentBudget"
                          v-model="campaign.content_budget"
                          autocomplete
                          item-text="text"
                          item-value="budget"
                          placeholder="Doesn't matter"
                      ></v-select>

                      <v-layout row class="mt-5">
                        <v-flex sm8>
                          <v-btn class="darken-1 mr-2 grey--text text--darken-2" :loading="saveDraftLoading"
                                 @click.native.stop="reviewCampaign(false)" v-if="campaign.id">
                            <v-icon left>save</v-icon>
                            Save
                          </v-btn>
                          <v-btn class="purple darken-1 white--text" :loading="startCampaignLoading"
                                 @click.native.stop="reviewCampaign(true)" v-if="campaign.id && campaign.status === 0">
                            <v-icon left>fa-play-circle-o</v-icon>
                            Save & Start
                          </v-btn>
                        </v-flex>
                        <v-flex sm8 class="text-sm-right">
                          <v-btn @click.native="finishStep(2)">
                            Continue to targeting
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!--STEP 3-->
            <v-tab-item id="3" transition="fade" reverse-transition="fade">
              <v-card raised class="mb-3">
                <v-card-title primaryTitle class="subheading pa-4">
                  <span class="mr-2"><strong>Targeting</strong></span>
                  <span>&middot;</span>
                  <span class="ml-2 grey--text">Tell us about your target audience to receive relevant proposals</span>
                </v-card-title>
                <transition>
                  <v-card-text class="pl-5 pr-5 pb-5">
                    <v-layout align-center justify-center row>
                      <v-flex sm12>

                        <input v-validate:campaign.networks="'required'" type="text" name="networks"
                               data-vv-scope="step3">

                        <p class="subheading mb-0" :class="{ 'error--text': errors.has('networks', 'step3') }">
                          Channels</p>
                        <p class="mb-1 grey--text">Specify which channels you would like to be promoted on</p>

                        <v-layout align-center justify-space-around class="mt-3">
                          <v-flex md3>
                            <network-select
                                network="facebook"
                                :selected="campaign.networks.indexOf('facebook') > -1"
                                @toggleNetworkSelect="toggleNetworkSelect">
                            </network-select>
                          </v-flex>
                          <v-flex md3>
                            <network-select
                                network="instagram"
                                data-vv-name="networks"
                                data-vv-value-path="network"
                                :selected="campaign.networks.indexOf('instagram') > -1"
                                @toggleNetworkSelect="toggleNetworkSelect">
                            </network-select>
                          </v-flex>
                          <v-flex md3>
                            <network-select
                                network="twitter"
                                data-vv-name="networks"
                                data-vv-value-path="network"
                                :selected="campaign.networks.indexOf('twitter') > -1"
                                @toggleNetworkSelect="toggleNetworkSelect">
                            </network-select>
                          </v-flex>
                          <v-flex md3>
                            <network-select
                                network="youtube"
                                data-vv-name="networks"
                                data-vv-value-path="network"
                                :selected="campaign.networks.indexOf('youtube') > -1"
                                @toggleNetworkSelect="toggleNetworkSelect">
                            </network-select>
                          </v-flex>
                          <v-flex md3>
                            <network-select
                                network="blog"
                                data-vv-name="networks"
                                data-vv-value-path="network"
                                :selected="campaign.networks.indexOf('blog') > -1"
                                @toggleNetworkSelect="toggleNetworkSelect">
                            </network-select>
                          </v-flex>
                        </v-layout>
                        <div class="caption error--text" v-if="errors.has('networks', 'step3')">
                          {{ errors.first('networks', 'step3') }}
                        </div>

                        <p class="subheading mb-0 mt-5" :class="{ 'error--text': errors.has('categories', 'step3') }">
                          Audience Interests</p>
                        <p class="mb-1 grey--text">Select up to 3 main categories to narrow down your audience</p>

                        <v-container grid class="pa-0 mt-3">
                          <select-categories :categories="categories" :selected="campaign.categories"
                                             @categorySelected="categorySelected"></select-categories>
                        </v-container>
                        <div class="caption error--text" v-if="errors.has('categories', 'step3')">
                          {{ errors.first('categories', 'step3') }}
                        </div>

                        <p class="subheading mb-0 mt-5">Audience Demographics</p>

                        <v-select
                            label="Select Countries"
                            :items="geos"
                            v-model="campaign.geos"
                            multiple
                            autocomplete
                            item-text="name"
                            item-value="id"
                            persistent-hint
                            deletable-chips
                            clearable
                        ></v-select>

                        <v-layout row justify-center align-center>
                          <v-flex sm8>
                            <v-select
                                :items="ages"
                                v-model="campaign.age"
                                label="Select Age Groups"
                                placeholder="Doesn't matter"
                                multiple
                                autocomplete
                                persistent-hint
                                deletable-chips
                                clearable
                            ></v-select>
                          </v-flex>
                          <v-flex sm8 class="ml-3">
                            <v-select
                                label="Select Gender"
                                placeholder="Doesn't matter"
                                :items="gender"
                                v-model="campaign.gender"
                                autocomplete
                                item-text="value"
                                item-value="id"
                                persistent-hint
                                clearable
                            ></v-select>
                          </v-flex>
                        </v-layout>

                        <div class="text-md-right mt-5">
                          <v-btn class="darken-1 mr-2 grey--text text--darken-2" :loading="saveDraftLoading"
                                 @click.native.stop="reviewCampaign(false)" v-if="!campaign.id">
                            <v-icon left>save</v-icon>
                            Save As Draft
                          </v-btn>
                          <v-btn class="purple darken-1 white--text" :loading="startCampaignLoading"
                                 @click.native.stop="reviewCampaign(true)" v-if="!campaign.id">
                            <v-icon left>fa-play-circle-o</v-icon>
                            Start Campaign
                          </v-btn>
                          <v-btn class="darken-1 mr-2 grey--text text--darken-2" :loading="saveDraftLoading"
                                 @click.native.stop="reviewCampaign(false)" v-if="campaign.id">
                            <v-icon left>save</v-icon>
                            Save
                          </v-btn>
                          <v-btn class="purple darken-1 white--text" :loading="startCampaignLoading"
                                 @click.native.stop="reviewCampaign(true)" v-if="campaign.id && campaign.status === 0">
                            <v-icon left>fa-play-circle-o</v-icon>
                            Save & Start
                          </v-btn>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </transition>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
  // mount with component(can't work in Nuxt.js/SSR)
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import 'vue-croppa/dist/vue-croppa.css'
  import {quillEditor} from 'vue-quill-editor'
  import SelectCategories from '../../helpers/SelectCategories'
  import NetworkSelect from './../helpers/NetworkSelect'
  import Dropzone from './../helpers/Dropzone'
  import UploadButton from './../helpers/UploadButton'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import VueSlider from 'vue-slider-component'

  export default {
    components: {
      quillEditor, SelectCategories, NetworkSelect, Dropzone, UploadButton, VueCoreImageUpload, VueSlider
    },
    props: [
      'editCampaign'
    ],
    data () {
      return {
        croppa: {},
        zoom: 1,
        zoomMin: 0,
        zoomMax: 5,
        savingImage: false,
        categories: [],
        geos: [],
        contentBudget: [
          {
            text: 'Up to $250',
            budget: 250
          },
          {
            text: 'Up to $500',
            budget: 500
          },
          {
            text: 'Up to $1000',
            budget: 1000
          },
          {
            text: 'Up to $2500',
            budget: 2500
          },
          {
            text: 'Up to $5000',
            budget: 5000
          },
          {
            text: 'Up to $10000',
            budget: 10000
          },
        ],
        ages: [
          '18 - 24',
          '25 - 34',
          '35 - 44',
          '45 - 54',
          '55 - 64',
          '65+'
        ],
        gender: [
          {
            id: 'male',
            value: 'Mostly Male'
          },
          {
            id: 'female',
            value: 'Mostly Female'
          }
        ],
        step: '1',
        finishedSteps: [],
        logoFetched: false,
        campaign: {
          id: null,
          brand: null,
          title: null,
          description: null,
          conditions: [null],
          approval: false,
          overview: null,
          image_url: null,
          image_uploaded: false,
          logo_url: null,
          logo_uploaded: false,
          budget: null,
          content_budget: null,
          link_type: 0,
          ga_source: null,
          ga_medium: null,
          main_url: null,
          bitlinks: [null],
          files: [],
          initialFiles: [],
          categories: [],
          geos: [],
          networks: ['facebook', 'instagram', 'twitter', 'youtube', 'blog'],
          age: [],
          gender: null
        },
        saveDraftLoading: false,
        startCampaignLoading: false
      }
    },
    mounted() {
      // get categories
      this.$http.get('categories').then(result => {
        this.categories = result.data
      })

      this.$http.get('geos').then(result => {
        this.geos = result.data
      })

      if (this.editCampaign) {
        this.campaign = Object.assign({}, this.campaign, this.editCampaign)

        if (this.campaign.image_url) this.campaign.image_uploaded = true
      }
    },
    watch: {
      'campaign.image_uploaded': function (value) {
        // Remove image errors if image uploaded
        if (value) {
          this.errors.remove('image', 'step1')
        }
      },
      zoom: function (value) {
        this.croppa.scaleRatio = value
      }
    },
    methods: {
      finishStep(step) {
        this.$validator.validateAll('step' + step).then(result => {
          if (!this.campaign.image_uploaded) {
            this.errors.add({
              'field': 'image',
              'msg': 'An image has to be uploaded!',
              'scope': 'step1'
            })
            result = false
          }

          if (result) {
            this.step = (step + 1).toString()
            this.finishedSteps.push(step.toString())
            this.$vuetify.goTo(0)
          } else {
            if (this.errors.has('image', 'step1')) {
              console.log('caption image')
              this.$vuetify.goTo(this.$el.querySelector('[name="image"'))
            } else {
              this.$vuetify.goTo(this.$el.querySelector('[data-vv-id="' + this.errors.items[0].id + '"]'))
            }
          }
        }).catch(error => {
          console.error(error)
        })
      },
      reviewCampaign(start = false) {
        if (start) this.startCampaignLoading = true
        else this.saveDraftLoading = true

        if (this.campaign.networks.length === 0 && !this.errors.has('networks', 'step3')) this.errors.add({
          'field': 'networks',
          'msg': 'At least one channel has to be selected!',
          'scope': 'step3'
        })
        if (this.campaign.categories.length === 0 && !this.errors.has('categories', 'step3')) this.errors.add({
          'field': 'categories',
          'msg': 'At least one category has to be selected!',
          'scope': 'step3'
        })
        this.$validator.validateAll().then(result => {
          if (this.errors.all().length === 0) {
            this.saveCampaign(start)
          }
        }).catch(error => {
          console.error(error)
        })
      },
      saveCampaign(start) {
        let data = this.campaign
        data.start = start

        if (data.id) {
          this.$http.patch(`campaign/${data.id}`, data).then((result) => {
            let campaign = result.data.data

            this.saveDraftLoading = false
            this.startCampaignLoading = true

            this.$store.dispatch('alert', {
              'text': 'Campaign was successfully saved!',
              'color': 'green'
            })

            this.$emit('campaignUpdated', campaign)

            this.$router.push({'name': 'viewCampaignOverview', 'params': {'id': campaign.id }})

          }).catch(error => {
            this.$store.dispatch('alert', {
              'text': 'There was an error creating the campaign! Please try again.',
              'color': 'red'
            })
          })

        } else {
          this.$http.post('campaign', data).then((result) => {
            let campaign = result.data.data

            this.saveDraftLoading = false
            this.startCampaignLoading = true

            if (campaign.status === 10) {
              this.$store.dispatch('alert', {
                'text': 'Campaign was successfully started!',
                'color': 'green'
              })

              this.$router.push({'name': 'viewCampaignOverview', 'params': {'id': result.data.data.id}})
            } else if (campaign.status === 0) {
              this.$store.dispatch('alert', {
                'text': 'Campaign draft was saved',
                'color': 'green'
              })

            }

            this.$router.push({'name': 'campaignList', 'params': {'id': result.data.data.id}})

          }).catch(error => {
            this.$store.dispatch('alert', {
              'text': 'There was an error creating the campaign! Please try again.',
              'color': 'red'
            })
          })
        }
      },
      addLink() {
        this.campaign.bitlinks.push('')
      },
      removeLink() {
        this.campaign.bitlinks.pop()
      },
      fetchLogo: _.debounce(function () {
          if (this.errors.has('main_link')) return

          this.$http.get('campaign/fetch-logo', {params: {"url": this.campaign.bitlinks[0]}}).then(result => {
            this.campaign.logo_url = result.data.url
            this.logoFetched = true
            this.campaign.logo_uploaded = false
          }).catch(error => {
            console.log(error)
            this.logoFetched = true
            this.campaign.logo_uploaded = false
          })

        }, 1800
      ),
      uploadLogo(file) {
        let data = new FormData()
        data.append('file', file)

        this.$http.post('campaign/upload-logo', data).then(result => {
          this.campaign.logo_url = result.data.url
          this.campaign.logo_uploaded = true
        }).catch(error => {
          this.$store.dispatch('alert', {
            'text': 'Error uploading! Please upload an <strong>PNG or JPG image of max 1 MB</strong>',
            'color': 'red',
            'multiline': true
          })
        })
      },
      onNewImage() {
        this.zoom = this.croppa.scaleRatio
        this.zoomMin = this.croppa.scaleRatio
        this.zoomMax = this.croppa.scaleRatio * 3
      },
      onZoom() {
         if (this.zoomMax && this.croppa.scaleRatio >= this.zoomMax) {
           this.croppa.scaleRatio = this.zoomMax
         } else if (this.zoomMin && this.croppa.scaleRatio <= this.zoomMin) {
           this.croppa.scaleRatio = this.zoomMin
         }
      },
      uploadImage() {
        this.savingImage = true

        this.croppa.generateBlob((blob) => {
          let data = new FormData()
          data.append('file', blob)

          if (this.campaign.id) {
            data.append('campaign_id', this.campaign.id)
          }

          this.$http.post('campaign/upload-image', data).then(result => {
            this.campaign.image_url = result.data.url
            this.campaign.image_uploaded = true
            this.savingImage = false

            this.$store.dispatch('alert', {
              'text': 'Campaign image saved',
              'color': 'green'
            })

          }).catch(error => {
            this.$store.dispatch('alert', {
              'text': 'Error uploading! Please upload an <strong>PNG or JPG image of max 1 MB</strong>',
              'color': 'red',
              'multiline': true
            })
          })
        })
      },
      categorySelected(category) {
        if (this.campaign.categories.indexOf(category.id) > -1) {
          this.campaign.categories.splice(this.campaign.categories.indexOf(category.id), 1)
          if (this.campaign.categories.length === 0) this.errors.add({
            'field': 'categories',
            'msg': 'At least one category has to be selected!',
            'scope': 'step3'
          })
        } else {
          this.errors.remove('categories', 'step3')
          if (this.campaign.categories.length >= 3) return
          this.campaign.categories.push(category.id)
        }
      },
      toggleNetworkSelect(network) {
        if (this.campaign.networks.indexOf(network) > -1) {
          this.campaign.networks.splice(this.campaign.networks.indexOf(network), 1)
          if (this.campaign.networks.length === 0) this.errors.add({
            'field': 'networks',
            'msg': 'At least one channel has to be selected!',
            'scope': 'step3'
          })
        } else {
          this.errors.remove('networks', 'step3')
          this.campaign.networks.push(network)
        }
      },
      addFile(file) {
        this.campaign.files.push(file)
      },
      removeFile(fileName) {
        this.campaign.files.splice(this.campaign.files.findIndex(f => {return f.name === fileName}), 1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .quill-editor .ql-container {
    height: 350px;
  }
  .stepper.flat {
    box-shadow: none;
    -webkit-box-shadow: none;
    background: transparent;
  }
  .croppa-container {
    background-color: #f8f8f8;
    border: 1px dashed #b7b7b7;
  }
  .croppa-container.error {
    background-color: #f8f8f8 !important;
    border: 1px dashed #ff5252;
  }
</style>
