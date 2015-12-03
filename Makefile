.PHONY: all build_ui_snapshot build

MESOS_VERSION ?= latest

MESOS_UI_VERSION ?= latest

all: build_mesos_image build_standalone_image

build_ui_snapshot:
	git checkout tags/$(MESOS_UI_VERSION)
	gulp build

build_mesos_image: build_ui_snapshot
	sed "s/VERSION/$(MESOS_VERSION)/g" DockerfileMesos > TempDockerfile
	docker build -f TempDockerfile -t capgemini/mesos-ui:$(MESOS_UI_VERSION) .

build_standalone_image:
  docker build -t capgemini/mesos-ui:standalone-$(MESOS_UI_VERSION) .
