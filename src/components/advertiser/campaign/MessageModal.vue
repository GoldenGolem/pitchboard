<template>
  <v-dialog v-model="modalVisible" width="750px" scrollable v-if="proposal">
    <v-card class="grey lighten-3">
      <v-card-title class="title white--text purple">
        <v-layout row wrap>
          <v-flex xs1 class="text-xs-center">
            <v-avatar>
              <img :src="proposal.influencer.user.avatar" />
            </v-avatar>
          </v-flex>
          <v-flex xs15 pl-4>
            <!-- TODO set h5 -->
            <div class="subheading pa-1 mb-0"><strong>Chat with {{ proposal.influencer.name }}</strong></div>
            <div class="subheading pa-1">
              Proposal details
              <a href="javascript:;" @click="messageNavigation = !messageNavigation" class="ml-1 white--text" style="text-decoration: underline;">show</a>
            </div>
          </v-flex>
        </v-layout>
      </v-card-title>
      <!--<div style="position: relative">-->
        <v-card-text style="height: 350px" class="chat-messages" v-chat-scroll>
          <v-navigation-drawer
              v-model="messageNavigation"
              dark
              absolute
              temporary
              left
              width="300"
              class="pa-5 grey lighten-4"
          >

          </v-navigation-drawer>

          <v-layout row v-for="message in messages" :key="message.id" v-if="messages.length">
            <chat-message :message="message"></chat-message>
          </v-layout>
          <v-layout fill-height justify-center align-center v-else>
            <v-flex class="subheading text-xs-center grey--text text--darken-2">
              Start your conversation by sending the first message.
            </v-flex>
          </v-layout>

        </v-card-text>
          <v-card-actions class="pa-0">
            <form @submit.stop.prevent="sendMessage" style="width: 100%">
            <v-layout row class="white ma-1">

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
              <v-flex sm1 justify-center align-center d-flex>
                <div>
                  <v-btn fab small class="purple white--text" @click="sendMessage"><v-icon>send</v-icon></v-btn>
                </div>
              </v-flex>

            </v-layout>
            </form>
          </v-card-actions>
      <!--</div>-->
    </v-card>
  </v-dialog>
</template>

<script>
  import ChatMessage from '../../helpers/ChatMessage'

  export default {
    components: {
      ChatMessage
    },
    props: [
      'visible', 'proposal'
    ],
    data() {
      return {
        messageNavigation: false,
        messages: [],
        message: null,
      }
    },
    computed: {
      modalVisible: {
        get() {
          return this.visible;
        },
        set(value) {
          this.$emit('modalToggled', value)
        }
      }
    },
    watch: {
      'proposal.id': function (oldId, newId) {
        this.$http.get(`/messages/${this.proposal.id}`).then(result => {
          console.log(result.data)

          if (result.data.data) {
            this.messages = result.data.data;
          } else {
            this.messages = result.data;
          }

          this.$echo.leave(`proposal.${oldId}`)

          this.$echo.private(`proposal.${this.proposal.id}`).listen('MessageSent', (payload) => {
            console.log(payload)
            if (
              payload.message.sender_id !== this.$store.state.user.data.id &&
              this.proposal.id === payload.message.conversation.proposal_id
            ) this.messages.push(payload.message)
          })
        })
      },
    },
    methods: {
      sendMessage() {
        const data = {
          'proposal_id': this.proposal.id,
          'to': this.proposal.influencer.user_id,
          'message': this.message
        }

        this.$http.post('/message', data).then(result => {
          this.message = null
          this.messages.push(result.data)
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