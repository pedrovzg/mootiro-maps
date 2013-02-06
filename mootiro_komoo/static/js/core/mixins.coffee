define (require) ->
  'use strict'

  _ = require 'underscore'


  PermissionMixin =
    defaultPermissions:
      view: true
      edit: true

    hasPermission: (action, user) ->
      permission = @permissions?[action] ? @defaultPermissions[action]

      if not permission
        return false

      if _.isFunction permission
        user ?= KomooNS.user
        permission = permission.apply this, [user]

      return permission


  EditOverlayMixin =
    _overlayTemplate: _.template require 'text!templates/core/_edit_overlay.html'
    # Change the overlayText content to display another text
    overlayText: i18n 'Edit this'

    setMode: (@mode=(@options.mode ? 'show')) ->
      if @mode is 'edit'
        @showOverlay()
      else
        @hideOverlay()

    showOverlay: (msg) ->
      @_overlay ?= $(@_overlayTemplate {msg: msg ? @overlayText})
      @$el.append @_overlay.css(
        marginTop: @$el.height() * -1,
        height: @$el.height()
      )

    hideOverlay: ->
      @_overlay?.detach()


  PermissionMixin: PermissionMixin
  EditOverlayMixin: EditOverlayMixin
