class Api::V1::TasksController < ApplicationController
  def index
    render json: Task.all
  end

  def show
    render json: Task.find(params[:id])
  end
end
