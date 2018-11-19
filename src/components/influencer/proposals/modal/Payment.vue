<template>
    <div>

      <div class="subheading mb-2">
        <strong>PAYMENT DETAILS</strong>
      </div>

      <v-card>
        <v-card-text>
          <v-layout row align-center>
            <v-flex sm2 class="pa-3 text-sm-center">
              <v-icon x-large color="orange">schedule</v-icon>
            </v-flex>
            <v-flex sm12 class="pa-3">
              <div class="subheading">
                Your payment is scheduled on <strong>{{ proposal.published_at | moment("add", "7 days", "MMM DD") }}</strong>
              </div>
              <div class="small grey--text text--darken-2">
                5% PitchBoard service fee will be deducted
              </div>
            </v-flex>
            <v-flex sm4 class="pa-3">
              <div class="subheading text-sm-center">
                <v-chip color="primary" text-color="white" class="pa-2"><span class="subheading">
                  <strong>{{ proposal.fee_net | currency }}</strong>
                </span></v-chip>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

  </div>
</template>

<script>

  export default {
    components: {
    },
    props: [
      'campaign', 'proposal', 'profile'
    ],
    data() {
      return {
      }
    },
  }
</script>

<style>

</style>