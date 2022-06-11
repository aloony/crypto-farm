import cv2
from modules.utils import get_images, log_image, get_image


def find_one():

    eggs = get_images(
        __file__,
        'const_images',
        'eggs'
    )
    prefabs = get_images(
        __file__,
        'prefabs'
    )

    if not prefabs:
        raise Exception('Загрузи префабы пидор)')

    if not eggs:
        raise Exception('Загрузи яйца пидор)')

    results = []

    for egg_path in eggs:

        egg_image = cv2.imread(egg_path)

        prefab_index: int = 0

        for prefab_path in prefabs:

            prefab_image = cv2.imread(prefab_path)

            result = cv2.matchTemplate(
                image=prefab_image,
                templ=egg_image,
                method=cv2.TM_CCOEFF_NORMED
            )

            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

            if max_val >= 0.8:  # 0.8 by default

                w, h = egg_image.shape[1], egg_image.shape[0]

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
