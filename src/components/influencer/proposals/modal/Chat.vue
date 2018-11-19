<template>
  <div class="white elevation-1" style="margin-top: -46px">
    <div style="height: 450px; overflow: auto; z-index: 0" id="chat" class="pa-4">
      <div v-if="messages.length > 0">
        <div v-for="(message, index) in messages" :key="message.id">
          <chat-message :message="message" :showName="!messages[index - 1] || messages[index - 1].sender_id !== message.sender_id"></chat-message>
        </div>
      </div>
      <v-layout fill-height justify-center align-center v-else>
        <v-flex class="subheading text-xs-center grey--text text--darken-2">
          Start your conversation by sending the first message.
        </v-flex>
      </v-layout>
    </div>
    <form @submit.stop.prevent="sendMessage" class="pa-0">
      <v-card-actions class="pa-0" style="border-top: 1px solid #eeeeee">
        <v-layout row class="white ma-0">
          <v-flex sm15>
            <v-text-field
                placeholder="Type your message..."
                max="255"
                hide-details
                solo
                class="pa-2 pb-3 pt-3 elevation-0"
                v-model="message"
            ></v-text-field>
          </v-flex>
          <v-flex sm1 justify-center align-center d-flex class="mr-3 ml-3">
            <div>
              <v-btn fab small class="purple white--text" @click="sendMessage"><v-icon>send</v-icon></v-btn>
            </div>
          </v-flex>
        </v-layout>

      </v-card-actions>
    </form>
  </div>
</template>

<script>
  import ChatMessage from '../../../helpers/ChatMessage'

  export default {
    components: {
      ChatMessage,
    },
    props: [
      'campaign', 'proposal'
    ],
    data() {
      return {
        messageNavigation: false,
        messages: [],
        message: null,
      }
    },
    computed: {
      messagesLength() {
        return this.messages.length
      }
    },
    mounted() {
      this.fetchMessages()
      this.authorizeChannel(false, this.proposal.id)
    },
    watch: {
      'proposal.id': function (oldId, newId) {
        this.fetchMessages()
        this.authorizeChannel(oldId, newId)
      },
    },
    methods: {
      fetchMessages() {
        if (!this.proposal.id) return

        this.$http.get(`/messages/${this.proposal.id}`).then(result => {
          if (result.data.data) {
            this.messages = result.data.data;
          } else {
            this.messages = result.data;
          }
          this.scrollBottom()
        })
      },
      authorizeChannel(oldId, newId) {
        if (oldId) this.$echo.leave(`proposal.${oldId}`)

        this.$echo.private(`proposal.${this.proposal.id}`).listen('MessageSent', (payload) => {
          if (
            payload.message.sender_id !== this.$store.state.user.data.id &&
            this.proposal.id === payload.message.conversation.proposal_id
          ) {
            this.messages.push(payload.message)
            this.scrollBottom()
          }
        })
      },
      scrollBottom() {
        let container = this.$el.querySelector("#chat");
        setTimeout(() => {
          container.scrollTop = container.scrollHeight + 300;
        }, 250)
      },
      sendMessage() {
        if (!this.message) return

        const data = {
          'proposal_id': this.proposal.id,
          'to': this.campaign.advertiser.user_id,
          'message': this.message
        }

        this.$http.post('/message', data).then(result => {
          this.message = null
          this.messages.push(result.data)
          this.scrollBottom()
        }).catch(error => {
          this.$store.dispatch('alert', {
            'text': 'Something went wrong while sending your message.',
            'color': 'red'
          })
        })
      }
    }
  }
</script>

<style>


</style>