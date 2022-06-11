import cv2
from modules.utils import get_image, get_images

def find_one():

    cross_button = cv2.imread(
        get_image(
            'close_button.png',
            __file__,
            'const_images'
        )
    )

    prefabs = get_images(
        __file__,
        'prefabs'
    )

    assert cross_button is not None, 'Загрузи кросс баттон пидор'

    if not prefabs:
        raise Exception('Загрузи префабы пидор)')
    
    for prefab in prefabs:
    
        image = cv2.imread(prefab)

        result = cv2.matchTemplate(
            image = image,
            templ = cross_button,
            method=cv2.TM_CCOEFF_NORMED
        )

        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

        if max_val >= 0.8:
            print('YES')
            exit(0)
    
    print('NO')
    exit(0)


def run():
    find_one()   


def main():
    run()

if __name__ == '__main__':
    main()



