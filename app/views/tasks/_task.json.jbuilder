json.extract! task, :id, :title, :completed, :user_id, :created_at, :updated_at
json.url task_url(task, format: :json)
