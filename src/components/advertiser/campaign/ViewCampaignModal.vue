<template>

  <v-dialog v-model="campaignModalVisible" maxWidth="890px" transition="fade" scrollable>
    <v-btn flat dark large fab @click.native="campaignModalVisible = false" class="btn--close">
      <v-icon>close</v-icon>
    </v-btn>
    <v-card class="grey lighten-2 pb-modal" v-if="campaign">
      <v-card-title class="modal-sidebar" style="height: 100px">
        <div :style="{ 'background': 'url(\''+campaign.image_url+'\')'}" class="modal-sidebar-bg">
        </div>
        <div class="modal-sidebar-content pa-4 pl-5 pr-5">
          <div class="subheading white--text">
            <strong>{{ campaign.brand }}</strong>
            &middot;
            {{ campaign.title }}
          </div>
          <div class="white--text mt-2">
            Started on {{ campaign.started_at | moment("LL") }}
          </div>
        </div>
      </v-card-title>
      <v-card-text class="scrollable pa-5">
        <v-layout row class="mb-2" justify-center align-center>
          <v-flex sm8>
            <h4 class="subheading"><strong>CAMPAIGN OVERVIEW</strong></h4>
          </v-flex>
          <v-flex sm8 class="text-sm-right" v-if="campaign.content_budget">
            <v-chip color="primary" text-color="white">
              Per influencer budget up to:  <strong class="ml-2">${{ campaign.content_budget }}</strong>
            </v-chip>
          </v-flex>
        </v-layout>
        <v-card>
          <v-card-text>
            {{ campaign.overview }}
          </v-card-text>
          <v-card-text style="border-top: 1px solid #eeeeee">
            <v-layout row align-center>
              <v-flex sm4 class="text-sm-right mr-3">
                <strong>Main URL</strong>
              </v-flex>
              <v-flex sm12>
                <a :href="campaign.main_url" target="_blank">
                  {{ campaign.main_url }}
                </a>
              </v-flex>
            </v-layout>
            <v-layout row align-center class="mt-1">
              <v-flex sm4 class="text-sm-right mr-3">
                <strong>Total Campaign Budget</strong>
              </v-flex>
              <v-flex sm12>
                {{ campaign.budget | currency }}
              </v-flex>
            </v-layout>
            <v-layout row align-center class="mt-1">
              <v-flex sm4 class="text-sm-right mr-3">
                <strong>Approval Required</strong>
              </v-flex>
              <v-flex sm12>
                {{ campaign.approval ? 'Yes' : 'No' }}
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>

        <h4 class="subheading mt-5 mb-2"><strong>FULL BRIEF</strong></h4>
        <v-card color="white">
          <v-card-text v-html="campaign.description">

          </v-card-text>
        </v-card>
        <!--KEY REQUIREMENTS-->
        <h4 class="subheading mt-5 mb-2"><strong>KEY REQUIREMENTS</strong></h4>
        <v-card v-if="campaign.conditions.length > 0">
          <v-card-text>
            <div v-for="(condition, index) in campaign.conditions" :key="index" class="mb-1">
              <v-icon class="icon--small">check</v-icon> {{ condition }}
            </div>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-text>No key requirements</v-card-text>
        </v-card>

        <h4 class="subheading mt-5 mb-2">
          <strong>AUDIENCE TARGETING</strong>
        </h4>
        <v-card v-if="campaign.geos.length === 0 && !campaign.target_age && !campaign.target_gender">
          <v-card-text>No specific audience targeting provided</v-card-text>
        </v-card>
        <v-chip color="white" style="border-color: #cdcdcd !important;" v-if="campaign.geos.length > 0">
          <strong class="mr-1">Country</strong>
          <span v-for="country, index in campaign.geos" class="ml-1">
            {{ country.name }}<span v-if="index < campaign.geos.length - 1">, </span>
          </span>
        </v-chip>
        <v-chip color="white" style="border-color: #cdcdcd !important;" v-if="campaign.target_age && campaign.target_age.length > 0">
          <strong class="mr-1">Age</strong>
          <span v-for="age, index in campaign.target_age" class="ml-1">
            {{ age }}<span v-if="index < campaign.target_age.length - 1">, </span>
          </span>
        </v-chip>
        <v-chip color="white" style="border-color: #cdcdcd !important;" v-if="campaign.target_gender">
          <strong class="mr-2">Gender</strong>
          <span v-if="campaign.target_gender === 'male'">Mostly Male</span>
          <span v-else-if="campaign.target_gender === 'female'">Mostly Female</span>
        </v-chip>

        <!--LINKS TO INCLUDE-->
        <h4 class="subheading mt-5 mb-2"><strong>LINKS TO INCLUDE</strong></h4>
        <v-chip color="white" style="border-color: #cdcdcd !important;">
          <a href="#">
            <v-avatar>
              <v-icon>link</v-icon>
            </v-avatar>
            Main Link
          </a>
        </v-chip>

        <!--ATTACHMENTS-->
        <h4 class="subheading mt-5 mb-2" v-if="campaign.files.length > 0"><strong>ATTACHMENTS</strong></h4>
        <v-container grid-list-sm class="pa-0" v-if="campaign.files.length > 0">
          <v-layout row wrap justify-space-between>
            <v-flex sm4 v-for="file in campaign.files" :key="file.id">
              <file-card
                  :upload="false"
                  :image="['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) > -1 ? file.path : null"
                  :id="file.id"
                  :url="file.file"
                  :size="file.size"
                  :name="file.original_file"
                  @download="() => {}"
                  @previewImage="() => {}"
              >
              </file-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-layout row wrap class="mb-3">
          <v-flex sm4 class="mr-2" v-for="file in campaign.files" :key="file.id">
          </v-flex>
        </v-layout>

      </v-card-text>

      <v-card-actions class="pl-5 pr-5 pt-4 pb-4">
        <v-btn color="primary" :to="{ name: 'editCampaign', id: campaign.id }" @click.native="closeModal">
          <v-icon left>edit</v-icon>
          Edit Campaign
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="grey" small @click.native="closeModal">
          <v-icon>close</v-icon>
          Close
        </v-btn>
      </v-card-actions>


    </v-card>
  </v-dialog>

</template>

<script>
  import FileCard from '../../helpers/FileCard'

  export default {
    props: [
      'campaignModal', 'campaign'
    ],
    components: {
      FileCard
    },
    data () {
      return {
      }
    },
    mounted() {
    },
    computed: {
      campaignModalVisible: {
        get() {
          return this.campaignModal
        },
        set(value) {
          this.$emit('modalToggled', value)
        }
      }
    },
    watch: {
    },
    methods: {
      closeModal() {
        this.$emit('modalToggled', false)
      },
    }
  }
</script>