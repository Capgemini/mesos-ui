# Mesos UI

[![Join the chat at https://gitter.im/Capgemini/mesos-ui](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Capgemini/mesos-ui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![wercker status](https://app.wercker.com/status/3e566621ba967bfeb6ee57a76ddf42cc/s/master "wercker status")](https://app.wercker.com/project/bykey/3e566621ba967bfeb6ee57a76ddf42cc)
[![Code Climate](https://codeclimate.com/github/Capgemini/mesos-ui/badges/gpa.svg)](https://codeclimate.com/github/Capgemini/mesos-ui)
[![Test Coverage](https://codeclimate.com/github/Capgemini/mesos-ui/badges/coverage.svg)](https://codeclimate.com/github/Capgemini/mesos-ui/coverage)

A responsive, realtime dashboard for Apache Mesos built using Node.js, React.js.

![dashboard](docs/mesos-ui.gif)

## Usage as standalone while keeping the default Mesos UI.

You can run and deploy this app in standalone mode via docker like:

```docker run -p 5000:5000 -e ZOOKEEPER_ADDRESS="ip1:2181,ip2:2181,ip3:2181" capgemini/mesos-ui:standalone-$TAG```

or using marathon:

replace ZOOKEEPER_ADDRESS with the address of your zookeeper instances and run:

``` curl -X POST -HContent-Type:application/json -d @marathon.json http://MARATHON_ENDPOINT:8080/v2/apps ```

## Usage as a replacement for the default Mesos UI.

The quickest way to check it out is just run:

``` docker run --net=host -e MESOS_LOG_DIR=/logs capgemini/mesos-ui:latest ```

And you should be able to access to 127.0.0.1:5050 via browser.

## Powered By Mesos UI
Organisations using Mesos UI. If your company uses Mesos UI, we would be glad to get your feedback :) 

- Capgemini
- [Gumtree AU - Ebay Classifieds group](https://www.gumtree.com.au) 
- [今日头条 - Toutiao](http://app.toutiao.com/news_article/)



