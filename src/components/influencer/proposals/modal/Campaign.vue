<template>
  <div v-if="campaign">
    <!--FULL BRIEF-->
    <v-layout row class="mb-2" justify-center align-center>
      <v-flex sm8>
        <h4 class="subheading"><strong>FULL BRIEF</strong></h4>
      </v-flex>
      <v-flex sm8 class="text-sm-right" v-if="campaign.content_budget">
        <v-chip color="primary" text-color="white">
          Budget up to:  <strong class="ml-2">${{ campaign.content_budget }}</strong>
        </v-chip>
      </v-flex>
    </v-layout>
    <v-card color="white">
      <v-card-text v-html="campaign.description">

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
            <strong>Approval Required</strong>
          </v-flex>
          <v-flex sm12>
            {{ campaign.approval ? 'Yes' : 'No' }}
          </v-flex>
        </v-layout>
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
    <v-card v-else>
      <v-card-text>
        <v-layout row align-center v-if="campaign.geos.length > 0">
          <v-flex sm3 class="text-sm-right mr-3">
            <strong>Country</strong>
          </v-flex>
          <v-flex sm13>
            <span v-for="country, index in campaign.geos" class="ml-1">
              {{ country.name }}<span v-if="index < campaign.geos.length - 1">, </span>
            </span>
          </v-flex>
        </v-layout>
        <v-layout row align-center v-if="campaign.target_age && campaign.target_age.length > 0">
          <v-flex sm3 class="text-sm-right mr-3">
            <strong>Age</strong>
          </v-flex>
          <v-flex sm13>
            <span v-for="age, index in campaign.target_age" class="ml-1">
              {{ age }}<span v-if="index < campaign.target_age.length - 1">, </span>
            </span>
          </v-flex>
        </v-layout>
        <v-layout row align-center v-if="campaign.target_age && campaign.target_age.length > 0">
          <v-flex sm3 class="text-sm-right mr-3">
            <strong>Gender</strong>
          </v-flex>
          <v-flex sm13>
            <span v-if="campaign.target_gender === 'male'">Mostly Male</span>
            <span v-else-if="campaign.target_gender === 'female'">Mostly Female</span>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <!--ATTACHMENTS-->
    <h4 class="subheading mt-5 mb-2" v-if="campaign.files.length > 0"><strong>ATTACHMENTS</strong></h4>
    <v-container grid-list-sm class="pa-0" v-if="campaign.files.length > 0">
      <v-layout row wrap>
        <v-flex sm4 v-for="file in campaign.files" :key="file.id">
          <file-card
              :id="file.id"
              :thumbnail="['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) > -1 ? file.path : null"
              :previewImage="['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) > -1 ? file.path : null"
              :url="file.path"
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
  </div>
</template>

<script>
  import FileCard from '../../../helpers/FileCard'

  export default {
    components: {
      FileCard
    },
    props: [
      'campaign', 'proposal'
    ],
    data () {
      return {
      }
    },
    mounted() {
    },
    computed: {
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