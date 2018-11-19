<template>
  <div style="padding-left: 45px;" class="chat--message">
    <div v-if="showName" style="position: relative" class="mt-3">
      <v-avatar tile size="40px" style="position: absolute; left: -48px; top: 4px">
        <img :src="message.sender.avatar" style="border-radius: 4px">
      </v-avatar>
      <strong>
        <span>{{ message.sender.name }}</span>
      </strong>
      <span class="caption grey--text ml-2" v-tooltip.top.center="moment(message.created_at).format('LLL')">
        {{ message.created_at | moment('HH:mm') }}
      </span>
    </div>

    <div class="mb-2">

    <!--<v-card flat style="border-radius: 5px" class="mb-1">-->
      <!--<v-card-text class="pt-2 pb-2 pl-3 pr-3 grey&#45;&#45;text text&#45;&#45;darken-2">-->
        {{ message.message }}
      <!--</v-card-text>-->
    <!--</v-card>-->

    </div>
  </div>
</template>

<script>

  export default {
    props: [
      'message', 'showName'
    ],
    data() {
      return {
        'moment': moment
      }
    },
    computed: {
      user() {
        return this.$store.state.user.data
      },
      byMe() {
        return this.user.id === this.message.sender_id
      }
    }
  }
</script>