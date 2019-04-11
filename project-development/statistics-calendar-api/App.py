from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from CalendarService import CalendarService
from StatisticsService import StatisticsService
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)

calendar_service = CalendarService()
statistics_service = StatisticsService()


@app.route('/api/login', methods=['GET'])
def log_in():
    return jsonify({'url': calendar_service.get_log_in_url()})


@app.route('/api/logout', methods=['GET'])
def log_out():
    authorization = request.headers.get('authorization')
    calendar_service.log_out(authorization)
    return jsonify({'message': 'logged out'})


@app.route('/api/token', methods=['GET'])
def get_token():
    code = request.args.get('code')
    response, status = calendar_service.get_token(code)
    return jsonify(response), status


@app.route('/api/user/info', methods=['GET'])
def get_user_info():
    authorization = request.headers.get('authorization')
    response, status = calendar_service.get_user_info(authorization)
    return jsonify(response), status


@app.route('/api/calendars', methods=['GET'])
def get_calendars():
    authorization = request.headers.get('authorization')
    response, status = calendar_service.get_calendars(authorization)
    return jsonify(response), status


@app.route('/api/calendars/<path:calendar_id>/events', methods=['GET'])
def get_calendar_events(calendar_id):
    authorization = request.headers.get('authorization')
    response, status = calendar_service.get_calendar_events(authorization, calendar_id)
    return jsonify(response), status


@app.route('/api/calendars/<path:calendar_id>/events/<path:event_id>/properties', methods=['PATCH'])
def add_event_properties(calendar_id, event_id):
    authorization = request.headers.get('authorization')
    properties = request.json
    response, status = calendar_service.add_event_properties(authorization, calendar_id, event_id, properties)
    return jsonify(response), status


@app.route('/api/calendars/<path:calendar_id>/events/statistics/time-spent', methods=['GET'])
def get_time_spent_statistics(calendar_id):
    authorization = request.headers.get('authorization')
    time_min = request.args.get('timeMin', None)
    time_max = request.args.get('timeMax', None)
    response, status = calendar_service.get_calendar_events(authorization, calendar_id, time_min, time_max)

    if status == 200:
        events = response['items']
        bytes_image = statistics_service.get_time_spent_statistics(events)
        return send_file(bytes_image, mimetype='image/png')

    return jsonify(response), status


@app.route('/api/calendars/<path:calendar_id>/events/statistics/used-remaining-budget', methods=['GET'])
def get_used_remaining_budget_statistics(calendar_id):
    authorization = request.headers.get('authorization')
    time_now = request.args.get('timeNow')
    response_past_events, status1 = calendar_service.get_calendar_events(authorization, calendar_id, time_max=time_now)
    response_future_events, status2 = calendar_service.get_calendar_events(authorization, calendar_id, time_min=time_now)

    if status1 == 200 and status2 == 200:
        past_events = response_past_events['items']
        future_events = response_future_events['items']
        bytes_image = statistics_service.get_used_remaining_budget_statistics(past_events, future_events)
        return send_file(bytes_image, mimetype='image/png')

    return jsonify({'error': response_past_events}), status1


@app.errorhandler(Exception)
def error_handler(error):
    status = 500

    if type(error) is TypeError or type(error) is KeyError:
        status = 400

    return jsonify({'error': str(error)}), status


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
