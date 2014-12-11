require "rss"
require "open-uri"
require "feedjira"

class ClSearch
  # URL used for searching
  SEARCH_URL = "http://{city}.craigslist.org/search/{type}?format=rss&query="

  # List of cities that are our search scope
  CITIES = %w(
    losangeles
    sfbay
    newyork
    seattle
    sandiego
    chicago
    miami
    orangecounty
    phoenix
    atlanta
    dallas
    portland
    denver
    lasvegas
    tampa
    boston
    minneapolis
    washingtondc
    sacramento
    austin
    houstin
    inlandempire
    orlando
    philadelphia
    kansascity
    raleigh
    honolulu
    detroit
    charlotte
    stlouis
    newjersey
    pittsburgh
    columbus
    nh
    nashville
    baltimore
    boise
    spokane
    sanantonio
    sarasota
    milwaukee
    en
    norfolk
    fortmyers
    providence
    indianapolis
    cosprings
    jacksonville
    cnj
    louisville
    cincinnati
    southjersey
    albuquerque
    fresno
    maine
    cleveland
    grandrapids
    lexington
    saltlakecity
    madison
    oklahomacity
    ventura
    longisland
    santabarbara
    geo
    springfield
    tucson
    reno
    hudsonvalley
    knoxville
    slo
    greensboro
    richmond
    akroncanton
    tulsa
    charleston
    fortcollins
    neworleans
    newhaven
    rochester
    medford
    worcester
    omaha
    eugene
    daytona
    buffalo
    burlington
    hartford
    albany
    anchorage
    dayton
    memphis
    allentown
    palmsprings
    bend
    boulder
    bham
    wichita
    spacecoast
    westernmass
    jerseyshore
    harrisburg
  )

  # Type of searches: creative, or computer gigs
  TYPES = %w(crg cpg)

  def initialize(scope)
    @scope = if scope.is_a?(Symbol)
      CITIES
    else
      scope
    end
  end

  def search(type, keyword)
    urls, results = [], []
    @scope.each do |city|
      # setup url
      url = SEARCH_URL.sub("{city}", city)
      url = url.sub("{type}", type)
      url = "#{url}#{keyword}"
      urls << url
    end

    feeds = Feedjira::Feed.fetch_and_parse(urls)
    urls.each do |url|
      feed = feeds[url]
      next if feed.is_a?(Fixnum) # no results
      feed.entries.each do |entry|
        obj = {
          title: entry.title,
          date: entry.published,
          link: entry.url
        }
        results.push(obj)
      end
    end

    results
  end
end
