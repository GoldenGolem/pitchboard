<template>
  <div>
    <v-layout row justify-center class="mb-4">
      <v-flex md12>
        <h6 class="title text-sm-center">
          <v-icon>content_paste</v-icon>
          START A NEW CAMPAIGN
        </h6>
      </v-flex>
    </v-layout>
    <campaign-form></campaign-form>
  </div>
</template>

<script>
  import CampaignForm from './campaign/CampaignForm'

  export default {
    components: {
      CampaignForm
    },
    data () {
      return {
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
