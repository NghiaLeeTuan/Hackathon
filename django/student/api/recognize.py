import cv2
import numpy as np
import os
import base64
import io
from PIL import Image


def result(blog):
    names = ['Nguyen Duc Sang', 'Do Quoc Viet', 'Luong Quoc Trung', 'Le Tuan Nghia']
    z = blog[blog.find('iV'):]
    img = Image.open(io.BytesIO(base64.b64decode(z)))
    img = np.array(img.convert('RGB'), dtype=np.uint8)

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('trainer/trainer.yml')
    cascadePath = "haarcascade_frontalface_default.xml"
    faceCascade = cv2.CascadeClassifier(cascadePath);

    font = cv2.FONT_HERSHEY_SIMPLEX

    id = 0



    # blog = blog.read()


    # cam = cv2.VideoCapture(0)
    # cam.set(3, 640)
    # cam.set(4, 480)

    minW = 64.0
    minH = 48.0


    # ret, img = cam.read()
    img = cv2.flip(img, 1)

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    faces = faceCascade.detectMultiScale(
        rgb,
        scaleFactor = 1.2,
        minNeighbors = 5,
        minSize = (int(minW),int(minH))
    )

    for (x,y,w,h) in faces:

        cv2.rectangle(img, (x,y), (x+w, y+h), (0, 255, 0), 2)

        gray = cv2.cvtColor(rgb[y:y + h, x:x + w], cv2.COLOR_RGB2GRAY)

        id, confidence = recognizer.predict(gray)

        if (confidence < 100):
            id = names[id]
            confidence = " {0}%".format(round(100 - confidence))
            return (id,confidence)
        else:
            result = "unknow"
            return (result,null)

        #     cv2.putText(img, str(id), (x+5, y-5), font, 1, (255, 255, 255), 2)
        #     cv2.putText(img, str(confidence), (x+5, y+h-5), font, 1, (255, 255, 0), 1)
        #     while(True):
        #         cv2.imshow('nhan dien khuon mat', img)
        #         cv2.waitKey(10)
        #
        #     # k = cv2.waitKey(10) & 0xff
        #     # if k == 27:
        #
        #
        # print("\n [INFO] Thoat")
        # # cam.release()
        # cv2.destroyAllWindows()