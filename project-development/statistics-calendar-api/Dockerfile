FROM python:3.7.1
RUN mkdir -p /opt/app
WORKDIR /opt/app
ADD . /opt/app
RUN pip3 install -r requirements.txt
EXPOSE 3000
CMD python3 App.py