import torch
from torchvision import transforms

def transform_tensor(batch):
    transform = transforms.Compose([
                transforms.ToTensor(),          # Convert image to PyTorch tensor
            ])

# Load the images from a directory
    # image_folder = 'path_to_images'
    image_list = []
    for img in batch:
        img_tensor = transform(img)  # Apply transformations
        image_list.append(img_tensor)
    image_batch = torch.stack(image_list)