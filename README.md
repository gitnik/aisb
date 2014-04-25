AISB
====

#### AISB is AI's Server Browser...
* built on top of [angular.js](http://angularjs.org/)
* that has a set of unique features such as
  * repository fallback -> done
  * flags identifying a server's country (and caching thereof) -> todo
  * reloading data when a user comes back to the site (instead of reloading every x seconds) -> todo
  * an advanced search -> done
  * let the user add the armagetron protocol: -> done
     
* other things that I will add later:
  * more detailed view for a single server
  * sorting (eu, us etc)
  * sharing of searches/servers
  * clans (taken from epsys server browser)
  * nicer options menu -> gear icon that kind of "unfolds"
  * allow users to show empty servers
  * server grouping by EU & USA
  * nicer handling of failed ressource loading (put it into the controller?)
  * notification-sound once a server reaches a user-defined amount of player


* bugs
  * the message saying how many servers there are should only show those with numPlayers > 0, unless searchQuery is not empty
