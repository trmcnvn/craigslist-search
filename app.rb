require "sinatra"
require "./lib/cl-search"

set :bind, '192.168.0.10'

get "/" do
  @cities = ClSearch::CITIES
  erb :index
end

post "/search" do
  scope = if params.has_key?("all_cities")
    :all
  else
    params[:cities]
  end
  redirect to("/") if scope.nil?
  @results = ClSearch.new(scope).search(params[:gig], params[:keyword])
  erb :search
end
