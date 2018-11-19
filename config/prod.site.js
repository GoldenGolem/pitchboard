
module.exports = {
  apiUrl: 'https://api.pitchboard.co',
  socketUrl: 'https://socket.pitchboard.co',
  authProviders: {
    facebook: {
      clientId: '1732249950417863',
      // redirectUri: 'http://localhost:8080/auth/callback', // Your client app URL,
      redirectUri: window.location.origin + '/auth/callback', // Your client app URL,
      url: '/auth/callback/facebook'
      // scope: ['email', 'public_profile', 'pages_show_list', 'user_birthday']
    },
    instagram: {
      clientId: 'c91b0ac9d73d467a859464afaa76b34e',
      redirectUri: window.location.origin + '/auth/callback',
      url: '/auth/callback/instagram'
    },
    twitter: {
      clientId: 'SsYEqLwWE4DQknTHBlxBBsb27',
      clientSecret: 'oSv0PpsVWhowpkWaGAqxyWRCKAMpxLjQXRqeZVn56F4XkovoXn',
      redirectUri: window.location.origin + '/auth/callback',
      url: '/auth/callback/twitter'
    },
    google: {
      clientId: '5558746869-mi1ebdhcimnrc3b55de22etqc3g779lc.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/auth/callback',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email	']
    }
  },
  intercom: {
    appId: 'rivc8o3y' // TODO change for production environment
  }
}