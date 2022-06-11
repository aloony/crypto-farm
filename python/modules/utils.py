import os
import random
import string
import cv2

def generate_ots():

    S = 10

    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))

    return ran

def get_image(filename, exec_path, *args):    
    path = os.path.join(
        os.path.dirname(os.path.abspath(exec_path)),
        *args,
        filename
    )
    return path

def get_images(exec_path, *args):
    output = []

    path = os.path.join(
        os.path.dirname(
            os.path.abspath(exec_path)
        ),
        *args
    )

    for root, dirs, files in os.walk(path):
        for file in files:
            output.append(os.path.join(root, file))

    return output

def log_image(image, center_coordinates, exec_path):

    path = os.path.join(
        os.path.dirname(os.path.abspath(exec_path)),
        'logs'
    )

    path = os.path.join(path, f'{generate_ots()}.png')

    image = cv2.circle(
        image,
        center_coordinates,
        10,
        (255, 0, 0),
        2
    )
    cv2.imwrite(path, image)