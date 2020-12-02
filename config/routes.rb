# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  get 'hello/world'

  root to: redirect('/spa')

  # Catch all routes below `/spa`.
  get '/spa(/*path)' => 'spa#index'
end
