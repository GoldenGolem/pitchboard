import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

// layouts
const Advertiser = () => import('@/components/layouts/Advertiser')
const Influencer = () => import('@/components/layouts/Influencer')
const Login = () => import('@/components/layouts/Login')
const Signup = () => import('@/components/layouts/Signup')

// advertiser
const NewCampaign = () => import('@/components/advertiser/NewCampaign')
const Campaign = () => import(/* webpackChunkName: "advertiser-campaign" */ '@/components/advertiser/Campaign')
const Campaigns = () => import(/* webpackChunkName: "advertiser-campaigns" */ '@/components/advertiser/Campaigns')
const Overview = () => import(/* webpackChunkName: "advertiser-campaign" */ '@/components/advertiser/campaign/Overview')
const Dashboard = () => import('@/components/advertiser/Dashboard')
const OpenProposals = () => import(/* webpackChunkName: "advertiser-campaign" */ '@/components/advertiser/campaign/OpenProposals')
const AcceptedProposals = () => import(/* webpackChunkName: "advertiser-campaign" */ '@/components/advertiser/campaign/AcceptedProposals')
const PublishedProposals = () => import(/* webpackChunkName: "advertiser-campaign" */ '@/components/advertiser/campaign/PublishedProposals')
const EditCampaign = () => import(/* webpackChunkName: "advertiser-campaign" */ '@/components/advertiser/campaign/EditCampaign')
const Messages = () => import('@/components/advertiser/Messages')
const Account = () => import('@/components/advertiser/Account')

// influencer
const InfluencerStart = () => import(/* webpackChunkName: "influencer-start" */ '@/components/influencer/account/Start')
const InfluencerCompleteProfile = () => import(/* webpackChunkName: "influencer-start" */ '@/components/influencer/account/CompleteProfile')
const InfluencerOpportunities = () => import('@/components/influencer/Opportunities')
const InfluencerWork = () => import('@/components/influencer/Work')
const InfluencerMessages = () => import('@/components/influencer/Messages')
const InfluencerAccount = () => import('@/components/influencer/Account')
const InfluencerDashboard = () => import('@/components/influencer/Dashboard')

// signup
const InfluencerSignup = () => import('@/components/signup/Influencer')
const AdvertiserSignup = () => import('@/components/signup/Advertiser')


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/advertiser',
      component: Advertiser,
      children: [
        {
          path: '',
          component: Dashboard,
          alias: 'dashboard'
        },
        {
          path: 'campaigns',
          component: Campaigns,
          name: 'campaignList'
        },
        {
          path: 'campaign/new',
          name: 'createCampaign',
          component: NewCampaign
        },
        {
          path: 'messages',
          name: 'messages',
          component: Messages
        },
        {
          path: 'account',
          name: 'account',
          component: Account
        },
        {
          path: 'campaign/:id',
          component: Campaign,
          children: [
            {
              path: '',
              component: Overview,
              alias: 'overview',
              name: 'viewCampaignOverview'
            },
            {
              path: 'proposals',
              component: OpenProposals,
              name: 'viewCampaignProposals'
            },
            {
              path: 'accepted',
              component: AcceptedProposals,
              name: 'viewCampaignAccepted'
            },
            {
              path: 'published',
              component: PublishedProposals,
              name: 'viewCampaignPublished'
            },
            {
              path: 'stats',
              component: Overview,
              name: 'viewCampaignStats'
            },
            {
              path: 'edit',
              component: EditCampaign,
              name: 'editCampaign'
            }
          ]
        },
        // {
        //   path: 'campaign/:id/open',
        //   component: CampaignOpen
        // },
        // {
        //   path: 'campaign/:id/accepted',
        //   component: CampaignAccepted
        // },
        // {
        //   path: 'campaign/:id/published',
        //   component: CampaignPublished
        // },
        // {
        //   path: 'campaign/:id/stats',
        //   component: CampaignStats
        // },
        // {
        //   path: 'account',
        //   component: Account
        // },
      ]
    },
    {
      path: '/influencer',
      component: Influencer,
      children: [
        {
          path: '',
          component: InfluencerDashboard,
          alias: 'dashboard'
        },
        {
          path: 'opportunities',
          component: InfluencerOpportunities,
          name: 'influencerOpportunities'
        },
        {
          path: 'work',
          component: InfluencerWork,
          name: 'influencerWork'
        },
        {
          path: 'messages',
          component: InfluencerMessages,
          name: 'influencerMessages'
        },
        {
          path: 'start',
          component: InfluencerStart,
          name: 'influencerStart'
        },
        {
          path: 'complete-profile',
          component: InfluencerCompleteProfile,
        },
        {
          path: 'account',
          component: InfluencerAccount,
          children: []
        }
      ]
    },
    {
      path: '/login',
      alias: '/',
      component: Signup,
      children: [
        {
          path: '',
          component: Login,
          name: 'login'
        }
      ]
    },
    {
      path: '/signup',
      component: Signup,
      children: [
        {
          path: 'influencer',
          component: InfluencerSignup,
        },
        {
          path: 'advertiser',
          component: AdvertiserSignup,
        }
      ]
    },
    {
      path: '/logout',
      beforeEnter: function (to, from, next) {
        this.a.app.$http.defaults.headers.common['Authorization'] = "";
        next('/login')
      }.bind(this)
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  console.log(store.state.user.authenticated)
  if (store.state.user.authenticated || to.path == '/login' || to.path.indexOf('/signup') > -1) {
    next()
    return
  }

  let token = localStorage.getItem('auth-token')
  let http = router.app.$http

  if (!token) {
    next('/login')
    return
  }

  http.defaults.headers.common['Authorization'] = "Bearer " + token

  http.get('user/me').then(response => {
    console.log(response)
    store.dispatch('authenticateUser', response.data).then(() => {
      next()
    })
  }).catch((error) => {
    console.error(error)
    next('/login')
  })

})

export default router