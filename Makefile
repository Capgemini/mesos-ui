.PHONY: all build_ui_snapshot build

MESOS_VERSION ?= latest

MESOS_UI_VERSION ?= latest

all: build

build_ui_snapshot:
	git checkout tags/$(MESOS_UI_VERSION)
	gulp build

build: build_ui_snapshot
	sed "s/VERSION/$(MESOS_VERSION)/g" Dockerfile > TempDockerfile
	docker build -f TempDockerfile -t capgemini/mesos-ui:$(MESOS_UI_VERSION) .
