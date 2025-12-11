FROM python:latest

WORKDIR /app
COPY ka.py /app/

RUN pip install flask

EXPOSE 8085
CMD ["python", "ka.py"]