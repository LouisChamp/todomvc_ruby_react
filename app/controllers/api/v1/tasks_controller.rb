class Api::V1::TasksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    # sleep 5

    render json: User.last.tasks
  end

  def destroy
    task = Task.find(params[:id])

    task.destroy
  end
end
