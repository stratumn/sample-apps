FROM golang:1.11.2

RUN go get -u github.com/stratumn/go-core
RUN go get -u github.com/golang/dep/cmd/dep
WORKDIR ${GOPATH}/src/github.com/stratumn/go-core
RUN dep ensure

WORKDIR /
RUN mkdir /validation
WORKDIR /validation