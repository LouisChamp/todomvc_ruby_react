json.extract! user, :id, :name, :email, :dob, :description, :active, :created_at, :updated_at
json.url user_url(user, format: :json)
