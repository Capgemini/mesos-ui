FROM mesosphere/mesos-master:VERSION
MAINTAINER alberto.garcial@hotmail.com
COPY build/master /web-ui/master
ENV MESOS_WEBUI_DIR /web-ui
