<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      dark: true,
      drawer: true,
      drawers: ['Permanent', 'Persistent', 'Temporary'],
      primaryDrawer: {
        model: true,
        type: 'persistent',
        clipped: false,
        floating: false,
        mini: false
      },
      footer: {
        fixed: false
      }
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated
    },
    user() {
      return this.$store.state.user.data
    }
  },
  mounted() {
    this.$intercom.boot()
  },
  watch: {
    'authenticated': function () {
      this.$echo.connector.options.auth.headers['Authorization'] = this.$http.defaults.headers.common['Authorization']

      this.$intercom.update({
        user_id: this.user.id,
        email: this.user.email,
        created_at: this.user.created_at
      })

      if (this.user.advertiser) {
        this.$intercom.update({
          name: this.user.advertiser.name
        })
      } else if (this.user.influencer) {
        this.$intercom.update({
          name: this.user.influencer.name
        })
      }
    }
  }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/settings/_colors'

  $body-font-family := 'Nunito Sans', sans-serif

  @import '../node_modules/vuetify/src/stylus/settings/_theme'

  a
    color: #03a9f4
    text-decoration: none

  .theme--light .navbar a
    color: $body-color-dark
    text-decoration: none
    margin-right: 50px
    font-size: 18px
    font-weight: 300
    position: relative
    &:last-child
      margin-right: 0
    &:before
    &:after
      content: ''
      position: absolute
      left: 50%
      right: 50%
      bottom: 0
      height: 2px
      background: #03a9f4
      transition: left .3s, right .3s
    &:hover:before
    &:hover:after
      left: 0
      right: 0
    &.router-link-active
      font-weight: 500


  $material-light := {
    text: {
      primary: rgba(#000, .56),
      secondary: rgba(#000, .38),
      disabled: rgba(#000, .21)
    }
  }

  $container-max-widths := {
    lg: 1280px
    xl: 1280px
  }

  $grid-columns := 16

  $toolbar-height := 90px
  $toolbar-extension-height := 103px

  $badge-font-size := 12px

  $button-margin := 0
  $button-font-weight := 600

  $selection-switch-dark-enabled-color := rgba($light-blue.base, 1)
  $selection-switch-light-enabled-color := rgba($light-blue.base, 1)
  $selection-controls-active-color := rgba($light-blue.base, 1)

  $headings := {
    h1: { size: 112px, weight: 300, line-height: 1, letter-spacing: -.04em },
    h2: { size: 56px, weight: 300, line-height: 1.35, letter-spacing: -.02em },
    h3: { size: 45px, weight: 300, line-height: 48px, letter-spacing: normal },
    h4: { size: 30px, weight: 300, line-height: 40px, letter-spacing: normal },
    h5: { size: 24px, weight: 300, line-height: 32px, letter-spacing: normal },
    h6: { size: 20px, weight: 400, line-height: 1, letter-spacing: .02em },
    subheading: { size: 16px, weight: 400 },
    body-2: { size: 14px, weight: 500 },
    body-1: { size: 14px, weight: 400 },
    caption: { size: 12px, weight: 400 },
    button: { size: 14px, weight: 500 }
  }

  $badge-border-radius := 9px
  $badge-width := 28px
  $badge-height := 18px

  /** Input */
  $input-font-size-large := 22px
  $input-height-large := 40px

  .input-group--text-field.large
    input,
    textarea
      font-size: $input-font-size-large

  .input-group--text-field.large input
    height: $input-height-large


  $shadow-key-umbra-opacity = rgba(0,0,0, .1)
  $shadow-key-penumbra-opacity = rgba(0,0,0, .07)
  $shadow-key-ambient-opacity = rgba(0,0,0, .04)

  @import '../node_modules/vuetify/src/stylus/main'
</style>

<style>
  .application.theme--light {
    background: #f1f1f5;
  }

  .clickable {
    cursor: pointer;
  }

  .toolbar--thin .toolbar__content {
    height: 56px;
  }

  .container--footer {
    height: 200px;
    background-color: #2d2d2d;
    z-index: 2;
    flex: 1 1 auto;
  }

  footer.main {
    background-color: #2d2d2d;
  }

  .content--wrap {
    z-index: 3 !important;
  }

  .footer-effect {
    width: 100%;
    height: 180px;
    background-color: rgb(45, 45, 45);
    transform: skewY(-3.9deg);
    left: 0px;
    margin-top: -150px;
    margin-bottom: -80px;
    -webkit-backface-visibility: hidden;
    outline: 1px solid transparent;
  }

  .navbar {
    z-index: 4 !important;
  }

  /*.main-content {*/
    /*z-index: 2;*/
  /*}*/

  .content {
    z-index: 2 !important;
  }

  .tabs__slider {
    height: 3px;
  }

  .tabs:not(.tabs--centered):not(.tabs--grow):not(.tabs--mobile) .tabs__wrapper--scrollable {
    margin: 0;
  }

  .tabs:not(.tabs--grow):not(.tabs--mobile).tabs--condensed .tabs__item {
    padding: 0 12px;
  }

  .tabs.tabs--condensed .tabs__item {
    text-transform: none;
  }

  .tabs.tabs--condensed .tabs__item .icon {
    margin: 0;
    margin-right: 5px;
    font-size: 20px;
  }

  .theme--light .tabs .tabs__item.tabs__item--active {
    color: inherit;
  }

  .footer--absolute {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .b-r {
    border-right: 1px solid #eeeeee;
  }
  .b-l {
    border-left: 1px solid #eeeeee;
  }
  .b-t {
    border-top: 1px solid #eeeeee;
  }
  .b-b {
    border-bottom: 1px solid #eeeeee;
  }
  .b--darken {
    border-color: #cbcbcb;
  }
  .text--light {
    font-weight: 300;
  }
  .btn--layout {
    cursor: pointer;
  }
  .btn--layout:hover {
    background-color: #eeeeee;
  }
  /*.chip--small {*/
    /*height: 22px;*/
  /*}*/
  .ql-formats button {
    margin-bottom: 0 !important;
  }
  .quill-editor .ql-toolbar.ql-snow {
    border: 1px solid #eaeaea;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .quill-editor .ql-container.ql-snow {
    border: 1px solid #eaeaea;
  }

  .wrap-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    /*width: 100%;*/
  }
  .avatar {
    transition: all 0.1s ease-in-out;
  }
  .toolbar .toolbar__content {
    transition: all 0.1s ease-in-out;
  }

  .elevation-1 {
    box-shadow: 0 7px 14px 0 rgba(50,50,93,.1), 0 3px 6px 0 rgba(0,0,0,.07) !important;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  /*.pb-modal.card .card__title {*/
    /*background: #1e5799; !* Old browsers *!*/
    /*background: -moz-linear-gradient(top, #0aa3ff 0%, #109fe9 100%); !* FF3.6-15 *!*/
    /*background: -webkit-linear-gradient(top, #0aa3ff 0%,#109fe9 100%); !* Chrome10-25,Safari5.1-6 *!*/
    /*background: linear-gradient(to bottom, #0aa3ff 0%,#109fe9 100%); !* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ *!*/
    /*filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0aa3ff', endColorstr='#109fe9',GradientType=0 ); !* IE6-9 *!*/
  /*}*/
/**/
  /*.dialog--scrollable .card > .tabs > .card__text {*/
    /*overflow-y: auto;*/
    /*-webkit-backface-visibility: hidden;*/
    /*backface-visibility: hidden;*/
  /*}*/
/**/
  /*.dialog--scrollable .card > .tabs > .card__title, .dialog--scrollable > .card > .tabs > .card__actions {*/
    /*-webkit-box-flex: 1;*/
    /*-ms-flex: 1 0 auto;*/
    /*flex: 1 0 auto;*/
  /*}*/
/**/
  /*.dialog--scrollable .card > .tabs {*/
    /*display: -webkit-box;*/
    /*display: -ms-flexbox;*/
    /*display: flex;*/
    /*-webkit-box-flex: 1;*/
    /*-ms-flex: 1 1 auto;*/
    /*flex: 1 1 auto;*/
    /*-webkit-box-orient: vertical;*/
    /*-webkit-box-direction: normal;*/
    /*-ms-flex-direction: column;*/
    /*flex-direction: column;*/
  /*}*/

  .icon--small {
    font-size: 18px !important;
  }

  .icon--x-small {
    font-size: 14px !important;
  }

  .btn__content .icon--small {
    font-size: 14px !important;
  }

  .modal-sidebar {
    position: relative;
    overflow: hidden;
  }

  .modal-sidebar .modal-sidebar-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat !important;
    background-position: center center !important;
    background-size: cover !important;
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -o-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
    transform: scale(1.4);
    z-index: 99;

    /*PERFORMANCE*/
    /*-webkit-backface-visibility: hidden;*/
    /*-webkit-perspective: 1000;*/
    -webkit-transform: translate3d(0,0,0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    /*perspective: 1000;*/
    transform: translate3d(0,0,0);
    transform: translateZ(0);
  }

  .modal-sidebar .modal-sidebar-content {
    position: absolute;
    z-index: 100;
    display: block;
    top: 0; right: 0; bottom: 0; left: 0;
    background: rgba(0,0,0,0.75);
  }

  .modal-sidebar .campaign-title {
    font-size: 26px !important;
    font-weight: 600 !important;
    line-height: 28px;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.004);
  }

  .dialog.full-height {
    height: 100% !important;
  }

  .dialog.full-height .card {
    height: 100% !important;
  }

  .dialog:not(.dialog--fullscreen) {
    max-height: 100% !important;
  }

  .dialog .btn--close {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .flex.third {
    flex-basis: 33.33%;
    max-width: 33.33%
  }

  .social-color--text.facebook {
    color: #3b5998;
  }
  .social-color--text.instagram {
    color: #cd486b;
  }
  .social-color--text.twitter {
    color: #00aced;
  }
  .social-color--text.youtube {
    color: #C52F30;
  }
  .social-color--text.blog {
    color: #6d4638;
  }
  .social-color--bg.facebook {
    background-color: #3b5998;
    border-color: #3b5998;
  }
  .social-color--bg.instagram {
    background-color: #cd486b;
    border-color: #cd486b;
  }
  .social-color--bg.twitter {
    background-color: #00aced;
    border-color: #00aced;
  }
  .social-color--bg.youtube {
    background-color: #C52F30;
    border-color: #C52F30;
  }
  .social-color--bg.blog {
    background-color: #6d4638;
    border-color: #6d4638;
  }

  .i-flex {
    display: inline-flex;
  }

  .text--uppercase {
    text-transform: uppercase;
  }

  .expandable {
    overflow: hidden;
    transition: all 0.25s ease-out;
  }

</style>

<style lang="scss">
  .tooltip {
    display: block !important;
    z-index: 10000;

    .tooltip-inner {
      background: #616161;
      color: #fff;
      font-size: 12px;
      border-radius: 2px;
      padding: 5px 8px;
      box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.1), 0px 2px 2px 0px rgba(0,0,0,0.07), 0px 1px 5px 0px rgba(0,0,0,0.04);
    }

    .tooltip-arrow {
      display: none;
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
      border-color: black;
      z-index: 1;
    }

    &[aria-hidden='true'] {
      visibility: hidden;
      opacity: 0;
      transition: opacity .15s, visibility .15s;
    }

    &[aria-hidden='false'] {
      visibility: visible;
      opacity: 0.8;
      transition: opacity .15s;
    }
  }
</style>
