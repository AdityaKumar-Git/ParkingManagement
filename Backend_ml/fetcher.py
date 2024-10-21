import cv2
import threading
from processor import capture_image, process_images_to_find_occupancy


def fetch_and_update():
    ips = ["192.168.1.10", "192.168.1.11", "192.168.1.12"]  # List of IPs
    indexs = [  # Example of indexs with (ip, x_center, y_center, w, h, id)
        ("192.168.1.10", 0.5, 0.5, 0.2, 0.2, "person1"),
        ("192.168.1.11", 0.4, 0.4, 0.15, 0.25, "person2"),
        ("192.168.1.12", 0.3, 0.3, 0.1, 0.2, "person3")
    ]

    batch = []  # Store captured images
    threads = []
    lock = threading.Lock()

    # Capture images from cameras concurrently using threads
    def capture_and_store(ip):
        image = capture_image(ip)  # Assume this returns a captured image
        with lock:
            batch.append(image)  # Store image directly in the batch list

    # Start threads to capture images
    for ip in ips:
        thread = threading.Thread(target=capture_and_store, args=(ip))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    # List to store the cropped images along with bounding box details
    cropped_image_list = []

    # Map images from batch to the corresponding IP using the index of the IP in the ips list
    for data in indexs:
        x_center, y_center, w, h, ip, obj_id = data

        # Find the index of the current IP in the ips list
        ip_index = ips.index(ip)

        # Get the corresponding image from the batch using the index
        if ip_index < len(batch):  # Check to avoid index errors
            image = batch[ip_index]
            img_height, img_width = image.shape[:2]  # Get the image dimensions

            # Convert normalized YOLO coordinates to pixel coordinates
            box_w = int(w * img_width)
            box_h = int(h * img_height)
            box_x = int((x_center * img_width) - (box_w / 2))
            box_y = int((y_center * img_height) - (box_h / 2))

            # Ensure bounding box is within the image bounds
            box_x = max(0, box_x)
            box_y = max(0, box_y)
            box_w = min(box_w, img_width - box_x)
            box_h = min(box_h, img_height - box_y)

            # Crop the image using the calculated coordinates
            cropped_image = image[box_y:box_y+box_h, box_x:box_x+box_w]

            # Add cropped image and its associated id to the list
            cropped_image_list.append({
                'image': cropped_image,
                'id': obj_id
            })

    # Now `cropped_image_list` contains cropped images with their associated ids
    return process_images_to_find_occupancy(cropped_image_list)
