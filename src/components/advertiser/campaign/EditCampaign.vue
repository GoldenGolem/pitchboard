<template>
  <div style="margin-top: 100px">
    <campaign-form v-if="editCampaign"
        :editCampaign="editCampaign"
                   @campaignUpdated="campaignUpdated"
    ></campaign-form>
  </div>
</template>

<script>
  import CampaignForm from './CampaignForm'

  export default {
    props: [
      'campaign'
    ],
    data() {
      return {
        editCampaign: null
      }
    },
    mounted() {
      let categories = this.campaign.categories.map(category => {
        return category.id
      })
      let geos = this.campaign.geos.map(geo => {
        return geo.id
      })

      let editCampaign = this.campaign

      editCampaign.categories = this.campaign.categories.map(category => {
        return category.id
      })
      editCampaign.geos = this.campaign.geos.map(geo => {
        return geo.id
      })
      editCampaign.networks = this.campaign.networks || []
      editCampaign.image_uploaded = true
      editCampaign.age = editCampaign.target_age
      editCampaign.gender = editCampaign.target_gender
      editCampaign.initialFiles = [...this.campaign.files]
      editCampaign.files = this.campaign.files.map(file => {
        return {
          "name": file.original_file,
          "path": file.file,
          "size": file.size,
          "type": file.type,
          "url": file.path
        }
      })

      this.editCampaign = editCampaign
    },
    methods: {
      campaignUpdated(campaign) {
        this.$emit('campaignUpdated', campaign)
      }
    },
    components: {
      CampaignForm
    }
  }
</script>

<style>

</style>