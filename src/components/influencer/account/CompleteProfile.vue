<template>
  <div>
    <v-layout row justify-center>
      <v-flex md12>
        <v-card class="pa-2">
          <v-card-title>
            <h4 class="headline mb-2"><strong>Complete Your Profile</strong></h4>
            <div class="grey--text text--darken-2 subheading" v-if="analyzed">
              We've looked up some of your audience details automatically but please confirm they are accurate. Your profile is shown to potential brands when you take part in campaigns.
            </div>
          </v-card-title>
          <v-card-text v-if="!analyzed" class="pa-5">
            <v-layout align-center justify-center column>
              <v-progress-circular indeterminate :width="1" :size="130" color="purple"></v-progress-circular>
              <div class="text-xs-center subheading grey--text text--darken-2 mt-4">
                Please wait while we analyze your connected social profiles for basic data...
              </div>
            </v-layout>
          </v-card-text>
          <v-card-text v-else>
            <h6 class="title mb-2"><strong>Bio</strong></h6>
            <div class="grey--text">
              Your bio is imported. Edit or use one from:
              <span v-for="b in bios">
                <span v-if="b.network === bio.source">{{ b.network }} <v-icon style="font-size: 16px" v-if="b.network === bio.source">check</v-icon></span>
                <a @click="bio.content = b.bio; bio.source = b.network" v-else>{{ b.network }}</a>
                &middot;
              </span>
            </div>
            <div class="bio mt-3 pa-3" v-if="!bio.editing">
              {{ bio.content }}
            </div>
            <v-text-field
                v-model="bio.content"
                v-else
                v-validate="'required'"
                data-vv-name="bio"
                hide-details
                :counter="250"
                :error-messages="errors.collect('bio')"
                multi-line
            ></v-text-field>
          </v-card-text>
          <v-card-actions v-if="analyzed">
            <v-spacer></v-spacer>
            <v-btn color="purple" small outline @click.native="bio.editing = true" v-if="!bio.editing">Edit Bio</v-btn>
            <v-btn class="purple white--text" small @click.native="bio.editing = false" v-else>Save</v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="pa-2 mt-5" v-if="analyzed">
          <v-card-title>
            <div class="grey--text text--darken-2 subheading">
              We've determined the following topics and audience demographics for your account. Please confirm these details and edit if required.
            </div>
          </v-card-title>
          <v-card-text>
            <h6 class="title mb-2"><strong>Audience Interests ({{selectedCategories.length}})</strong></h6>
            <div class="grey--text mb-3">
              Choose up to 3 categories of interest of your audience
            </div>
            <select-categories :categories="categories" :selected="selectedCategories" @categorySelected="categorySelected"></select-categories>
            <h6 class="title mt-5 mb-3"><strong>Audience Demographics</strong></h6>
            <v-layout justify-space-between>
              <v-flex sm5 style="width: 33%">
                <div class="subheading"><v-icon>fa-map-o</v-icon> Top Audience Country</div>
                <v-select
                    :items="countries"
                    item-text="name"
                    item-value="code"
                    v-model="country"
                    :disabled="countryPulled"
                    :hint="countryPulled ? 'Pulled from social profiles' : ''"
                    persistent-hint
                ></v-select>
              </v-flex>
              <v-flex sm5 style="width: 33%">
                <div class="subheading"><v-icon>fa-venus-mars</v-icon> Top Audience Gender</div>
                <v-select
                    :items="genders"
                    v-model="gender"
                    :disabled="genderPulled"
                    :hint="countryPulled ? 'Pulled from social profiles' : ''"
                    persistent-hint
                ></v-select>
              </v-flex>
              <v-flex sm5 style="width: 33%">
                <div class="subheading"><v-icon>compare_arrows</v-icon> Top Audience Age</div>
                <v-select
                    :items="ages"
                    v-model="age"
                    :disabled="agePulled"
                    :hint="agePulled ? 'Pulled from social profiles' : ''"
                    persistent-hint
                ></v-select>
              </v-flex>
            </v-layout>
            <div class="text-xs-center">
              <v-btn large class="mt-5 purple darken-1 white--text" @click="submit" :loading="this.submitting"><v-icon left>check</v-icon> Finish Profile Setup</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

    </v-layout>

  </div>
</template>

<script>
  import SelectCategories from '../../helpers/SelectCategories'

  export default {
    components: {
      SelectCategories
    },
    data() {
      return {
        analyzed: false,
        bio: {
          content: null,
          source: null,
          editing: false
        },
        bios: [],
        categories: [],
        selectedCategories: [],
        countries: [],
        genders: [
          {
            'value': 'both',
            'text': 'Equally Distributed'
          },
          {
            'value': 'female',
            'text': 'Mostly Female'
          },
          {
            'value': 'male',
            'text': 'Mostly Male'
          },
        ],
        ages: ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        country: null,
        countryPulled: false,
        age: null,
        agePulled: false,
        gender: null,
        genderPulled: false,
        submitting: false
//        county: null,
//        gender: null,
//        age: null,
//        categories: [],
//        countries: [
//          { text: 'USA' },
//          { text: 'Canada' },
//        ],
//        gender: [
//          { text: 'Male' },
//          { text: 'Female' },
//        ],
//        ages: [
//          { text: '1990' },
//          { text: '1991' },
//          { text: '1992' },
//          { text: '1993' },
//          { text: '1994' },
//          { text: '1995' },
//          { text: '1996' },
//        ]
      }
    },
    mounted() {
//      this.$store.dispatch('loading', 'apsldkpalsdk')


      this.$http.get('categories').then(response => {
        this.categories = response.data;
      })

      this.$http.get('countries', { 'group': 'code' }).then(response => {
        this.countries = response.data;
      })

      this.$http.get('influencer/analyze-profile').then(response => {

        const data = response.data

        if (data.categories) this.selectedCategories = data.categories

        if (data.bios.length > 0) this.bios = data.bios
        this.selectBio()

        if (data.country) {
          this.country = data.country
          this.countryPulled = true
        }

        if (data.gender) {
          this.gender = data.gender
          this.genderPulled = true
        }

        if (data.age) {
          this.age = data.age
          this.agePulled = true
        }

        this.analyzed = true
      })

    },
    methods: {
      categorySelected(category) {
        if (this.selectedCategories.indexOf(category.id) > -1) {
          this.selectedCategories.splice(this.selectedCategories.indexOf(category.id), 1)
        } else {
          if (this.selectedCategories.length >= 3) return
          this.selectedCategories.push(category.id)
        }
      },
      submit() {
        const payload = {
          categories: this.selectedCategories,
          bio: this.bio.content,
          country: this.country,
          age: this.age,
          gender: this.gender
        }

        this.submitting = true
        this.$http.post('influencer/store', payload).then(response => {
          this.$store.dispatch('alert', {text: "We've selected relevant opportunities for you!", color: "success"})
          this.$router.push({ name: 'influencerOpportunities'})
        })
      },
      selectBio() {
        if (this.bios.length === 0) return

        this.bio.content = this.bios[0].bio
        this.bio.source = this.bios[0].network
      }
    }
  }
</script>

<style scoped>
  .card__title .headline {
    font-size: 26px !important;
    font-weight: 600;
  }

  .card__title .subheading {
    font-size: 18px !important;
    font-weight: 300;
  }

  .bio {
    border: 1px solid #efefef;
    border-radius: 5px;
  }


</style>