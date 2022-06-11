import cv2
from modules.utils import get_image, get_images, log_image


def find_one():

    username_confirm_button = cv2.imread(
        get_image(
            'username_confirm.png',
            __file__,
            'const_images'
        )
    )

    prefabs = get_images(
        __file__,
        'prefabs'
    )

    assert username_confirm_button is not None, 'Загрузи юзернейм конфирм пидор'

    results = []

    if not prefabs:
        raise Exception('Загрузи префабы пидор)')

    prefab_index : int = 0

    for prefab in prefabs:

        image = cv2.imread(prefab)

        result = cv2.matchTemplate(
            image=image,
            templ=username_confirm_button,
            method=cv2.TM_CCOEFF_NORMED
        )

        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

        if max_val >= 0.8:
            w, h = username_confirm_button.shape[1], username_confirm_button.shape[0]

            x, y = max_loc[0], max_loc[1]

            results.append(
                {
                    'max_val': max_val,
                    'w': w,  # match image w and h
                    'h': h,
                    'x': x,  # prefab's most up left corner coordinates
                    'y': y,
                    'prefab_index': prefab_index
                }
            )
            prefab_index += 1

    if not results:
        print('NO')
        exit(0)
    else:
        max_values = list(map(
            lambda x: x['max_val'],
            results
        ))

        max_value = max(max_values)

        max_value_index = max_values.index(max_value)

        center_point = (
            results[max_value_index]['x'] +
            results[max_value_index]['w'] // 2,
            results[max_value_index]['y'] +
            results[max_value_index]['h'] // 2
        )

        log_image(
            cv2.imread(
                get_image(
                    prefabs[results[max_value_index]['prefab_index']],
                    __file__,
                    'prefabs'
                )
            ),
            center_point,
            __file__
        )

        print(str(center_point[0]) + ':' + str(center_point[1]))
        exit(0)


def run():
    find_one()


def main():
    run()


if __name__ == '__main__':
    main()
