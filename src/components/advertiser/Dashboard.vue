<template>
  <div class="main-content">
    <h4 class="subheading grey--text mb-0">
      DASHBOARD
    </h4>
    <v-layout row align-center>
      <v-flex sm8>
        <h4 class="subheading mb-0">
          <v-icon small class="primary--text mr-3" style="font-size: 22px">play_circle_outline</v-icon> <strong>Active Campaigns</strong>
          <span class="grey--text"> / {{ campaigns.length }} in total</span>
        </h4>
      </v-flex>
      <v-flex sm5 class="mr-3">
        <v-text-field placeholder="Search campaigns..." prefix="" prepend-icon="search" v-model="search">

        </v-text-field>
      </v-flex>
      <v-flex sm3>
        <v-btn
            block
            :hide-details="true"
            :full-width="true"
            class="purple white--text elevation-1 mt-0 mb-3"
            tag="a"
            :to="{ name: 'createCampaign' }"
          >
          Start a New Campaign
        </v-btn>
      </v-flex>
    </v-layout>

    <v-data-table
        :items="campaigns"
        class="elevation-0 mt-5 campaign--list"
        hide-actions
        :search="search"
        :headers="headers"
        style="z-index: 4"
    >
      <template slot="headers" slot-scope="props">
        <th></th>
        <th>Campaign</th>
        <th>Total Spend</th>
        <th>
          <v-menu offset-y>
            <v-btn flat slot="activator">
              <transition name="fade" mode="out-in">
                <span v-if="proposalsColumn === 'open'" key="open">Open Proposals</span>
                <span v-if="proposalsColumn === 'accepted'" key="accepted">In Progress</span>
                <span v-if="proposalsColumn === 'published'" key="published">Published Posts</span>
              </transition>
              <v-icon right>fa-caret-down</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="proposalsColumn = 'open'"> <v-list-tile-title>Open Proposals</v-list-tile-title> </v-list-tile>
              <v-list-tile @click="proposalsColumn = 'accepted'"> <v-list-tile-title>In Progress</v-list-tile-title> </v-list-tile>
              <v-list-tile @click="proposalsColumn = 'published'"> <v-list-tile-title>Published Posts</v-list-tile-title> </v-list-tile>
            </v-list>
          </v-menu>
        </th>
        <th>
          <v-menu offset-y>
            <v-btn flat slot="activator">
              <transition name="fade" mode="out-in">
                <span v-if="viewsColumn === 'clicks'" key="clicks">Total Clicks</span>
                <span v-if="viewsColumn === 'shares'" key="shares">Total Shares</span>
              </transition>
              <!--<span v-if="viewsColumn === 'engagement'">Total E</span>-->
              <v-icon right>fa-caret-down</v-icon></v-btn>
            <v-list>
              <v-list-tile @click="viewsColumn = 'clicks'"> <v-list-tile-title>Total Clicks</v-list-tile-title> </v-list-tile>
              <!--<v-list-tile @click=""> <v-list-tile-title>Total Engagement</v-list-tile-title> </v-list-tile>-->
              <v-list-tile @click="viewsColumn = 'shares'"> <v-list-tile-title>Total Shares</v-list-tile-title> </v-list-tile>
            </v-list>
          </v-menu>
        </th>
        <th>Status</th>
      </template>
      <template slot="items" slot-scope="props">
        <td class="text-sm-center pa-0" style="width: 180px">
          <!--<v-avatar size="60px">-->
          <img :src="props.item.image_url" style="width: 150px; height: 80px; object-fit: cover" class="ma-0 elevation-1">
          <!--</v-avatar>-->
        </td>
        <td class="subheading" style="min-width: 180px">
          {{ props.item.title }} <br>
          <router-link class="campaign--link" :to="{ 'name': 'viewCampaignOverview', 'params': {'id': props.item.id } }">
            VIEW CAMPAIGN
          </router-link>
        </td>
        <td>
          <v-progress-linear style="min-width: 160px" :value="100 * (props.item.cost / props.item.budget)">

          </v-progress-linear>
          <v-layout>
            <v-flex sm8 class="text-sm-left">
              {{ props.item.cost | currency('$', 0) }}
            </v-flex>
            <v-flex sm8 class="text-sm-right">
              {{ props.item.budget | currency('$', 0) }}
            </v-flex>
          </v-layout>
        </td>
        <td class="text-sm-center display-1">
          {{ props.item[proposalsColumn] }}
        </td>
        <td class="text-sm-center display-1">
          {{ props.item[viewsColumn] }}
        </td>
        <td class="text-sm-center">
          <toggle-button :value="props.item.status === 10"
                         :color="{checked: '#03a9f4', unchecked: '#e6e6e6'}"
                         :labels="{checked: 'LIVE', unchecked: 'OFF'}"
                         :width="70"
                         :height="30"
                         :sync="true"
                         @change="updateCampaignStatus(props.item.id, $event)"
          />
        </td>
      </template>
    </v-data-table>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        'headers': [{},{},{},{},{},{}],
        'campaigns': [],
        'progress': 40,
        'search': null,
        'proposalsColumn': 'open',
        'viewsColumn': 'clicks'
      }
    },
    mounted() {
      this.$http.get('campaigns').then(result => {
        this.campaigns = result.data
      })
    },
    methods: {
      updateCampaignStatus(campaign_id, status) {
        this.$http.patch('campaign/' + campaign_id, { 'status': status.value }).then(result => {
          console.log(result)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .list--title {
    border-right: 1px solid #d2d2d2;
    font-size: 14px;
    font-weight: 600;
  }
  .list--title:last-child, .list--element:last-child {
    border-right: 0;
  }
  .list--element {
    border-right: 1px solid #d2d2d2;
  }

  .campaign--list .table {
    background-color: transparent !important;
  }
  .campaign--list .table tbody tr {
    background-color: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12) !important;
  }
  .campaign--list .table tr:not(:last-child) {
    border-bottom: 1px solid #eeeeee;
  }
  .campaign--list .table thead th {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87) !important;
    text-transform: uppercase;
  }
  .campaign--list .table td, .campaign--list .table th {
    border-right: 1px solid #eeeeee;
  }
  .campaign--list .table td:last-child,
  .campaign--list .table th:last-child,
  .campaign--list .table td:first-child,
  .campaign--list .table th:first-child {
    border-right: 0;
  }
  .campaign--list .table thead tr:first-child {
    border-bottom: 0px;
  }
  .input-group.input-group--solo {
    background: transparent !important;
  }
  .campaign--list .table th .input-group__selections__comma {
    font-size: 14px;
  }
  .campaign--list .table th .input-group__selections {
    width: auto;
  }
  .campaign--list .table tbody tr td {
    padding: 35px 20px !important;
  }
  .campaign--list .table thead:last-of-type {
    border-bottom: 0;
  }

  .campaign--link {
    font-size: 12px;
    font-weight: 600;
  }
</style>
