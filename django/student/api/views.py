from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
import uuid
import json
from django.core.cache import cache
import numpy as np
import mediapipe as mp
import os
import base64
import io
import datetime
from PIL import Image
import cv2
# Create your views here.

teacherId = 'HACKATHON'
students = [{"studentId": "19110448", "name": "Nguyen Duc Sang", "perAction": 0 },
        {"studentId": "19110498", "name": "Do Quoc Viet", "perAction": 0},
        {"studentId": "19110489", "name": "Luong Quoc Trung", "perAction": 0},
        {"studentId": "20133072", "name": "Le Tuan Nghia", "perAction": 0}]
list_student = []
studentId = ''

def setTime(check):
    if (check == 0):
        global startTimes
        startTimes = datetime.datetime.now()


def result(blog):

    z = blog[blog.find(b'iV'):]
    img = Image.open(io.BytesIO(base64.b64decode(z)))
    img = np.array(img.convert('RGB'), dtype=np.uint8)
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(r'C:\Code\HACKATHON\django\student\api\tranning\trainer\trainer.yml')
    cascadePath = "haarcascade_frontalface_default.xml"
    faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + cascadePath)
    font = cv2.FONT_HERSHEY_SIMPLEX
    id = 0
    minW = 64.0
    minH = 48.0
    img = cv2.flip(img, 1)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = faceCascade.detectMultiScale(
        rgb,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(int(minW), int(minH))
    )
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        gray = cv2.cvtColor(rgb[y:y + h, x:x + w], cv2.COLOR_RGB2GRAY)
        id, confidence = recognizer.predict(gray)
        if (confidence < 100):
            id = students[id]
            confidence = (round(100 - confidence))
            return (id['studentId'], confidence)
        else:
            id = "0"
            confidence = (round(100 - confidence))
            return (id, confidence)

class PhotoAPIView(APIView):
    def get_studentId(self):
         code = cache.get('studentId')
         return code

    def post(self, request):
        studentId = self.get_studentId()

        try:
            (check, resultCheck) = result(request.body)
        except:
            check = 0
            resultCheck = 0
        if check == studentId:
            for stu in students:
                if stu['studentId'] == studentId:
                    if resultCheck > 10:
                        print(stu['studentId'])
                        stu['perAction'] += 1
                        print(stu['perAction'])
        return Response(True)

class JoinMeetingAPIView(APIView):
    def generate_code(self):
        code = cache.get('generated_code')
        return code

    def get_list_student(self):
        list_student = cache.get('list_student')
        if list_student:
            return json.loads(list_student)
        else:
            return []

    def put(self, request):
        list_student = self.get_list_student()
        studentIdd = self.request.query_params.get('studentId')
        cache.set('studentId', studentIdd)
        if (self.request.query_params.get('generateCode') == cache.get("generated_code")):
            if (studentIdd not in list_student):
                list_student.append(studentIdd)
                cache.set('list_student', json.dumps(list_student))
            return Response(True)
        return Response(False)

    def get(self, request):
        if (self.request.query_params.get('teacherId') == teacherId):
            setTime(0)
            print(startTimes)
            if cache.get('generated_code') is not None:
                gen_code = cache.get('generated_code')
                return Response(gen_code)
            gen_code = str(uuid.uuid4())
            cache.set("generated_code", gen_code)
            cache.set('list_student', [])
            students = [{"studentId": "19110448", "name": "Nguyen Duc Sang", "perAction": 0 },
                        {"studentId": "19110498", "name": "Do Quoc Viet", "perAction": 0},
                        {"studentId": "19110489", "name": "Luong Quoc Trung", "perAction": 0},
                        {"studentId": "20133072", "name": "Le Tuan Nghia", "perAction": 0}]
            return Response(gen_code)
        return Response(False)

    def post(self, request):
        print("Check time now:")
        print(datetime.datetime.now())
        print("\n Check time start:")
        print(startTimes)
        total = (datetime.datetime.now() - startTimes).total_seconds() / 6
        print("\n Check time total:")
        print(total)
        return Response({
            'students': students,
            'total': total
        })
