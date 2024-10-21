import threading
import cv2
import torch
import numpy as np
from ultralytics import YOLO
from utils import transform_tensor
from model import KitModel

model = YOLO(
    r'D:\Parking_simulator\code\runs\detect\cos_lr_0.01_0.9_1005\weights\best.pt').cuda()
model_prob = KitModel(
    r"D:\Parking_simulator\code\model\ff16c4e703d34d529098e3eea37853f8.npy").cuda()


def find_probs(batch):
    solutions = model_prob(batch.cuda()).detach().cpu().numpy()
    return [solution[0] for solution in solutions]

# Placeholder for the blackbox method


def Detections(batch_images):
    results = model(batch_images.cuda())

    detections = []
    for result in results:
        detection_result = []
        for box in result.boxes:
            detection_result.append({
                'bbox': box.xyxy.tolist(),  # Get the bounding box coordinates
                'confidence': box.conf.item(),  # Confidence score
                'label': model.names[int(box.cls)]  # Get the label
            })
        detections.append(detection_result)

    return detections


def capture_image(ip, batch, lock):
    # Capture a single image from the camera
    cap = cv2.VideoCapture(f'http://{ip}/video')  # Adjust the URL as necessary
    ret, frame = cap.read()
    cap.release()

    if ret:
        # Convert the frame to a format suitable for YOLO
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
        return frame
    else:
        print(f"Failed to capture image from {ip}")


def process_cameras(camera_ips):
    batch = []
    threads = []
    lock = threading.Lock()

    for ip in camera_ips:
        thread = threading.Thread(target=capture_image, args=(ip, batch, lock))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    image_batch = transform_tensor(batch)

    if batch:
        # Send the batch to the blackbox method
        return batch, Detections(image_batch)
    else:
        return None


def images_to_tensor(cropped_image_list, batch_size=4, target_size=(224, 224)):
    images = []

    # Process each cropped image
    for item in cropped_image_list:
        image = item['image']  # Get the image
        # Resize to the target size (e.g., 224x224)
        img_resized = cv2.resize(image, target_size)

        # Convert the image from BGR (OpenCV format) to RGB and normalize it (0-1 range)
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        img_normalized = img_rgb / 255.0

        # Convert the image to a tensor and rearrange dimensions to (channels, height, width)
        img_tensor = torch.tensor(
            img_normalized, dtype=torch.float32).permute(2, 0, 1)

        images.append(img_tensor)

    # Stack all images into a single tensor of shape (total_images, channels, height, width)
    images_tensor = torch.stack(images)

    # Split the tensor into batches of size `batch_size`
    batches = torch.split(images_tensor, batch_size)

    return batches


def process_images_to_find_occupancy(cropped_image_list, batch_size=64, target_size=(224, 224)):
    # Convert the images to batches of tensors
    batches = images_to_tensor(cropped_image_list, batch_size, target_size)

    # Dictionary to store the results {id: True/False}
    results = {}

    # Keep track of current index in the original image list (because batches split images)
    current_index = 0

    # Process each batch
    for batch in batches:
        # Send the batch to the blackbox and get the list of probabilities
        probabilities = find_probs(batch)

        # Process the probabilities and assign True/False based on the threshold
        for prob in probabilities:
            item_id = cropped_image_list[current_index]['id']
            # Convert tensor to float and check threshold
            results[item_id] = prob.item() > 0.5
            current_index += 1

    return results
