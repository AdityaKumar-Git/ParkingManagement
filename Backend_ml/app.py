from flask import Flask, request, jsonify
from processor import process_cameras
from fetcher import fetch_and_update

app = Flask(__name__)


@app.route('/update')
def update_parking():
    return fetch_and_update()


@app.route('/save_capture', methods=['POST'])
def save_capture():
    data = request.get_json()
    result = data.get('results', [])
    camera_ips = data.get('ip', [])
    lots = data.get('lots', [])
    for i, r in enumerate(result):
        for j, q in enumerate(r):
            q.append(camera_ips[i])
            q.append(lots[sum + j])
        sum += len(r)
    
    if result is not None:
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'failure', 'message': 'No images captured'}), 500


@app.route('/capture', methods=['POST'])
def capture_route():
    data = request.get_json()
    camera_ips = data.get('ip', [])
    if not camera_ips:
        return jsonify({'error': 'No camera IPs provided'}), 400

    # Process the cameras and get the result
    images, result = process_cameras(camera_ips)
    if result is not None:
        return jsonify({'status': 'success', 'data': {"boxes": result, "images": images}}), 200
    else:
        return jsonify({'status': 'failure', 'message': 'No images captured'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
