# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  resources :tasks
  resources :users

  namespace :api do
    namespace :v1 do
      resources :tasks, only: %i[index destroy]
    end
  end

  get 'hello/world'

  root to: redirect('/spa')

  # Catch all routes below `/spa`.
  get '/spa(/*path)' => 'spa#index'
end
